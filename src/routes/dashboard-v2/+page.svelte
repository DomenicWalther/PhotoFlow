<script lang="ts">
	import { onMount } from 'svelte';
	import { tasks, tasksSearchTerm, tasksFiltered, showFinishedTasks } from '$lib/Stores/TaskStore';
	import { getAndCreateTasks } from '$lib/utils/tasks';
	import { io } from '$lib/realtime';
	import toast, { Toaster } from 'svelte-french-toast';
	
	import Topbar from './components/Topbar.svelte';
	import Header from './components/Header.svelte';
	import AnalyticsPanel from './components/AnalyticsPanel.svelte';
	import StatsBar from './components/StatsBar.svelte';
	import ViewControls from './components/ViewControls.svelte';
	import TableView from './components/TableView.svelte';
	import KanbanView from './components/KanbanView.svelte';
	import OrderPanel from './components/OrderPanel.svelte';
	import StatusDropdown from './components/StatusDropdown.svelte';

	type ViewMode = 'list' | 'kanban';
	type ColumnType = 'todo' | 'wip' | 'done';
	type StatusType = 'raw' | 'retuschiert' | 'abgeschlossen';

	let currentView: ViewMode = 'list';
	let analyticsOpen = false;
	let showClosed = false;
	let searchQuery = '';
	let panelOpen = false;
	let panelMode: 'detail' | 'new' = 'detail';
	let selectedOrderId: string | null = null;
	let statusDropdownOpen = false;
	let statusDropdownTrigger: HTMLElement | null = null;
	let statusDropdownOrderId: string | null = null;
	let cursorGlowRef: HTMLElement | undefined = undefined;
	let mouseX = 0;
	let mouseY = 0;

	function updateCursorGlow() {
		if (cursorGlowRef) {
			cursorGlowRef.style.left = mouseX + 'px';
			cursorGlowRef.style.top = mouseY + 'px';
		}
		requestAnimationFrame(updateCursorGlow);
	}

	// Reactive statements
	$: tasksSearchTerm.set(searchQuery);
	$: filteredOrders = $tasksFiltered.map(task => ({
		id: task.id.toString(),
		name: task.name,
		date: task.dueAt.toISOString().split('T')[0],
		dateLabel: task.dueAt.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
		status: mapStatusToType(task.status),
		statusLabel: mapStatusToLabel(task.status),
		info: task.additional_information || '—',
		col: mapColumnToType(task.taskColumn),
		overdue: !task.is_finished && task.dueAt < new Date()
	}));

	$: stats = {
		total: filteredOrders.length,
		overdue: filteredOrders.filter(o => o.overdue).length,
		wip: filteredOrders.filter(o => o.col === 'wip').length,
		done: filteredOrders.filter(o => o.col === 'done').length
	};

	function mapStatusToType(status: string): StatusType {
		switch (status) {
			case 'NichtBearbeitet': return 'raw';
			case 'Entwickelt': return 'raw';
			case 'Retuschiert': return 'retuschiert';
			case 'Gedruckt': return 'abgeschlossen';
			default: return 'raw';
		}
	}

	function mapStatusToLabel(status: string): string {
		switch (status) {
			case 'NichtBearbeitet': return 'RAW';
			case 'Entwickelt': return 'RAW';
			case 'Retuschiert': return 'Retuschiert';
			case 'Gedruckt': return 'Abgeschlossen';
			default: return 'RAW';
		}
	}

	function mapColumnToType(column: number | string): ColumnType {
		const col = typeof column === 'string' ? parseInt(column) : column;
		switch (col) {
			case 0: return 'todo';
			case 1: return 'wip';
			case 2: return 'done';
			default: return 'todo';
		}
	}

	function mapColumnToString(col: ColumnType): string {
		switch (col) {
			case 'todo': return '0';
			case 'wip': return '1';
			case 'done': return '2';
			default: return '0';
		}
	}

	// Status <-> Column mapping (they should always be in sync)
	function getColumnFromStatus(status: StatusType): ColumnType {
		switch (status) {
			case 'raw': return 'todo';
			case 'retuschiert': return 'wip';
			case 'abgeschlossen': return 'done';
			default: return 'todo';
		}
	}

	function getStatusFromColumn(col: ColumnType): StatusType {
		switch (col) {
			case 'todo': return 'raw';
			case 'wip': return 'retuschiert';
			case 'done': return 'abgeschlossen';
			default: return 'raw';
		}
	}

	onMount(() => {
		getAndCreateTasks();
		io.on('database-changed', () => {
			getAndCreateTasks();
		});
		
		// Cursor glow tracking
		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};
		window.addEventListener('mousemove', handleMouseMove);
		updateCursorGlow();
		
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});

	function toggleAnalytics() {
		analyticsOpen = !analyticsOpen;
	}

	function switchView(view: ViewMode) {
		currentView = view;
	}

	function toggleClosed() {
		showClosed = !showClosed;
		showFinishedTasks.set(showClosed);
		toast(showClosed ? 'Abgeschlossene werden angezeigt' : 'Abgeschlossene ausgeblendet');
	}

	function openNewOrder() {
		panelMode = 'new';
		selectedOrderId = null;
		panelOpen = true;
	}

	function openDetail(orderId: string) {
		panelMode = 'detail';
		selectedOrderId = orderId;
		panelOpen = true;
	}

	function closePanel() {
		panelOpen = false;
		selectedOrderId = null;
	}

	function openStatusDropdown(event: MouseEvent, orderId: string) {
		event.stopPropagation();
		statusDropdownTrigger = event.currentTarget as HTMLElement;
		statusDropdownOrderId = orderId;
		statusDropdownOpen = true;
	}

	function closeStatusDropdown() {
		statusDropdownOpen = false;
		statusDropdownTrigger = null;
		statusDropdownOrderId = null;
	}

	function handleSearch(val: string) {
		searchQuery = val;
	}

	async function updateOrderStatus(status: StatusType, label: string) {
		if (!statusDropdownOrderId) return;
		
		const order = filteredOrders.find(o => o.id === statusDropdownOrderId);
		if (!order) return;

		// When status changes, column changes automatically to match
		const newCol = getColumnFromStatus(status);
		const isFinished = status === 'abgeschlossen';

		// Map status back to API format
		const apiStatus = status === 'raw' ? 'NichtBearbeitet' : 
		                 status === 'retuschiert' ? 'Retuschiert' : 'Gedruckt';

		// Update via API - createNewTask handles both create and update
		fetch('/api/createNewTask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				taskID: parseInt(statusDropdownOrderId),
				status: apiStatus,
				task: order.name,
				dueAt: order.date,
				additional_information: order.info,
				taskColumn: mapColumnToString(newCol),
				is_finished: isFinished
			})
		}).then(() => {
			getAndCreateTasks();
			io.emit('database-change');
			toast.success(`Status → ${label}`);
		});

		closeStatusDropdown();
	}

	async function deleteOrder(orderId: string) {
		fetch('/api/deleteUserTask', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ task_id: parseInt(orderId) })
		}).then(() => {
			getAndCreateTasks();
			io.emit('database-change');
			closePanel();
			toast.success('Auftrag gelöscht');
		});
	}

	async function createOrder(orderData: {
		name: string;
		date: string;
		status: StatusType;
		info: string;
	}) {
		const apiStatus = orderData.status === 'raw' ? 'NichtBearbeitet' : 
		                 orderData.status === 'retuschiert' ? 'Retuschiert' : 'Gedruckt';
		
		// Column is automatically determined from status
		const col = getColumnFromStatus(orderData.status);
		const isFinished = orderData.status === 'abgeschlossen';

		fetch('/api/createNewTask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				taskID: null,
				task: orderData.name,
				dueAt: orderData.date,
				status: apiStatus,
				additional_information: orderData.info,
				taskColumn: mapColumnToString(col),
				is_finished: isFinished
			})
		}).then(() => {
			getAndCreateTasks();
			io.emit('database-change');
			closePanel();
			toast.success(`"${orderData.name}" erstellt ✦`);
		});
	}

	async function updateOrderColumn(orderId: string, newCol: ColumnType) {
		const order = filteredOrders.find(o => o.id === orderId);
		if (!order) return;

		// When column changes via drag-and-drop, status changes automatically to match
		const newStatus = getStatusFromColumn(newCol);
		const isFinished = newCol === 'done';

		fetch('/api/createNewTask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				taskID: parseInt(orderId),
				task: order.name,
				dueAt: order.date,
				status: newStatus === 'raw' ? 'NichtBearbeitet' : 
				       newStatus === 'retuschiert' ? 'Retuschiert' : 'Gedruckt',
				additional_information: order.info,
				taskColumn: mapColumnToString(newCol),
				is_finished: isFinished
			})
		}).then(() => {
			getAndCreateTasks();
			io.emit('database-change');
		});
	}
