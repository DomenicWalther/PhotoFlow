import { derived } from "svelte/store";

import { tasks } from "./TaskStore";

import type { Task } from "$lib/types/Task";

interface TaskPriority {
	task: Task;

	priority: number;

	estimatedDuration: number;

	riskLevel: "low" | "medium" | "high";

	recommendation: string;

	confidence: number; // Neue Eigenschaft für die Konfidenz der Schätzung
}

interface TaskPattern {
	personCount: number;

	material: string;

	averageCompletionTime: number;

	successRate: number;

	seasonalFactor: number;

	complexity: number;

	occurrences: number;
}

interface EmergingPattern {
	term: string;

	occurrences: number;

	firstSeen: Date;

	lastSeen: Date;

	correlations: {
		processingTime: number[];

		associatedTerms: Map<string, number>;

		status: Map<string, number>;
	};

	impact: {
		timeMultiplier: number;

		complexity: number;

		confidence: number;
	};
}

interface TaskFeedback {
	predictedDuration: number;

	actualDuration: number;

	accuracy: number;

	factors: {
		personCount: number;

		material: string;

		complexity: number;

		seasonality: number;
	};
}

interface WorkloadMetrics {
	openTasksCount: number;

	averageWeeklyTasks: number;

	currentWeekTasks: number;

	statusDistribution: Map<string, number>;

	impactFactors: {
		personCount: number; // Dynamischer Faktor für Personenanzahl

		material: number; // Dynamischer Faktor für Material

		workload: number; // Auslastungsfaktor

		seasonal: number; // Saisonaler Einfluss
	};
}

// Muster-Erkennung und Analyse

// Helfer-Funktion für Fuzzy Matching

function levenshteinDistance(a: string, b: string): number {
	const matrix: number[][] = [];

	for (let i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1,

					matrix[i][j - 1] + 1,

					matrix[i - 1][j] + 1,
				);
			}
		}
	}

	return matrix[b.length][a.length];
}

function fuzzyMatch(text: string, pattern: string, threshold = 0.7): boolean {
	text = text.toLowerCase();

	pattern = pattern.toLowerCase();

	// Exakte Übereinstimmung

	if (text.includes(pattern)) return true;

	// Teile den Text in Wörter

	const words = text.split(/\s+/);

	// Prüfe jedes Wort auf Ähnlichkeit

	for (const word of words) {
		const maxLength = Math.max(word.length, pattern.length);

		const distance = levenshteinDistance(word, pattern);

		const similarity = (maxLength - distance) / maxLength;

		if (similarity >= threshold) return true;
	}

	return false;
}

class TaskAnalyzer {
	private patterns: Map<string, TaskPattern> = new Map();

	private seasonalPatterns: Map<number, number> = new Map();

	private taskCache: Map<string, TaskCharacteristics> = new Map(); // Cache für bereits analysierte Tasks

	private similarityCache: Map<string, Set<string>> = new Map(); // Cache für Ähnlichkeitsberechnungen

	private emergingPatterns: Map<string, EmergingPattern> = new Map();

	private feedbackHistory: Map<string, TaskFeedback[]> = new Map();

	private learningRate = 0.1; // Wie schnell der Algorithmus aus neuen Daten lernt

	private workloadMetrics: WorkloadMetrics;

	constructor(historicalTasks: Task[]) {
		this.workloadMetrics = this.calculateWorkloadMetrics(historicalTasks);

		this.analyzePastTasks(historicalTasks);

		this.processFeedbackFromHistory(historicalTasks);
	}

	private processFeedbackFromHistory(tasks: Task[]) {
		const completedTasks = tasks.filter(
			(t) => t.is_finished && t.completedAt && t.startedAt,
		);

		for (const task of completedTasks) {
			const actualDuration =
				new Date(task.completedAt!).getTime() -
				new Date(task.startedAt!).getTime();

			const characteristics = this.extractTaskCharacteristics(task);

			const pattern = this.patterns.get(this.getPatternKey(characteristics));

			if (pattern) {
				const predictedDuration = pattern.averageCompletionTime;

				this.processFeedback(task, predictedDuration, actualDuration);
			}
		}
	}

