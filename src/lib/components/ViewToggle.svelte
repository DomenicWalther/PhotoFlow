<script lang="ts">
    export let viewMode: 'table' | 'calendar';
</script>

<div class="mb-4 flex justify-end space-x-2">
    <button
        class="rounded px-4 py-2 {viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
        on:click={() => viewMode = 'table'}
    >
        <svg class="h-5 w-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M3 18h18M3 6h18"/>
        </svg>
        Tabelle
    </button>
    <button
        class="rounded px-4 py-2 {viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
        on:click={() => viewMode = 'calendar'}
    >
        <svg class="h-5 w-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        Kalender
    </button>
</div> 