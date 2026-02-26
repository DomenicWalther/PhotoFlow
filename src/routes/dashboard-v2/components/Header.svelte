<script lang="ts">
	export let searchQuery: string;
	export let onSearch: (val: string) => void;
	export let onNewOrder: () => void;

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		onSearch(target.value);
	}
</script>

<div class="header">
	<div>
		<div class="header-eyebrow">Fotostudio — Auftragsverwaltung</div>
		<h1 class="header-title">Aufträge <em>& Kunden</em></h1>
	</div>
	<div class="header-right">
		<div class="filter-wrap">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="11" cy="11" r="8"/>
				<line x1="21" y1="21" x2="16.65" y2="16.65"/>
			</svg>
			<input 
				class="filter-input" 
				type="text" 
				placeholder="Suchen…" 
				value={searchQuery}
				on:input={handleInput}
			>
		</div>
		<button class="btn-new" on:click={onNewOrder}>
			<span class="bicon">
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="6" y1="1" x2="6" y2="11"/>
					<line x1="1" y1="6" x2="11" y2="6"/>
				</svg>
			</span>
			Neuer Auftrag
		</button>
	</div>
</div>

<style>
	.header {
		padding: 26px 52px 0;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;
	}

	.header-eyebrow {
		font-size: 9.5px;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 8px;
		font-weight: 400;
	}

	.header-title {
		font-family: 'Cormorant Garamond', serif;
		font-size: 46px;
		font-weight: 300;
		letter-spacing: -0.018em;
		line-height: 1;
		color: var(--text-primary);
	}

	.header-title em {
		font-style: italic;
		color: var(--gold);
		font-size: 52px;
		text-shadow: 0 0 40px rgba(201,168,76,0.3), 0 2px 20px rgba(201,168,76,0.15);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
	}

	.filter-wrap {
		position: relative;
	}

	.filter-wrap svg {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		width: 13px;
		height: 13px;
		color: var(--text-muted);
		pointer-events: none;
		transition: color 0.2s;
	}

	.filter-wrap:focus-within svg {
		color: var(--gold);
	}

	.filter-input {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 9px 14px 9px 34px;
		color: var(--text-primary);
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 300;
		width: 220px;
		outline: none;
		transition: all 0.25s;
		position: relative;
	}

	.filter-input::placeholder {
		color: var(--text-muted);
	}

	.filter-input:focus {
		border-color: transparent;
		background: rgba(255,252,245,0.055);
		box-shadow: 0 0 0 2px rgba(201,168,76,0.18), inset 0 -1px 0 var(--gold);
	}

	.filter-wrap::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--gold), var(--gold-light));
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
		border-radius: 0 0 10px 10px;
		pointer-events: none;
	}

	.filter-wrap:focus-within::after {
		transform: scaleX(1);
	}

	.btn-new {
		display: flex;
		align-items: center;
		gap: 7px;
		background: linear-gradient(135deg, var(--gold) 0%, #d4b47a 50%, var(--gold) 100%);
		background-size: 200% 100%;
		color: #0a0906;
		border: none;
		border-radius: 10px;
		padding: 9px 18px;
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.25s;
		white-space: nowrap;
		overflow: hidden;
		position: relative;
	}

	.btn-new:hover {
		background-position: 100% 0;
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(201,168,76,0.45), 0 2px 8px rgba(201,168,76,0.2);
	}

	.btn-new:active {
		transform: translateY(0);
		box-shadow: none;
	}

	.bicon {
		transition: transform 0.22s;
		display: flex;
	}

	.btn-new:hover .bicon {
		transform: rotate(90deg);
	}
</style>