	private processFeedback(
		task: Task,
		predictedDuration: number,
		actualDuration: number,
	) {
		const characteristics = this.extractTaskCharacteristics(task);

		const key = this.getPatternKey(characteristics);

		// Berechne Genauigkeit der Vorhersage

		const accuracy = Math.min(
			predictedDuration / actualDuration,

			actualDuration / predictedDuration,
		);

		const feedback: TaskFeedback = {
			predictedDuration,

			actualDuration,

			accuracy,

			factors: {
				personCount: characteristics.personCount,

				material: characteristics.material,

				complexity: this.calculateComplexity(characteristics),

				seasonality:
					this.seasonalPatterns.get(new Date(task.dueAt).getMonth()) || 1,
			},
		};

		// Speichere Feedback

		const existingFeedback = this.feedbackHistory.get(key) || [];

		this.feedbackHistory.set(key, [...existingFeedback, feedback]);

		// Aktualisiere Pattern basierend auf Feedback

		this.updatePatternFromFeedback(key, feedback);
	}

	private updatePatternFromFeedback(key: string, feedback: TaskFeedback) {
		const pattern = this.patterns.get(key);

		if (!pattern) return;

		// Gewichtete Anpassung der durchschnittlichen Bearbeitungszeit

		const currentWeight = 1 - this.learningRate;

		const newWeight = this.learningRate;

		pattern.averageCompletionTime =
			pattern.averageCompletionTime * currentWeight +
			feedback.actualDuration * newWeight;

		// Aktualisiere Erfolgsrate

		pattern.successRate =
			pattern.successRate * currentWeight + feedback.accuracy * newWeight;

		// Passe Komplexitätsfaktoren an

		if (feedback.actualDuration > feedback.predictedDuration * 1.5) {
			pattern.complexity *= 1.1; // Erhöhe Komplexität
		} else if (feedback.actualDuration < feedback.predictedDuration * 0.75) {
			pattern.complexity *= 0.9; // Verringere Komplexität
		}

		this.patterns.set(key, pattern);
	}

	private buildIndices(tasks: Task[]) {
		// Erstelle Indices für schnellere Suche

		const personCountIndex = new Map<number, Set<Task>>();

		const materialIndex = new Map<string, Set<Task>>();

		for (const task of tasks) {
			const characteristics = this.extractTaskCharacteristics(task);

			const cacheKey = `${task.id}-${task.additional_information}`;

			this.taskCache.set(cacheKey, characteristics);

			// Indexiere nach Personenanzahl

			if (!personCountIndex.has(characteristics.personCount)) {
				personCountIndex.set(characteristics.personCount, new Set());
			}

			personCountIndex.get(characteristics.personCount)?.add(task);

			// Indexiere nach Material

			if (!materialIndex.has(characteristics.material)) {
				materialIndex.set(characteristics.material, new Set());
			}

			materialIndex.get(characteristics.material)?.add(task);
		}

		// Pre-compute Ähnlichkeiten für häufige Kombinationen

		for (const [personCount, taskSet] of personCountIndex) {
			for (const task of taskSet) {
				const similarTasks = new Set<string>();

				const characteristics = this.taskCache.get(
					`${task.id}-${task.additional_information}`,
				);

				if (characteristics) {
					const materialTasks = materialIndex.get(characteristics.material);

					if (materialTasks) {
						for (const similarTask of materialTasks) {
							if (similarTask.id !== task.id) {
								similarTasks.add(
									`${similarTask.id}-${similarTask.additional_information}`,
								);
							}
						}
					}
				}

				this.similarityCache.set(
					`${task.id}-${task.additional_information}`,

					similarTasks,
				);
			}
		}
	}

	private findSimilarTasksOptimized(task: Task): Task[] {
		const cacheKey = `${task.id}-${task.additional_information}`;

		const similarTaskIds = this.similarityCache.get(cacheKey);

		if (!similarTaskIds) return [];

		return Array.from(similarTaskIds).map((id) => {
			const [taskId] = id.split("-");

			return { id: parseInt(taskId) } as Task;
		});
	}

