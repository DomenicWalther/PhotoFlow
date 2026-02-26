<script lang="ts">
	import { fly } from 'svelte/transition';

	type Order = {
		id: string;
		name: string;
		date: string;
		dateLabel: string;
		status: 'raw' | 'retuschiert' | 'abgeschlossen';
		statusLabel: string;
		info: string;
		col: 'todo' | 'wip' | 'done';
		overdue: boolean;
	};

	export let orders: Order[];
	export let onOpenDetail: (id: string) => void;
	export let onOpenStatusDropdown: (e: MouseEvent, id: string) => void;
	export let onDeleteOrder: (id: string) => void;

	function getDueDateChip(order: Order): string | null {
		if (!order.date) return null;
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const due = new Date(order.date);
		due.setHours(0, 0, 0, 0);
		const diff = Math.round((due.getTime() - now.getTime()) / 86400000);
		
		if (diff < 0) {
			const d = Math.abs(diff);
			return `${d} Tag${d !== 1 ? 'e' : ''} überfällig`;
		} else if (diff === 0) {
			return 'Heute fällig';
		} else if (diff <= 7) {
			return `In ${diff} Tag${diff !== 1 ? 'en' : ''}`;
		}
		return null;
	}

	function handleRowClick(e: MouseEvent, orderId: string) {
		const target = e.target as HTMLElement;
		if (target.closest('.pill-trigger') || target.closest('.row-acts')) {
			return;
		}
		onOpenDetail(orderId);
	}

	function handleDelete(e: Event, orderId: string) {
		e.stopPropagation();
		onDeleteOrder(orderId);
	}
</script>

