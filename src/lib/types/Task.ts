export type Task = {
	id: number;
	name: string;
	dueAt: Date;
	status: string;
	additional_information: string;
	is_finished: boolean;
	taskColumn: number;
	orderPath?: string;
	completedAt?: Date;
	startedAt?: Date;
	actualDuration?: number;
	created_at: Date;
	completed_at?: Date;
};

export interface FilterPreset {
	id: string;
	name: string;
	filter: {
		searchTerm?: string;
		dateRange?: {
			start: Date;
			end: Date;
		};
	};
}

export interface TaskFeedback {
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