	private analyzePastTasks(tasks: Task[]) {
		// Analysiere saisonale Muster

		const monthlyLoad = new Map<number, number>();

		tasks.forEach((task) => {
			const month = new Date(task.dueAt).getMonth();

			monthlyLoad.set(month, (monthlyLoad.get(month) || 0) + 1);
		});

		// Normalisiere saisonale Faktoren

		const maxLoad = Math.max(...Array.from(monthlyLoad.values()));

		monthlyLoad.forEach((value, month) => {
			this.seasonalPatterns.set(month, value / maxLoad);
		});

		// Analysiere Task-Muster

		tasks

			.filter((t) => t.is_finished)

			.forEach((task) => {
				const characteristics = this.extractTaskCharacteristics(task);

				const key = this.getPatternKey(characteristics);

				const existingPattern = this.patterns.get(key) || {
					personCount: characteristics.personCount || 1,

					material: characteristics.material || "standard",

					averageCompletionTime: 0,

					successRate: 0,

					seasonalFactor: 1,

					complexity: this.calculateComplexity(characteristics),

					occurrences: 0,
				};

				existingPattern.occurrences++;

				existingPattern.averageCompletionTime = this.updateRunningAverage(
					existingPattern.averageCompletionTime,

					this.estimateCompletionTime(task),

					existingPattern.occurrences,
				);

				this.patterns.set(key, existingPattern);
			});
	}

	private extractTaskCharacteristics(task: Task) {
		const description = task.additional_information.toLowerCase();

		// Flexiblere Personenerkennung mit Fuzzy Matching

		let personCount = 1; // Standardwert

		const personPatterns = [
			/(\d+)\s*(?:pers|person|personen|p\b|people|mann|frau|erwachsene|erw)/i,

			/familie.*?(\d+)/i,

			/gruppe.*?(\d+)/i,

			/(\d+).*?(?:personen|leute|menschen)/i,
		];

		// Normalisiere häufige Schreibweisen

		const normalizedDesc = description

			.replace(/ae/g, "ä")

			.replace(/oe/g, "ö")

			.replace(/ue/g, "ü");

		for (const pattern of personPatterns) {
			const match = normalizedDesc.match(pattern);

			if (match?.[1]) {
				const num = Number.parseInt(match[1]);

				if (!Number.isNaN(num) && num > 0) {
					personCount = num;

					break;
				}
			}
		}

		// Flexiblere Materialerkennung mit Fuzzy Matching

		const materialKeywords = {
			leinwand: ["leinwand", "canvas", "keilrahmen", "lw"],

			platte: ["platte", "alu", "dibond", "forex", "aludibond", "aluverbund"],

			leinenstruktur: [
				"leinen",

				"struktur",

				"textured",

				"leinenstruktur",

				"strukturiert",
			],
		};

		let material = "standard";

		let highestSimilarity = 0;

		for (const [mat, keywords] of Object.entries(materialKeywords)) {
			for (const keyword of keywords) {
				if (fuzzyMatch(normalizedDesc, keyword)) {
					material = mat;

					break;
				}
			}
		}

		// Zusätzliche Komplexitätsindikatoren mit Fuzzy Matching

		const complexityFactors = {
			hasSpecialRequirements: [
				"spezial",

				"special",

				"besonder",

				"extra",

				"sonder",
			].some((term) => fuzzyMatch(normalizedDesc, term)),

			isRush: [
				"eilig",

				"dringend",

				"express",

				"rush",

				"schnell",

				"sofort",
			].some((term) => fuzzyMatch(normalizedDesc, term)),

			hasMultipleFormats:
				(normalizedDesc.match(/\d+\s*x\s*\d+/g) || []).length > 1,
		};

		return {
			personCount,

			material,

			complexityFactors,
		};
	}

	private getPatternKey(characteristics: {
		personCount: number;

		material: string;
	}): string {
		return `${characteristics.personCount}-${characteristics.material}`;
	}

	private calculateProcessingTimeByPersonCount(personCount: number): number {
		// Logarithmische Skalierung für die Bearbeitungszeit

		// Bei wenigen Personen (1-3) ist die Skalierung noch fast linear

		// Danach flacht sie stark ab

		if (personCount <= 0) return 24 * 60 * 60 * 1000; // 1 Tag Minimum

		const baseTime = 24 * 60 * 60 * 1000; // Ein Tag in Millisekunden

		const scaleFactor = Math.log10(personCount + 1) * 1.5;

		return baseTime * Math.max(1, scaleFactor);
	}

	private calculateActualProcessingTime(task: Task): number {
		if (!task.is_finished) return 0;

		// Zeit zwischen Erstellung und Fertigstellung
		const startTime = new Date(task.created_at).getTime();
		const endTime = new Date(task.dueAt).getTime(); // Wenn is_finished, dann wurde es zur Deadline fertig
		
		return endTime - startTime;
	}

