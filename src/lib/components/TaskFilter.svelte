<script lang="ts">
    import { tasksFilters, showFinishedTasks } from '$lib/Stores/TaskStore';
    
    export let isOpen = false;

    let dateFrom: string = '';
    let dateTo: string = '';
    let selectedStatus: string = '';
    let isAndFilter = true;  // true = AND, false = OR

    const statusOptions = [
        { value: '', label: 'Alle Status' },
        { value: 'NichtBearbeitet', label: 'RAW' },
        { value: 'Entwickelt', label: 'Entwickelt' },
        { value: 'Retuschiert', label: 'Retuschiert' },
        { value: 'Gedruckt', label: 'Gedruckt' }
    ];

    function updateFilters() {
        const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
        const toDate = dateTo ? new Date(`${dateTo}T00:00:00`) : null;

        tasksFilters.update(filters => ({
            dateFrom: fromDate,
            dateTo: toDate,
            status: selectedStatus,
            isAndFilter
        }));
    }

    function resetFilters() {
        dateFrom = '';
        dateTo = '';
        selectedStatus = '';
        isAndFilter = true;
        updateFilters();
    }

    $: if (dateFrom || dateTo || selectedStatus || isAndFilter) {
        updateFilters();
    }
</script>

<div class="filter-panel {isOpen ? 'open' : ''}" class:shadow-lg={isOpen}>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div class="filter-group">
            <label for="dateFrom" class="block text-sm font-medium text-gray-700 mb-1">
                Von Datum
            </label>
            <input
                type="date"
                id="dateFrom"
                bind:value={dateFrom}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
        </div>

        <div class="filter-group">
            <label for="dateTo" class="block text-sm font-medium text-gray-700 mb-1">
                Bis Datum
            </label>
            <input
                type="date"
                id="dateTo"
                bind:value={dateTo}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
        </div>

        <div class="filter-group">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
                Status
            </label>
            <select
                id="status"
                bind:value={selectedStatus}
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                {#each statusOptions as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </div>

        <div class="filter-group col-span-full">
            <label class="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    bind:checked={$showFinishedTasks}
                    class="sr-only peer"
                >
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                <span class="ms-3 text-sm font-medium text-gray-700">
                    Abgeschlossene Aufträge anzeigen
                </span>
            </label>
        </div>
    </div>

    <div class="flex justify-between items-center px-4 pb-4">
        <div class="flex items-center gap-2">
            <label class="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    bind:checked={isAndFilter}
                    class="sr-only peer"
                >
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                <span class="ms-3 text-sm font-medium text-gray-700">
                    {isAndFilter ? 'UND' : 'ODER'} Verknüpfung
                </span>
            </label>
        </div>
        <button
            on:click={resetFilters}
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
        >
            Filter zurücksetzen
        </button>
    </div>
</div>

<style lang="scss">
    .filter-panel {
        @apply bg-white rounded-lg mb-4 overflow-hidden transition-all duration-300;
        max-height: 0;
        opacity: 0;

        &.open {
            max-height: 500px;
            opacity: 1;
        }
    }

    .filter-group {
        @apply flex flex-col;
    }
</style> 