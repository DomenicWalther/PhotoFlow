<script lang="ts">
    import { tasksFilters, showFinishedTasks, tasksSearchTerm } from '$lib/Stores/TaskStore';
    
    export let isOpen = false;
    export let startDate: Date | undefined = undefined;
    export let endDate: Date | undefined = undefined;
    export let searchQuery = '';

    let dateFrom = '';
    let dateTo = '';
    let selectedStatus = '';
    let isAndFilter = true;

    // Korrigierte Datums-Konvertierung mit Zeitzonenberücksichtigung
    function dateToInputValue(date: Date): string {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().split('T')[0];
    }

    function inputValueToDate(value: string): Date {
        const date = new Date(`${value}T12:00:00`); // Setze auf 12 Uhr mittags
        return date;
    }

    $: {
        if (startDate) {
            const newDateFrom = dateToInputValue(startDate);
            if (newDateFrom !== dateFrom) {
                dateFrom = newDateFrom;
            }
        }
    }

    $: {
        if (endDate) {
            const newDateTo = dateToInputValue(endDate);
            if (newDateTo !== dateTo) {
                dateTo = newDateTo;
            }
        }
    }

    function handleDateFromChange(value: string) {
        dateFrom = value;
        if (value) {
            startDate = inputValueToDate(value);
        } else {
            startDate = undefined;
        }
        updateFilters();
    }

    function handleDateToChange(value: string) {
        dateTo = value;
        if (value) {
            endDate = inputValueToDate(value);
        } else {
            endDate = undefined;
        }
        updateFilters();
    }

    const statusOptions = [
        { value: '', label: 'Alle Status' },
        { value: 'NichtBearbeitet', label: 'RAW' },
        { value: 'Entwickelt', label: 'Entwickelt' },
        { value: 'Retuschiert', label: 'Retuschiert' },
        { value: 'Gedruckt', label: 'Gedruckt' }
    ];

    function updateFilters() {
        const fromDate = dateFrom ? inputValueToDate(dateFrom) : null;
        const toDate = dateTo ? inputValueToDate(dateTo) : null;

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
        startDate = undefined;
        endDate = undefined;
        searchQuery = '';
        tasksSearchTerm.set('');
        updateFilters();
    }

    $: if (selectedStatus || isAndFilter) {
        updateFilters();
    }
</script>

<div class="filter-panel {isOpen ? 'open' : ''}" class:shadow-lg={isOpen}>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">
        <div class="filter-group">
            <label for="dateFrom" class="block text-sm font-medium text-gray-700 mb-1">
                Von Datum
            </label>
            <input
                type="date"
                id="dateFrom"
                value={dateFrom}
                on:input={(e) => handleDateFromChange(e.currentTarget.value)}
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
                value={dateTo}
                on:input={(e) => handleDateToChange(e.currentTarget.value)}
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

        <div class="filter-group flex flex-col justify-end">
            <button
                on:click={resetFilters}
                class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
            >
                Filter zurücksetzen
            </button>
        </div>

        <div class="filter-group col-span-full flex items-center gap-4">
            <label class="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    bind:checked={$showFinishedTasks}
                    class="sr-only peer"
                >
                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                <span class="ms-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                    Abgeschlossene Aufträge anzeigen
                </span>
            </label>

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
    </div>
</div>

<style lang="scss">
    .filter-panel {
        @apply bg-white rounded-lg mb-3 overflow-hidden transition-all duration-300;
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