	private estimateCompletionTime(task: Task): number {
		const characteristics = this.extractTaskCharacteristics(task);
		const similarTasks = this.findSimilarTasksOptimized(task)
			.filter(t => t.is_finished);

		if (similarTasks.length > 0) {
			// Berechne durchschnittliche tatsächliche Bearbeitungszeit
			const processingTimes = similarTasks.map(t => this.calculateActualProcessingTime(t));
			const avgTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
			
			// Gewichte die Schätzung basierend auf der Anzahl ähnlicher Tasks
			const confidence = Math.min(similarTasks.length / 10, 0.8);
			return avgTime;
		}

		// Fallback auf 8-10 Tage wenn keine historischen Daten
		return 9 * 24 * 60 * 60 * 1000; // 9 Tage als Durchschnitt
	}

	private calculateComplexity(
		characteristics: ReturnType<typeof this.extractTaskCharacteristics>,
	): number {
		const metrics = this.workloadMetrics;

		let complexity = 0;

		// Personenanzahl mit dynamischem Faktor

		complexity +=
			Math.log10(characteristics.personCount + 1) *
			metrics.impactFactors.personCount;

		// Material-Komplexität basierend auf historischen Daten

		const materialFactor = metrics.impactFactors.material;

		switch (characteristics.material) {
			case "leinwand":
				complexity *= 1 + materialFactor * 0.3;

				break;

			case "platte":
				complexity *= 1 + materialFactor * 0.1;

				break;

			case "leinenstruktur":
				complexity *= 1 + materialFactor * 0.2;

				break;
		}

		// Arbeitsauslastung

		complexity *= 1 + metrics.impactFactors.workload;

		// Saisonaler Einfluss

		complexity *= 1 + metrics.impactFactors.seasonal;

		// Zusätzliche Faktoren

		if (characteristics.complexityFactors.hasSpecialRequirements)
			complexity *= 1.2;

		if (characteristics.complexityFactors.isRush) complexity *= 1.3;

		if (characteristics.complexityFactors.hasMultipleFormats)
			complexity *= 1.15;

		return complexity;
	}

	private updateRunningAverage(
		currentAvg: number,

		newValue: number,

		count: number,
	): number {
		return (currentAvg * (count - 1) + newValue) / count;
	}

	private detectNewPatterns(task: Task) {
		const words = task.additional_information

			.toLowerCase()

			.split(/[\s,.-]+/)

			.filter((word) => word.length > 1);

		const knownTerms = new Set([
			"pers",

			"person",

			"personen",

			"leinwand",

			"platte",

			"leinenstruktur",

			"eilig",

			"express",
		]);

		for (const word of words) {
			if (!knownTerms.has(word)) {
				this.updateEmergingPattern(word, task);
			}
		}
	}

	private updateEmergingPattern(term: string, task: Task) {
		const existing = this.emergingPatterns.get(term) || {
			term,

			occurrences: 0,

			firstSeen: new Date(),

			lastSeen: new Date(),

			correlations: {
				processingTime: [],

				associatedTerms: new Map(),

				status: new Map(),
			},

			impact: {
				timeMultiplier: 1,

				complexity: 0,

				confidence: 0,
			},
		};

		existing.occurrences++;

		existing.lastSeen = new Date();

		// Analysiere Kontext

		const context = task.additional_information.toLowerCase();

		const words = context.split(/[\s,.-]+/);

		// Erfasse zusammenhängende Begriffe

		words.forEach((word) => {
			if (word !== term) {
				const count = existing.correlations.associatedTerms.get(word) || 0;

				existing.correlations.associatedTerms.set(word, count + 1);
			}
		});

		// Erfasse Status-Verteilung

		const statusCount = existing.correlations.status.get(task.status) || 0;

		existing.correlations.status.set(task.status, statusCount + 1);

		// Berechne Impact wenn genug Daten vorhanden

		if (existing.occurrences >= 3) {
			const timeImpact = this.calculateTimeImpact(existing);

			const complexityImpact = this.calculateComplexityImpact(existing);

			existing.impact = {
				timeMultiplier: timeImpact,

				complexity: complexityImpact,

				confidence: Math.min(existing.occurrences / 10, 0.9),
			};
		}

		this.emergingPatterns.set(term, existing);
	}

