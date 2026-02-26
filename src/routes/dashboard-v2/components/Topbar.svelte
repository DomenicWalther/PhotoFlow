<script lang="ts">
	export let analyticsOpen: boolean;
	export let onToggleAnalytics: () => void;
</script>

<div class="topbar">
	<div class="brand">
		<span class="brand-dot"></span>
		Studio
	</div>
	<div class="topbar-right">
		<button 
			class="analytics-toggle"
			class:open={analyticsOpen}
			on:click={onToggleAnalytics}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
			</svg>
			Analyse
			<svg class="toggle-arrow" class:rotate-180={analyticsOpen} viewBox="0 0 10 6" fill="currentColor">
				<path d="M5 6L0 0h10z"/>
			</svg>
		</button>
		<div class="avatar">H</div>
	</div>
</div>

<style>
	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 22px 52px 0;
	}

	.brand {
		font-family: 'Cormorant Garamond', serif;
		font-size: 12px;
		font-weight: 400;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--gold);
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: default;
		user-select: none;
	}

	.brand-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--gold);
		box-shadow: 0 0 10px var(--gold-glow);
		animation: pulse 2.8s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { box-shadow: 0 0 6px var(--gold-glow); }
		50% { box-shadow: 0 0 18px var(--gold-glow), 0 0 36px rgba(201,168,76,0.08); }
	}

	.topbar-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.analytics-toggle {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		color: var(--text-muted);
		cursor: pointer;
		padding: 6px 12px;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: transparent;
		transition: all 0.2s;
		user-select: none;
		font-family: 'Inter', sans-serif;
		font-weight: 300;
	}

	.analytics-toggle:hover {
		border-color: var(--border-bright);
		color: var(--gold);
	}

	.analytics-toggle svg:first-child {
		width: 12px;
		height: 12px;
	}

	.toggle-arrow {
		width: 8px;
		height: 8px;
		opacity: 0.5;
		transition: transform 0.3s;
	}

	.analytics-toggle.open .toggle-arrow {
		transform: rotate(180deg);
	}

	.avatar {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--gold) 0%, #7a5222 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Cormorant Garamond', serif;
		font-size: 14px;
		font-weight: 600;
		color: #0a0906;
		cursor: pointer;
		border: 1px solid rgba(201,168,76,0.3);
		transition: transform 0.2s, box-shadow 0.25s;
	}

	.avatar:hover {
		transform: scale(1.1);
		box-shadow: 0 0 22px var(--gold-glow);
	}
</style>
