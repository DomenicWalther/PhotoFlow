<script lang="ts">
	type StatusType = 'raw' | 'retuschiert' | 'abgeschlossen';

	export let open: boolean;
	export let trigger: HTMLElement | null;
	export let onSelect: (status: StatusType, label: string) => void;
	export let onClose: () => void;

	let dropdownRef: HTMLElement;

	const options: { value: StatusType; label: string; color: string }[] = [
		{ value: 'retuschiert', label: 'Retuschiert', color: '#C9A84C' },
		{ value: 'raw', label: 'RAW', color: '#70A8E0' },
		{ value: 'abgeschlossen', label: 'Abgeschlossen', color: '#6EC994' }
	];

	function handleSelect(status: StatusType, label: string) {
		onSelect(status, label);
	}

	function handleClickOutside(e: MouseEvent) {
		// Only close if clicking outside both the dropdown and the trigger
		if (dropdownRef && !dropdownRef.contains(e.target as Node) && 
		    trigger && !trigger.contains(e.target as Node)) {
			onClose();
		}
	}

	function stopPropagation(e: Event) {
		e.stopPropagation();
	}
</script>

<svelte:window on:click={handleClickOutside} />

{#if open}
	<div 
		class="status-dropdown"
		bind:this={dropdownRef}
		style={trigger ? `position: fixed; top: ${trigger.getBoundingClientRect().bottom + 6}px; left: ${trigger.getBoundingClientRect().left}px;` : ''}
		on:click={stopPropagation}
	>
		{#each options as option (option.value)}
			<button 
				class="ddopt"
				on:click|stopPropagation={() => handleSelect(option.value, option.label)}
			>
				<div 
					class="ddopt-dot"
					style="background: {option.color}; box-shadow: 0 0 6px {option.color}"
				></div>
				{option.label}
			</button>
		{/each}
	</div>
{/if}

<style>
	.status-dropdown {
		position: fixed;
		z-index: 8000;
		background: rgba(12,10,7,0.98);
		backdrop-filter: blur(32px) saturate(180%);
		border: 1px solid var(--border-bright);
		border-radius: 14px;
		overflow: hidden;
		min-width: 162px;
		box-shadow: 0 28px 72px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(201,168,76,0.08);
		animation: dropIn 0.15s ease both;
	}

	@keyframes dropIn {
		from { opacity: 0; transform: translateY(-6px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.ddopt {
		padding: 11px 15px;
		font-size: 12px;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 9px;
		transition: background 0.12s;
		color: var(--text-secondary);
		font-family: 'Inter', sans-serif;
		background: transparent;
		border: none;
		width: 100%;
		text-align: left;
	}

	.ddopt:hover {
		background: rgba(201,168,76,0.07);
		color: var(--text-primary);
	}

	.ddopt-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}
</style>