<div class="table-wrap">
	<div class="table-head">
		<div class="th active-sort">
			Kunde
			<svg viewBox="0 0 10 6" fill="currentColor">
				<path d="M5 6L0 0h10L5 6z"/>
			</svg>
		</div>
		<div class="th">Abholdatum</div>
		<div class="th">Status</div>
		<div class="th">Zusatzinfo</div>
		<div class="th"></div>
	</div>
	<div class="table-body">
		{#each orders as order, i (order.id)}
			<div 
				class="trow"
				in:fly={{ x: -12, duration: 450, delay: i * 70 }}
				on:click={(e) => handleRowClick(e, order.id)}
			>
				<div class="client-cell">
					<div class="cinit {order.status === 'raw' ? 'cinit-blue' : 'cinit-gold'}">
						{order.name[0].toUpperCase()}
					</div>
					<span class="client-name">{order.name}</span>
				</div>
				<div class="date-cell">
					<div class="date-main" class:overdue={order.overdue}>
						{order.dateLabel}
					</div>
					{#if getDueDateChip(order)}
						{@const chipText = getDueDateChip(order)}
						<div class="date-chip {order.overdue ? 'chip-overdue' : 'chip-ok'}">
							<span class="chip-dot"></span>
							{chipText}
						</div>
					{/if}
				</div>
				<div>
				<button 
					class="pill {order.status} pill-trigger"
					on:click={(e) => onOpenStatusDropdown(e, order.id)}
				>
						<span class="pdot"></span>
						{order.statusLabel}
						<svg class="pcaret" viewBox="0 0 10 6" fill="currentColor">
							<path d="M5 6L0 0h10z"/>
						</svg>
					</button>
				</div>
				<div class="additional">{order.info}</div>
				<div class="row-acts">
					<button 
						class="act-btn"
						on:click={(e) => { e.stopPropagation(); onOpenDetail(order.id); }}
						title="Details"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<line x1="12" y1="8" x2="12" y2="12"/>
							<line x1="12" y1="16" x2="12.01" y2="16"/>
						</svg>
					</button>
					<button 
						class="act-btn"
						on:click={(e) => handleDelete(e, order.id)}
						title="Löschen"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="3 6 5 6 21 6"/>
							<path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
						</svg>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.table-wrap {
		background: var(--surface);
		backdrop-filter: var(--blur);
		border: 1px solid var(--border);
		border-radius: 22px;
		overflow: visible;
		position: relative;
	}

	.table-wrap::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(201,168,76,0.18), transparent);
		border-radius: 22px 22px 0 0;
		pointer-events: none;
		z-index: 1;
	}

	.table-head {
		display: grid;
		grid-template-columns: 2fr 1.5fr 1.2fr 2.8fr 90px;
		padding: 13px 28px;
		border-bottom: 1px solid var(--border);
		background: rgba(255,252,245,0.015);
		border-radius: 22px 22px 0 0;
	}

	.th {
		font-size: 9.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 5px;
		cursor: pointer;
		transition: color 0.2s;
		user-select: none;
	}

	.th:hover {
		color: var(--text-secondary);
	}

	.th.active-sort {
		color: var(--gold);
	}

	.th svg {
		width: 8px;
		height: 8px;
	}

	.table-body {
		overflow: hidden;
		border-radius: 0 0 22px 22px;
	}

	.trow {
		display: grid;
		grid-template-columns: 2fr 1.5fr 1.2fr 2.8fr 90px;
		padding: 18px 28px;
		border-bottom: 1px solid rgba(201,168,76,0.06);
		align-items: center;
		cursor: pointer;
		position: relative;
		transition: background 0.15s;
	}

	.trow:last-child {
		border-bottom: none;
	}

	.trow::before {
		content: '';
		position: absolute;
		left: 0;
		top: 6px;
		bottom: 6px;
		width: 0;
		background: linear-gradient(180deg, var(--gold-light), var(--gold));
		border-radius: 0 3px 3px 0;
		transition: width 0.22s cubic-bezier(0.4,0,0.2,1);
		box-shadow: 2px 0 12px rgba(201,168,76,0.2);
	}

	.trow:hover {
		background: rgba(201,168,76,0.035);
	}

	.trow:hover::before {
		width: 3px;
	}

	.trow {
		animation: rowIn 0.45s ease both;
	}

	@keyframes rowIn {
		from { opacity: 0; transform: translateX(-12px); }
		to { opacity: 1; transform: translateX(0); }
	}

	.client-cell {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.cinit {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Cormorant Garamond', serif;
		font-size: 16px;
		font-weight: 600;
		transition: transform 0.2s, box-shadow 0.2s;
		position: relative;
		overflow: hidden;
	}

	.cinit-gold {
		background: linear-gradient(135deg, rgba(232,213,163,0.25) 0%, rgba(139,105,20,0.3) 50%, rgba(201,168,76,0.2) 100%);
		border: 1px solid rgba(201,168,76,0.25);
		color: var(--gold-light);
		box-shadow: inset 0 1px 0 rgba(232,213,163,0.15);
	}

	.cinit-blue {
		background: linear-gradient(135deg, rgba(112,168,224,0.2) 0%, rgba(70,120,180,0.25) 100%);
		border: 1px solid rgba(112,168,224,0.22);
		color: var(--blue);
	}

	.trow:hover .cinit {
		transform: scale(1.08);
		box-shadow: 0 0 20px rgba(201,168,76,0.15);
	}

	.client-name {
		font-size: 14px;
		font-weight: 400;
		letter-spacing: 0.01em;
	}

	.date-cell {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.date-main {
		font-size: 13px;
		color: var(--text-secondary);
	}

	.date-main.overdue {
		color: var(--red);
	}

	.date-chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 8px;
		border-radius: 20px;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.03em;
		width: fit-content;
	}

	.chip-overdue {
		background: rgba(224,114,114,0.12);
		border: 1px solid rgba(224,114,114,0.3);
		color: var(--red);
		box-shadow: 0 0 8px rgba(224,114,114,0.15);
	}

	.chip-ok {
		background: rgba(110,201,148,0.08);
		border: 1px solid rgba(110,201,148,0.2);
		color: var(--green);
	}

	.chip-dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: currentColor;
	}

	.additional {
		font-size: 12px;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-right: 12px;
	}

	.row-acts {
		display: flex;
		align-items: center;
		gap: 4px;
		justify-content: flex-end;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.trow:hover .row-acts {
		opacity: 1;
	}

	.act-btn {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.15s;
		padding: 0;
	}

	.act-btn:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
		transform: scale(1.1);
		border-color: var(--border-bright);
	}

	.act-btn svg {
		width: 13px;
		height: 13px;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		border-radius: 20px;
		font-size: 11px;
		font-weight: 400;
		letter-spacing: 0.02em;
		border: 1px solid;
		cursor: pointer;
		transition: transform 0.15s, filter 0.15s, box-shadow 0.2s;
		font-family: 'Inter', sans-serif;
		background: transparent;
		user-select: none;
	}

	.pill:hover {
		transform: scale(1.05);
	}

	.pill:active {
		transform: scale(0.97);
	}

	.pill.retuschiert {
		color: var(--gold-light);
		border-color: rgba(201,168,76,0.3);
		background: rgba(201,168,76,0.08);
		box-shadow: 0 0 12px rgba(201,168,76,0.1), inset 0 0 12px rgba(201,168,76,0.05);
	}

	.pill.raw {
		color: var(--blue);
		border-color: rgba(112,168,224,0.3);
		background: rgba(112,168,224,0.08);
		box-shadow: 0 0 12px rgba(112,168,224,0.15), inset 0 0 12px rgba(112,168,224,0.05);
	}

	.pill.abgeschlossen {
		color: var(--green);
		border-color: rgba(110,201,148,0.3);
		background: rgba(110,201,148,0.08);
		box-shadow: 0 0 10px rgba(110,201,148,0.1);
	}

	.pdot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.pill.retuschiert .pdot {
		background: var(--gold);
		box-shadow: 0 0 6px var(--gold);
	}

	.pill.raw .pdot {
		background: var(--blue);
		box-shadow: 0 0 6px var(--blue);
	}

	.pill.abgeschlossen .pdot {
		background: var(--green);
		box-shadow: 0 0 6px var(--green);
	}

	.pcaret {
		width: 7px;
		height: 7px;
		opacity: 0.45;
		transition: transform 0.2s;
		flex-shrink: 0;
	}

	.pill.popen .pcaret {
		transform: rotate(180deg);
	}
</style>
