<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

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

	type ColumnType = 'todo' | 'wip' | 'done';

	export let orders: Order[];
	export let onOpenDetail: (id: string) => void;
	export let onNewOrder: () => void;
	export let onUpdateColumn: (orderId: string, newCol: ColumnType) => void;

	let dragId: string | null = null;
	let dragOverCol: ColumnType | null = null;

	// Updated column labels to match Status names
	const columns: { key: ColumnType; label: string; dotClass: string }[] = [
		{ key: 'todo', label: 'RAW', dotClass: 'cdot-gold' },
		{ key: 'wip', label: 'Progress', dotClass: 'cdot-blue' },
		{ key: 'done', label: 'Done', dotClass: 'cdot-green' }
	];

	function handleDragStart(e: DragEvent, orderId: string) {
		dragId = orderId;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragEnd() {
		dragId = null;
		dragOverCol = null;
	}

	function handleDragOver(e: DragEvent, col: ColumnType) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		dragOverCol = col;
	}

	function handleDragLeave() {
		dragOverCol = null;
	}

	function handleDrop(e: DragEvent, col: ColumnType) {
		e.preventDefault();
		if (dragId && col) {
			onUpdateColumn(dragId, col);
		}
		dragOverCol = null;
		dragId = null;
	}

	function getOrdersByColumn(col: ColumnType): Order[] {
		return orders.filter(o => o.col === col);
	}
</script>