</script>

<Toaster />

<!-- Cursor Glow -->
<div 
	class="cursor-glow"
	id="cursorGlow" 
	bind:this={cursorGlowRef}
></div>

<!-- App Container -->
<div class="app">
	<Topbar 
		{analyticsOpen}
		onToggleAnalytics={toggleAnalytics}
	/>

	<Header 
		{searchQuery}
		onSearch={handleSearch}
		onNewOrder={openNewOrder}
	/>

	<!-- Header Separator -->
	<div class="header-sep"></div>

	<AnalyticsPanel 
		{analyticsOpen}
		orders={filteredOrders}
	/>

	<StatsBar {stats} />

	<ViewControls 
		{currentView}
		{showClosed}
		onSwitchView={switchView}
		onToggleClosed={toggleClosed}
	/>

	<!-- Content Area -->
	<div class="content-area">
		{#if currentView === 'list'}
			<TableView 
				orders={filteredOrders}
				onOpenDetail={openDetail}
				onOpenStatusDropdown={openStatusDropdown}
				onDeleteOrder={deleteOrder}
			/>
		{:else}
			<KanbanView 
				orders={filteredOrders}
				onOpenDetail={openDetail}
				onNewOrder={openNewOrder}
				onUpdateColumn={updateOrderColumn}
			/>
		{/if}
	</div>
</div>

<OrderPanel 
	open={panelOpen}
	mode={panelMode}
	order={panelMode === 'detail' && selectedOrderId 
		? (filteredOrders.find(o => o.id === selectedOrderId) ?? null)
		: null}
	onClose={closePanel}
	onDelete={deleteOrder}
	onCreate={createOrder}
/>

<StatusDropdown 
	open={statusDropdownOpen}
	trigger={statusDropdownTrigger}
	onSelect={updateOrderStatus}
	onClose={closeStatusDropdown}
/>

<style>
	.cursor-glow {
		position: fixed;
		width: 420px;
		height: 420px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(201,168,76,0.055) 0%, transparent 70%);
		pointer-events: none;
		z-index: 9999;
		transform: translate(-50%, -50%);
		will-change: transform;
		transition: opacity 0.3s;
	}

	.app {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		opacity: 0;
		animation: appIn 0.6s 0.05s ease forwards;
	}

	@keyframes appIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.header-sep {
		margin: 20px 52px 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15) 20%, rgba(201,168,76,0.1) 80%, transparent);
	}

	.content-area {
		padding: 0 52px 52px;
		flex: 1;
	}

	:global(:root) {
		--bg: #0a0906;
		--surface: rgba(255,252,245,0.032);
		--surface-hover: rgba(255,252,245,0.062);
		--border: rgba(201,168,76,0.12);
		--border-bright: rgba(201,168,76,0.28);
		--text-primary: #ede9e0;
		--text-secondary: rgba(237,233,224,0.52);
		--text-muted: rgba(237,233,224,0.28);
		--gold: #C9A84C;
		--gold-light: #E8D5A3;
		--gold-muted: #8B6914;
		--gold-glow: rgba(201,168,76,0.22);
		--gold-dim: rgba(201,168,76,0.10);
		--red: #E07272;
		--red-glow: rgba(224,114,114,0.28);
		--green: #6EC994;
		--green-glow: rgba(110,201,148,0.22);
		--blue: #70A8E0;
		--blue-glow: rgba(112,168,224,0.28);
		--blur: blur(32px) saturate(170%);
	}

	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(html) {
		font-size: 16px;
		-webkit-font-smoothing: antialiased;
	}

	:global(body) {
		background: var(--bg);
		background-color: #0a0906;
		color: var(--text-primary);
		font-family: 'Inter', sans-serif;
		font-weight: 300;
		min-height: 100vh;
		overflow-x: hidden;
	}

	:global(body::before) {
		content: '';
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		background: radial-gradient(ellipse 65% 50% at 12% 6%, rgba(201,168,76,0.09) 0%, transparent 60%),
		           radial-gradient(ellipse 45% 45% at 88% 88%, rgba(112,168,224,0.05) 0%, transparent 60%),
		           radial-gradient(ellipse 40% 30% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%);
	}

	:global(body::after) {
		content: '';
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
		opacity: 0.03;
	}

	:global(::-webkit-scrollbar) {
		width: 5px;
	}

	:global(::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: rgba(201,168,76,0.1);
		border-radius: 3px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: rgba(201,168,76,0.2);
	}
</style>
