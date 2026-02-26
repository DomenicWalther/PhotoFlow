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

	export let open: boolean;
	export let mode: 'detail' | 'new';
	export let order: Order | null;
	export let onClose: () => void;
	export let onDelete: (id: string) => void;
	export let onCreate: (data: {
		name: string;
		date: string;
		status: 'raw' | 'retuschiert' | 'abgeschlossen';
		info: string;
	}) => void;

	let name = '';
	let date = '';
	let status: 'raw' | 'retuschiert' | 'abgeschlossen' = 'raw';
	let info = '';
	let comment = '';
	let activities: string[] = ['Auftrag erstellt'];

	$: if (open && mode === 'new') {
		name = '';
		date = '';
		status = 'raw';
		info = '';
	}

	function handleClose() {
		onClose();
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	function handleDelete() {
		if (order) {
			onDelete(order.id);
		}
	}

	function handleCreate() {
		if (!name.trim()) return;
		onCreate({ name: name.trim(), date, status, info: info.trim() || '—' });
	}

	function addComment() {
		if (comment.trim()) {
			activities = [comment.trim(), ...activities];
			comment = '';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div 
		class="overlay"
		class:open={open}
		on:click={handleOverlayClick}
	>
		<div class="panel">
			<div class="panel-head">
				<div>
					<div class="panel-eyebrow">
						{mode === 'detail' ? 'Auftragsdetails' : 'Neuer Auftrag'}
					</div>
					<div class="panel-title">
						{#if mode === 'detail' && order}
							{order.name}
						{:else}
							Auftrag <em>& erstellen</em>
						{/if}
					</div>
				</div>
				<button class="panel-close" on:click={handleClose}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"/>
						<line x1="6" y1="6" x2="18" y2="18"/>
					</svg>
				</button>
			</div>

			<div class="panel-body">
				{#if mode === 'detail' && order}
					<div class="dfields">
						<div class="dfield">
							<span class="flabel">Kunde</span>
							<span class="fvalue">{order.name}</span>
						</div>
						<div class="dfield">
							<span class="flabel">Abholdatum</span>
							<span class="fvalue" class:overdue={order.overdue}>{order.dateLabel}</span>
						</div>
						<div class="dfield">
							<span class="flabel">Status</span>
							<span class="fvalue">
								<span class="pill {order.status}">
									<span class="pdot"></span>
									{order.statusLabel}
								</span>
							</span>
						</div>
						<div class="dfield">
							<span class="flabel">Zusatzinfo</span>
							<span class="fvalue">{order.info}</span>
						</div>
					</div>

					<div>
						<div class="section-title">Kommentar</div>
						<textarea 
							class="comment-box"
							placeholder="Notiz…"
							bind:value={comment}
						></textarea>
						<button class="btn-sec" on:click={addComment}>
							Speichern
						</button>
					</div>

					<div>
						<div class="section-title">Aktivität</div>
						<div class="activity-list">
							{#each activities as activity, i (i)}
								<div class="act-item" style="animation-delay: {i * 50}ms;">
									<div class="act-dot"></div>
									<div>
										<div class="act-text">{activity}</div>
										<div class="act-time">{i === 0 ? 'heute' : 'vor ' + i + ' Tagen'}</div>
									</div>
								</div>
							{/each}
						</div>
					</div>

					<button class="btn-delete" on:click={handleDelete}>
						Auftrag löschen
					</button>
				{:else}
					<div class="form-row">
						<div class="form-group">
							<label class="form-label">Kundenname</label>
							<input 
								class="form-input"
								placeholder="z.B. Max Mustermann"
								bind:value={name}
								autocomplete="off"
							>
						</div>
						<div class="form-group">
							<label class="form-label">Abholdatum</label>
							<input 
								class="form-input"
								type="date"
								bind:value={date}
							>
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label class="form-label">Status</label>
							<select class="form-select" bind:value={status}>
								<option value="raw">RAW</option>
								<option value="retuschiert">Retuschiert</option>
								<option value="abgeschlossen">Abgeschlossen</option>
							</select>
						</div>
					</div>

					<div class="form-group">
						<label class="form-label">Zusätzliche Infos</label>
						<textarea 
							class="form-textarea"
							placeholder="Besondere Wünsche, Anmerkungen…"
							bind:value={info}
						></textarea>
					</div>

					<button class="btn-primary" on:click={handleCreate}>
						Auftrag erstellen ✦
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.6);
		backdrop-filter: blur(10px);
		z-index: 500;
		display: none;
		opacity: 0;
		transition: opacity 0.28s;
		align-items: stretch;
		justify-content: flex-end;
	}

	.overlay.open {
		display: flex;
		opacity: 1;
	}

	.panel {
		width: 500px;
		max-width: 94vw;
		height: 100vh;
		background: rgba(10,9,6,0.98);
		backdrop-filter: blur(40px) saturate(180%);
		border-left: 1px solid var(--border);
		overflow-y: auto;
		transform: translateX(100%);
		transition: transform 0.34s cubic-bezier(0.32,0.72,0,1);
		display: flex;
		flex-direction: column;
	}

	.overlay.open .panel {
		transform: translateX(0);
	}

	.panel-head {
		padding: 36px 36px 24px;
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		background: rgba(10,9,6,0.97);
		backdrop-filter: blur(22px);
		z-index: 10;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.panel-head::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent);
	}

	.panel-close {
		width: 31px;
		height: 31px;
		border-radius: 9px;
		background: var(--surface);
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--text-secondary);
		transition: all 0.18s;
		flex-shrink: 0;
		margin-top: 4px;
		padding: 0;
	}

	.panel-close:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
		transform: rotate(90deg);
		border-color: var(--border-bright);
	}

	.panel-close svg {
		width: 13px;
		height: 13px;
	}

	.panel-eyebrow {
		font-size: 9px;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 6px;
	}

	.panel-title {
		font-family: 'Cormorant Garamond', serif;
		font-size: 30px;
		font-weight: 300;
		line-height: 1.15;
	}

	.panel-title em {
		font-style: italic;
		color: var(--gold);
	}

	.panel-body {
		padding: 28px 36px;
		display: flex;
		flex-direction: column;
		gap: 24px;
		flex: 1;
	}

	/* detail */
	.dfields {
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
	}

	.dfield {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 13px 18px;
		border-bottom: 1px solid rgba(201,168,76,0.06);
		transition: background 0.15s;
	}

	.dfield:last-child {
		border-bottom: none;
	}

	.dfield:hover {
		background: rgba(201,168,76,0.025);
	}

	.flabel {
		font-size: 9.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.fvalue {
		font-size: 13px;
		color: var(--text-primary);
		text-align: right;
		max-width: 260px;
	}

	.fvalue.overdue {
		color: var(--red);
	}

	/* form */
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.form-label {
		font-size: 9.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.form-input,
	.form-select,
	.form-textarea {
		background: rgba(255,255,255,0.04);
		border: 1px solid var(--border);
		border-radius: 11px;
		padding: 11px 15px;
		color: var(--text-primary);
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 300;
		outline: none;
		transition: all 0.22s;
		width: 100%;
	}

	.form-input::placeholder,
	.form-textarea::placeholder {
		color: var(--text-muted);
	}

	.form-input:focus,
	.form-select:focus,
	.form-textarea:focus {
		border-color: rgba(201,168,76,0.35);
		background: rgba(255,255,255,0.055);
		box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
	}

	.form-select {
		appearance: none;
		cursor: pointer;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(237,233,224,0.3)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 13px center;
		background-size: 10px;
		padding-right: 36px;
	}

	.form-select option {
		background: #0d0b08;
	}

	.form-textarea {
		resize: vertical;
		min-height: 80px;
		line-height: 1.5;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--gold) 0%, #d4b47a 100%);
		color: #0a0906;
		border: none;
		border-radius: 11px;
		padding: 12px 24px;
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.22s;
		width: 100%;
		margin-top: 4px;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 36px rgba(201,168,76,0.4);
	}

	.btn-primary:active {
		transform: translateY(0);
	}

	/* comment */
	.section-title {
		font-size: 9.5px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin-bottom: 10px;
	}

	.comment-box {
		background: rgba(255,255,255,0.03);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 13px 15px;
		resize: none;
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		color: var(--text-primary);
		width: 100%;
		min-height: 80px;
		outline: none;
		transition: all 0.22s;
		line-height: 1.5;
	}

	.comment-box::placeholder {
		color: var(--text-muted);
	}

	.comment-box:focus {
		border-color: rgba(201,168,76,0.3);
		box-shadow: 0 0 0 3px rgba(201,168,76,0.06);
	}

	.btn-sec {
		background: var(--surface-hover);
		border: 1px solid var(--border);
		color: var(--text-primary);
		border-radius: 10px;
		padding: 8px 16px;
		font-family: 'Inter', sans-serif;
		font-size: 12px;
		cursor: pointer;
		transition: all 0.15s;
		margin-top: 8px;
	}

	.btn-sec:hover {
		background: rgba(255,255,255,0.1);
		border-color: var(--border-bright);
		transform: translateY(-1px);
	}

	/* activity */
	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.act-item {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		animation: fadeUp 0.3s ease both;
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(6px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.act-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: rgba(255,255,255,0.12);
		margin-top: 4px;
		flex-shrink: 0;
	}

	.act-text {
		font-size: 12px;
		color: var(--text-muted);
		line-height: 1.5;
	}

	.act-time {
		font-size: 10px;
		color: rgba(255,255,255,0.1);
		margin-top: 2px;
	}

	/* delete button */
	.btn-delete {
		width: 100%;
		margin-top: auto;
		background: rgba(224,114,114,0.1);
		border: 1px solid rgba(224,114,114,0.3);
		color: var(--red);
		border-radius: 11px;
		padding: 12px 24px;
		font-family: 'Inter', sans-serif;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.22s;
	}

	.btn-delete:hover {
		background: rgba(224,114,114,0.2);
		transform: translateY(-2px);
	}

	/* pill in detail view */
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
		font-family: 'Inter', sans-serif;
		background: transparent;
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
</style>
