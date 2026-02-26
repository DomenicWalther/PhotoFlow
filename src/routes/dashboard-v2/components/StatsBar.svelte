<script lang="ts">
	export let stats: {
		total: number;
		overdue: number;
		wip: number;
		done: number;
	};

	function calculateArc(total: number, current: number): number {
		if (total === 0) return 97.4;
		const percentage = Math.min(100, (current / Math.max(total, 1)) * 100);
		const circumference = 97.4;
		return circumference - (percentage / 100) * circumference;
	}
</script>

<div class="stats-bar">
	<div class="stat-card" style="animation-delay: 0.05s;">
		<div class="stat-top">
			<div>
				<div class="stat-label">Aufträge gesamt</div>
				<div class="stat-value stat-gold">{stats.total}</div>
			</div>
			<div class="stat-arc-wrap">
				<svg class="arc-svg" viewBox="0 0 36 36">
					<circle class="arc-track" cx="18" cy="18" r="15.5"/>
					<circle class="arc-fill arc-gold" cx="18" cy="18" r="15.5" style="stroke-dasharray: 97.4; stroke-dashoffset: {calculateArc(10, stats.total)}"/>
				</svg>
			</div>
		</div>
		<div class="stat-change">
			<span class="stat-change-up">↑ +2</span> gegenüber Vormonat
		</div>
	</div>

	<div class="stat-card" style="animation-delay: 0.12s;">
		<div class="stat-top">
			<div>
				<div class="stat-label">Überfällig</div>
				<div class="stat-value stat-red">{stats.overdue}</div>
			</div>
			<div class="stat-arc-wrap">
				<svg class="arc-svg" viewBox="0 0 36 36">
					<circle class="arc-track" cx="18" cy="18" r="15.5"/>
					<circle class="arc-fill arc-red" cx="18" cy="18" r="15.5" style="stroke-dasharray: 97.4; stroke-dashoffset: {calculateArc(stats.total, stats.overdue)}"/>
				</svg>
			</div>
		</div>
		<div class="stat-change">
			<span class="stat-change-down">↑ +1</span> seit gestern
		</div>
	</div>

	<div class="stat-card" style="animation-delay: 0.19s;">
		<div class="stat-top">
			<div>
				<div class="stat-label">In Bearbeitung</div>
				<div class="stat-value stat-blue">{stats.wip}</div>
			</div>
			<div class="stat-arc-wrap">
				<svg class="arc-svg" viewBox="0 0 36 36">
					<circle class="arc-track" cx="18" cy="18" r="15.5"/>
					<circle class="arc-fill arc-blue" cx="18" cy="18" r="15.5" style="stroke-dasharray: 97.4; stroke-dashoffset: {calculateArc(stats.total, stats.wip)}"/>
				</svg>
			</div>
		</div>
		<div class="stat-change">
			<span style="color: var(--text-muted)">→ 0</span> Änderung
		</div>
	</div>

	<div class="stat-card" style="animation-delay: 0.26s;">
		<div class="stat-top">
			<div>
				<div class="stat-label">Abgeschlossen</div>
				<div class="stat-value stat-green">{stats.done}</div>
			</div>
			<div class="stat-arc-wrap">
				<svg class="arc-svg" viewBox="0 0 36 36">
					<circle class="arc-track" cx="18" cy="18" r="15.5"/>
					<circle class="arc-fill arc-green" cx="18" cy="18" r="15.5" style="stroke-dasharray: 97.4; stroke-dashoffset: {calculateArc(stats.total, stats.done)}"/>
				</svg>
			</div>
		</div>
		<div class="stat-change">
			<span class="stat-change-up">↑ +3</span> diesen Monat
		</div>
	</div>
</div>

<style>
	.stats-bar {
		padding: 22px 52px 0;
		display: flex;
		gap: 14px;
	}

	.stat-card {
		flex: 1;
		background: var(--surface);
		backdrop-filter: var(--blur);
		border: 1px solid var(--border);
		border-radius: 18px;
		padding: 20px 22px 16px;
		cursor: default;
		position: relative;
		overflow: hidden;
		transition: all 0.28s;
		animation: statIn 0.5s ease both;
	}

	.stat-card:nth-child(1) { animation-delay: 0.05s; }
	.stat-card:nth-child(2) { animation-delay: 0.12s; }
	.stat-card:nth-child(3) { animation-delay: 0.19s; }
	.stat-card:nth-child(4) { animation-delay: 0.26s; }

	@keyframes statIn {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.stat-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(201,168,76,0.14), transparent);
	}

	.stat-card:hover {
		background: var(--surface-hover);
		border-color: rgba(201,168,76,0.22);
		transform: translateY(-4px);
		box-shadow: 0 20px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(201,168,76,0.12);
	}

	.stat-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.stat-label {
		font-size: 9.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 400;
		margin-bottom: 6px;
	}

	.stat-value {
		font-family: 'Cormorant Garamond', serif;
		font-size: 38px;
		font-weight: 300;
		line-height: 1;
		transition: transform 0.2s;
	}

	.stat-card:hover .stat-value {
		transform: scale(1.04);
	}

	.stat-gold { color: var(--gold); }
	.stat-red { color: var(--red); }
	.stat-blue { color: var(--blue); }
	.stat-green { color: var(--green); }

	.stat-change {
		font-size: 10px;
		color: var(--text-muted);
		margin-top: 6px;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.stat-change-up { color: var(--green); font-size: 10px; }
	.stat-change-down { color: var(--red); font-size: 10px; }

	.stat-arc-wrap {
		width: 32px;
		height: 32px;
		position: relative;
	}

	.arc-svg {
		width: 32px;
		height: 32px;
		transform: rotate(-90deg);
	}

	.arc-track {
		fill: none;
		stroke: rgba(255,255,255,0.06);
		stroke-width: 2.5;
	}

	.arc-fill {
		fill: none;
		stroke-width: 2.5;
		stroke-linecap: round;
		transition: stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1);
	}

	.arc-gold { stroke: var(--gold); }
	.arc-red { stroke: var(--red); }
	.arc-blue { stroke: var(--blue); }
	.arc-green { stroke: var(--green); }
</style>