<div class="kanban-board">
	{#each columns as column, i (column.key)}
		<div 
			class="kcol {column.key}-col"
			class:drag-over={dragOverCol === column.key}
			in:fly={{ y: 16, duration: 450, delay: i * 70 }}
			on:dragover={(e) => handleDragOver(e, column.key)}
			on:dragleave={handleDragLeave}
			on:drop={(e) => handleDrop(e, column.key)}
		>
			<div class="col-head">
				<div class="col-label">
					<div class="cdot {column.dotClass}"></div>
					{column.label}
				</div>
				<div class="ccnt">{getOrdersByColumn(column.key).length}</div>
			</div>
			
			{#each getOrdersByColumn(column.key) as order (order.id)}
				<div 
					class="kcard"
					class:is-dragging={dragId === order.id}
					draggable={true}
					in:scale={{ duration: 300, easing: quintOut, start: 0.95 }}
					on:dragstart={(e) => handleDragStart(e, order.id)}
					on:dragend={handleDragEnd}
					on:click={() => onOpenDetail(order.id)}
					on:keypress={(e) => e.key === 'Enter' && onOpenDetail(order.id)}
					role="button"
					tabindex="0"
				>
					<div class="kcard-name">{order.name}</div>
					<div class="kcard-info">{order.info}</div>
					<div class="kcard-foot">
						<div class="kcard-date" class:overdue={order.overdue}>{order.dateLabel}</div>
						<div class="pill {order.status}">
							<span class="pdot"></span>
							{order.statusLabel}
						</div>
					</div>
				</div>
			{/each}
			
			<button class="add-btn" on:click={onNewOrder}>
				<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
					<line x1="6" y1="1" x2="6" y2="11"/>
					<line x1="1" y1="6" x2="11" y2="6"/>
				</svg>
				Neue Aufgabe
			</button>
		</div>
	{/each}
</div>

<style>
	.kanban-board {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 28px;
	}

	.kcol {
		background: var(--surface);
		backdrop-filter: var(--blur);
		border: 1px solid var(--border);
		border-radius: 22px;
		padding: 22px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		position: relative;
		overflow: hidden;
		min-height: 240px;
		transition: border-color 0.22s, background 0.22s, box-shadow 0.22s;
		animation: colIn 0.45s ease both;
	}

	@keyframes colIn {
		from { opacity: 0; transform: translateY(16px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.kcol:nth-child(1) { animation-delay: 0.05s; }
	.kcol:nth-child(2) { animation-delay: 0.12s; }
	.kcol:nth-child(3) { animation-delay: 0.19s; }

	.kcol::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent);
		pointer-events: none;
	}

	.kcol.drag-over {
		border-color: rgba(201,168,76,0.5);
		box-shadow: 0 0 40px rgba(201,168,76,0.08), inset 0 0 30px rgba(201,168,76,0.03);
		background: rgba(201,168,76,0.04);
	}

	.col-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--border);
		margin-bottom: 2px;
	}

	.col-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 9.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 500;
	}

	.cdot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.cdot-gold {
		background: var(--gold);
		box-shadow: 0 0 10px rgba(201,168,76,0.7);
	}

	.cdot-blue {
		background: var(--blue);
		box-shadow: 0 0 10px rgba(112,168,224,0.7);
	}

	.cdot-green {
		background: var(--green);
		box-shadow: 0 0 10px rgba(110,201,148,0.7);
	}

	.ccnt {
		width: 21px;
		height: 21px;
		border-radius: 7px;
		background: rgba(255,255,255,0.04);
		border: 1px solid var(--border);
		font-size: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
	}

	.kcard {
		background: rgba(255,252,245,0.026);
		border: 1px solid rgba(201,168,76,0.1);
		border-radius: 16px;
		padding: 16px;
		cursor: grab;
		position: relative;
		overflow: hidden;
		transition: all 0.2s;
		animation: cardIn 0.3s ease both;
	}

	@keyframes cardIn {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}

	.kcard::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(255,252,245,0.07), transparent);
	}

	.kcard:hover {
		background: rgba(255,252,245,0.05);
		border-color: rgba(201,168,76,0.2);
		transform: translateY(-5px) scale(1.01);
		box-shadow: 0 16px 50px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.06);
	}

	.kcard:active {
		cursor: grabbing;
	}

	.kcard.is-dragging {
		opacity: 0.2;
		transform: scale(0.93);
	}

	.kcard-name {
		font-size: 14px;
		font-weight: 400;
		margin-bottom: 4px;
	}

	.kcard-info {
		font-size: 12px;
		color: var(--text-muted);
		line-height: 1.5;
		margin-bottom: 12px;
	}

	.kcard-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		flex-wrap: wrap;
	}

	.kcard-date {
		font-size: 11px;
		color: var(--text-muted);
	}

	.kcard-date.overdue {
		color: rgba(224,114,114,0.8);
	}

	.add-btn {
		border: 1px dashed rgba(201,168,76,0.12);
		border-radius: 16px;
		padding: 13px;
		text-align: center;
		font-size: 12px;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		margin-top: auto;
		background: transparent;
		font-family: 'Inter', sans-serif;
		font-weight: 300;
	}

	.add-btn:hover {
		border-color: rgba(201,168,76,0.3);
		color: var(--gold);
		background: rgba(201,168,76,0.04);
	}

	.add-btn svg {
		width: 11px;
		height: 11px;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		border-radius: 20px;
		font-size: 10px;
		font-weight: 400;
		letter-spacing: 0.02em;
		border: 1px solid;
		font-family: 'Inter', sans-serif;
		background: transparent;
	}

	.pill.retuschiert {
		color: var(--gold-light);
		border-color: rgba(201,168,76,0.3);
		background: rgba(201,168,76,0.08);
		box-shadow: 0 0 8px rgba(201,168,76,0.1), inset 0 0 8px rgba(201,168,76,0.05);
	}

	.pill.raw {
		color: var(--blue);
		border-color: rgba(112,168,224,0.3);
		background: rgba(112,168,224,0.08);
		box-shadow: 0 0 8px rgba(112,168,224,0.15), inset 0 0 8px rgba(112,168,224,0.05);
	}

	.pill.abgeschlossen {
		color: var(--green);
		border-color: rgba(110,201,148,0.3);
		background: rgba(110,201,148,0.08);
		box-shadow: 0 0 8px rgba(110,201,148,0.1);
	}

	.pdot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.pill.retuschiert .pdot {
		background: var(--gold);
		box-shadow: 0 0 4px var(--gold);
	}

	.pill.raw .pdot {
		background: var(--blue);
		box-shadow: 0 0 4px var(--blue);
	}

	.pill.abgeschlossen .pdot {
		background: var(--green);
		box-shadow: 0 0 4px var(--green);
	}
</style>