	private calculateTimeImpact(pattern: EmergingPattern): number {
		// Analysiere typische Bearbeitungszeiten

		const avgTime =
			pattern.correlations.processingTime.length > 0
				? pattern.correlations.processingTime.reduce((a, b) => a + b, 0) /
					pattern.correlations.processingTime.length
				: 0;

		// Normalisiere auf einen Multiplikator

		return avgTime > 0 ? avgTime / (24 * 60 * 60 * 1000) : 1;
	}

	private calculateComplexityImpact(pattern: EmergingPattern): number {
		let complexity = 0;

		// Häufigkeit der Verwendung

		complexity += Math.log10(pattern.occurrences) * 0.2;

		// Status-Verteilung

		const statusVariety = pattern.correlations.status.size;

		complexity += statusVariety * 0.1;

		// Kontext-Komplexität

		const associatedTermsCount = pattern.correlations.associatedTerms.size;

		complexity += Math.log10(associatedTermsCount + 1) * 0.3;

		return complexity;
	}

	public analyzeTask(task: Task): TaskPriority {
		// Erkenne neue Muster

		this.detectNewPatterns(task);

		const characteristics = this.extractTaskCharacteristics(task);

		// Suche nach emergierenden Mustern im Task

		const words = task.additional_information.toLowerCase().split(/[\s,.-]+/);

		let emergingPatternsFound = words

			.map((word) => this.emergingPatterns.get(word))

			.filter((pattern) => pattern && pattern.occurrences >= 3);

		// Berechne zusätzliche Faktoren aus emergierenden Mustern

		const emergingImpact = emergingPatternsFound.reduce(
			(acc, pattern) => ({
				timeMultiplier:
					acc.timeMultiplier * (pattern?.impact.timeMultiplier || 1),

				complexity: acc.complexity + (pattern?.impact.complexity || 0),

				confidence: Math.min(
					acc.confidence + (pattern?.impact.confidence || 0),

					1,
				),
			}),

			{ timeMultiplier: 1, complexity: 0, confidence: 0 },
		);

		const pattern = this.patterns.get(this.getPatternKey(characteristics));

		// Berechne Konfidenz basierend auf der Qualität der erkannten Informationen

		let confidenceFactors = {
			hasPersonCount: characteristics.personCount > 0 ? 0.3 : 0,

			hasMaterial: characteristics.material !== "standard" ? 0.3 : 0,

			hasPattern: pattern ? 0.4 : 0,
		};

		const baseConfidence = Object.values(confidenceFactors).reduce(
			(a, b) => a + b,

			0,
		);

		// Wenn wir ähnliche Tasks haben, erhöhe die Konfidenz

		const confidence = pattern
			? Math.min(baseConfidence + pattern.occurrences / 20, 1)
			: Math.max(baseConfidence, 0.1);

		const month = new Date(task.dueAt).getMonth();

		const seasonalFactor = this.seasonalPatterns.get(month) || 1;

		const estimatedDuration = pattern
			? pattern.averageCompletionTime * seasonalFactor
			: characteristics.personCount * 24 * 60 * 60 * 1000;

		const daysUntilDue =
			(new Date(task.dueAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000);

		const complexity = this.calculateComplexity(characteristics);

		// Risikoberechnung

		let riskLevel: "low" | "medium" | "high" = "low";

		if (daysUntilDue < estimatedDuration / (24 * 60 * 60 * 1000)) {
			riskLevel = "high";
		} else if (
			daysUntilDue <
			(estimatedDuration / (24 * 60 * 60 * 1000)) * 1.5
		) {
			riskLevel = "medium";
		}

		// Prioritätsberechnung mit mehr Faktoren

		let priority = 0;

		priority += 10 / Math.max(daysUntilDue, 1); // Zeitfaktor

		priority += complexity * 2; // Komplexitätsfaktor

		priority += seasonalFactor * 3; // Saisonaler Faktor

		priority += riskLevel === "high" ? 5 : riskLevel === "medium" ? 3 : 1;

		let recommendation = this.generateRecommendation(
			pattern,

			characteristics,

			estimatedDuration,

			seasonalFactor,

			confidence,

			emergingPatternsFound,
		);

		// Berücksichtige Feedback-Historie in der Empfehlung

		const patternKey = this.getPatternKey(characteristics);

		const feedbackHistory = this.feedbackHistory.get(patternKey) || [];

		if (feedbackHistory.length > 0) {
			const recentFeedback = feedbackHistory.slice(-5); // Letzte 5 Feedbacks

			const avgAccuracy =
				recentFeedback.reduce((sum, fb) => sum + fb.accuracy, 0) /
				recentFeedback.length;

			recommendation += `\n\nBasierend auf ${feedbackHistory.length} abgeschlossenen Aufträgen. `;

			recommendation += `Durchschnittliche Vorhersagegenauigkeit: ${(avgAccuracy * 100).toFixed(0)}%. `;

			if (avgAccuracy < 0.7) {
				recommendation +=
					"Unsere Schätzungen für diese Art von Auftrag werden kontinuierlich verbessert. ";
			}
		}

		return {
			task,

			priority,

			estimatedDuration: estimatedDuration * emergingImpact.timeMultiplier,

			riskLevel,

			recommendation,

			confidence: Math.max(confidence, emergingImpact.confidence),
		};
	}

	private generateRecommendation(
		pattern: TaskPattern | undefined,

		characteristics: ReturnType<typeof this.extractTaskCharacteristics>,

		estimatedDuration: number,

		seasonalFactor: number,

		confidence: number,

		emergingPatterns: EmergingPattern[],
	): string {
		const days = Math.ceil(estimatedDuration / (24 * 60 * 60 * 1000));

		const seasonalLoad =
			seasonalFactor > 1.2
				? "hoher"
				: seasonalFactor < 0.8
					? "niedriger"
					: "normaler";

		let recommendation = "";

		// Baue die Empfehlung basierend auf der Konfidenz auf

		if (confidence < 0.3) {
			recommendation = `Wenig Erfahrungswerte verfügbar. Grobe Schätzung: ${days} Tage. `;
		} else if (confidence < 0.7) {
			recommendation = `Mittlere Konfidenz in der Schätzung. Etwa ${days} Tage basierend auf ähnlichen Aufträgen. `;
		} else {
			recommendation = `Hohe Konfidenz: ${days} Tage basierend auf direkter Erfahrung. `;
		}

		// Füge Warnungen für Komplexitätsfaktoren hinzu

		if (characteristics.complexityFactors.hasSpecialRequirements) {
			recommendation += "Enthält Sonderanforderungen. ";
		}

		if (characteristics.complexityFactors.isRush) {
			recommendation += "Als eilig gekennzeichnet. ";
		}

		if (characteristics.complexityFactors.hasMultipleFormats) {
			recommendation += "Mehrere Formate zu beachten. ";
		}

		recommendation += `Zeitraum mit ${seasonalLoad} Auslastung. `;

		// Füge Informationen über erkannte neue Muster hinzu

		if (emergingPatterns.length > 0) {
			recommendation += "\n\nErkannte Spezialmuster: ";

			emergingPatterns.forEach((pattern) => {
				recommendation +=
					`\n- "${pattern.term}" (${pattern.occurrences}x gesehen, ` +
					`durchschnittlich ${Math.round(pattern.impact.timeMultiplier * 100)}% Zeiteinfluss, ` +
					`${Math.round(pattern.impact.confidence * 100)}% Konfidenz)`;
			});
		}

		// Workload-Information

		if (
			this.workloadMetrics.currentWeekTasks >
			this.workloadMetrics.averageWeeklyTasks * 1.5
		) {
			recommendation +=
				`\nAchtung: Diese Woche ${this.workloadMetrics.currentWeekTasks} Aufträge ` +
				`(Durchschnitt: ${Math.round(this.workloadMetrics.averageWeeklyTasks)} pro Woche). `;
		}

		return recommendation;
	}

	private calculateWorkloadMetrics(tasks: Task[]): WorkloadMetrics {
		const openTasks = tasks.filter((t) => !t.is_finished);

		// Analysiere die Verteilung der Tasks über die Zeit

		const workloadByWeek = new Map<string, number>();

		const now = new Date();

		// Gruppiere Tasks nach Kalenderwoche

		for (const task of tasks) {
			const taskDate = new Date(task.dueAt);

			const weekKey = `${taskDate.getFullYear()}-${Math.ceil((taskDate.getTime() - new Date(taskDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))}`;

			workloadByWeek.set(weekKey, (workloadByWeek.get(weekKey) || 0) + 1);
		}

		// Berechne durchschnittliche und aktuelle Auslastung

		const avgWeeklyLoad =
			Array.from(workloadByWeek.values()).reduce(
				(sum, count) => sum + count,
				0,
			) / workloadByWeek.size;

		const currentWeekKey = `${now.getFullYear()}-${Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))}`;

		const currentLoad = workloadByWeek.get(currentWeekKey) || 0;

		// Status-Verteilung

		const statusDist = new Map<string, number>();

		for (const task of openTasks) {
			statusDist.set(task.status, (statusDist.get(task.status) || 0) + 1);
		}

		// Berechne Impact-Faktoren

		const workloadImpact =
			currentLoad > avgWeeklyLoad * 1.5
				? 0.3
				: // Hohe Auslastung

					currentLoad > avgWeeklyLoad
					? 0.15
					: // Mittlere Auslastung

						0; // Normale Auslastung

		return {
			openTasksCount: openTasks.length,

			averageWeeklyTasks: avgWeeklyLoad,

			currentWeekTasks: currentLoad,

			statusDistribution: statusDist,

			impactFactors: {
				personCount: this.calculatePersonCountImpact(tasks),

				material: this.calculateMaterialImpact(tasks),

				workload: workloadImpact,

				seasonal: this.calculateSeasonalImpact(tasks),
			},
		};
	}

	private calculatePersonCountImpact(tasks: Task[]): number {
		const impactByCount = new Map<number, number>();

		tasks.forEach((task) => {
			const characteristics = this.extractTaskCharacteristics(task);

			const actualDuration = task.actualDuration || 0;

			if (!impactByCount.has(characteristics.personCount)) {
				impactByCount.set(characteristics.personCount, []);
			}

			impactByCount.get(characteristics.personCount)?.push(actualDuration);
		});

		// Berechne durchschnittlichen Einfluss pro Person

		return (
			Array.from(impactByCount.entries()).reduce((acc, [count, durations]) => {
				const avgDuration =
					durations.reduce((sum, d) => sum + d, 0) / durations.length;

				return acc + avgDuration / count;
			}, 0) / impactByCount.size
		);
	}

	private calculateSeasonalImpact(tasks: Task[]): number {
		// Berechne saisonale Auslastung

		const monthlyLoad = new Map<number, number>();

		tasks.forEach((task) => {
			const month = new Date(task.dueAt).getMonth();

			monthlyLoad.set(month, (monthlyLoad.get(month) || 0) + 1);
		});

		// Berechne saisonale Auslastung

		const maxLoad = Math.max(...Array.from(monthlyLoad.values()));

		const seasonalLoad = monthlyLoad.get(new Date().getMonth()) || 0 / maxLoad;

		// Berechne saisonalen Einfluss

		return seasonalLoad > 0.8 ? 0.2 : seasonalLoad < 0.2 ? -0.2 : 0;
	}

	private calculateMaterialImpact(tasks: Task[]): number {
		// Berechne Material-Komplexität basierend auf historischen Daten

		const materialImpact = new Map<string, number>();

		tasks.forEach((task) => {
			const characteristics = this.extractTaskCharacteristics(task);

			const actualDuration = task.actualDuration || 0;

			if (!materialImpact.has(characteristics.material)) {
				materialImpact.set(characteristics.material, []);
			}

			materialImpact.get(characteristics.material)?.push(actualDuration);
		});

		// Berechne durchschnittlichen Einfluss pro Material

		return (
			Array.from(materialImpact.entries()).reduce(
				(acc, [material, durations]) => {
					const avgDuration =
						durations.reduce((sum, d) => sum + d, 0) / durations.length;

					return acc + avgDuration / durations.length;
				},
				0,
			) / materialImpact.size
		);
	}
}

// Optimierter derived Store mit Debouncing

let analysisTimeout: NodeJS.Timeout;

export const taskPriorities = derived(tasks, ($tasks, set) => {
	// Debounce die Analyse um Performance bei schnellen Änderungen zu verbessern

	clearTimeout(analysisTimeout);

	analysisTimeout = setTimeout(() => {
		const analyzer = new TaskAnalyzer($tasks);

		const unfinishedTasks = $tasks.filter((t) => !t.is_finished);

		const priorities = unfinishedTasks

			.map((task) => analyzer.analyzeTask(task))

			.sort((a, b) => b.priority - a.priority);

		set(priorities);
	}, 100);

	// Cleanup

	return () => {
		clearTimeout(analysisTimeout);
	};
});
