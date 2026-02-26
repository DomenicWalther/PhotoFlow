<script lang="ts">
	export let currentView: 'list' | 'kanban';
	export let showClosed: boolean;
	export let onSwitchView: (view: 'list' | 'kanban') => void;
	export let onToggleClosed: () => void;

	let indicatorRef: HTMLElement;
	let listBtnRef: HTMLElement;
	let kanbanBtnRef: HTMLElement;

	$: if (indicatorRef && listBtnRef && kanbanBtnRef) {
		updateIndicator(currentView);
	}

	function updateIndicator(view: string) {
		const activeBtn = view === 'list' ? listBtnRef : kanbanBtnRef;
		if (activeBtn && indicatorRef) {
			indicatorRef.style.width = `${activeBtn.offsetWidth}px`;
			indicatorRef.style.transform = `translateX(${activeBtn.offsetLeft - 4}px)`;
		}
	}
</script>

<div class="view-controls">
	<div class="view-toggle">
		<div class="view-indicator" bind:this={indicatorRef}></div>
		<button 
			class="view-btn"
			class:active={currentView === 'list'}
			bind:this={listBtnRef}
			on:click={() => onSwitchView('list')}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="3" y1="6" x2="21" y2="6"/>
				<line x1="3" y1="12" x2="21" y2="12"/>
				<line x1="3" y1="18" x2="21" y2="18"/>
			</svg>
			Liste
		</button>
		<button 
			class="view-btn"
			class:active={currentView === 'kanban'}
			bind:this={kanbanBtnRef}
			on:click={() => onSwitchView('kanban')}
		>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="3" y="3" width="7" height="18" rx="1.5"/>
				<rect x="14" y="3" width="7" height="11" rx="1.5"/>
			</svg>
			Kanban
		</button>
	</div>
	<div class="show-closed" on:click={onToggleClosed}>
		<span>Abgeschlossene</span>
		<div class="tog" class:on={showClosed}>
			<div class="tog-knob"></div>
		</div>
	</div>
</div>

<style>
	.view-controls {
		padding: 18px 52px 20px;
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.view-toggle {
		display: flex;
		background: rgba(255,255,255,0.03);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 4px;
		gap: 0;
		position: relative;
	}

	.view-indicator {
		position: absolute;
		top: 4px;
		left: 4px;
		height: calc(100% - 8px);
		border-radius: 8px;
		background: rgba(201,168,76,0.12);
		border: 1px solid rgba(201,168,76,0.25);
		transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s;
		pointer-events: none;
	}

	.view-btn {
		padding: 7px 18px;
		border-radius: 8px;
		font-size: 12px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: color 0.2s;
		display: flex;
		align-items: center;
		gap: 6px;
		border: none;
		background: none;
		font-family: 'Inter', sans-serif;
		font-weight: 300;
		position: relative;
		z-index: 1;
	}

	.view-btn.active {
		color: var(--gold);
	}

	.view-btn svg {
		width: 13px;
		height: 13px;
	}

	.show-closed {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-size: 12px;
		color: var(--text-muted);
		transition: color 0.2s;
		margin-left: auto;
		user-select: none;
	}

	.show-closed:hover {
		color: var(--text-secondary);
	}

	.tog {
		width: 34px;
		height: 19px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 10px;
		position: relative;
		transition: all 0.2s;
	}

	.tog.on {
		background: rgba(201,168,76,0.15);
		border-color: rgba(201,168,76,0.3);
	}

	.tog-knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: var(--text-muted);
		transition: all 0.22s;
	}

	.tog.on .tog-knob {
		transform: translateX(15px);
		background: var(--gold);
		box-shadow: 0 0 8px rgba(201,168,76,0.5);
	}
</style>
