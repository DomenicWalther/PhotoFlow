<script lang="ts">
	export let analyticsOpen: boolean;
	export let orders: Array<{
		name: string;
		date: string;
		dateLabel: string;
		overdue: boolean;
	}>;

	$: nextDeadline = orders
		.filter(o => !o.overdue && o.date)
		.sort((a, b) => a.date.localeCompare(b.date))[0];
</script>

<div class="analytics-panel" class:open={analyticsOpen}>
	<div class="analytics-inner">
		<div class="an-card">
			<div class="an-label">Umsatz diesen Monat</div>
			<div class="an-value">€ 4.280</div>
			<div class="an-sub">+12% gegenüber letztem Monat</div>
		</div>
		<div class="an-card">
			<div class="an-label">Nächste Deadline</div>
			<div class="an-value">{nextDeadline ? nextDeadline.name : '—'}</div>
			<div class="an-sub">{nextDeadline ? nextDeadline.dateLabel : 'Keine offenen Aufträge'}</div>
		</div>
		<div class="an-card">
			<div class="an-label">Abschlussrate</div>
			<div class="an-value">68%</div>
			<div class="an-sub">Diesen Monat</div>
		</div>
	</div>
</div>

<style>
	.analytics-panel {
		overflow: hidden;
		max-height: 0;
		transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
		opacity: 0;
		margin: 0 52px;
	}

	.analytics-panel.open {
		max-height: 200px;
		opacity: 1;
	}

	.analytics-inner {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 12px;
		padding: 18px 0 6px;
	}

	.an-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 16px 20px;
		position: relative;
		overflow: hidden;
	}

	.an-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(201,168,76,0.18), transparent);
	}

	.an-label {
		font-size: 9px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 8px;
	}

	.an-value {
		font-family: 'Cormorant Garamond', serif;
		font-size: 28px;
		font-weight: 300;
		color: var(--gold-light);
		line-height: 1;
	}

	.an-sub {
		font-size: 10px;
		color: var(--text-muted);
		margin-top: 4px;
	}
</style>
