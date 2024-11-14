<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let tasks: any[] = [];

    // Calendar state
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Helper functions
    function getDaysInMonth(month: number, year: number) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(month: number, year: number) {
        return new Date(year, month, 1).getDay();
    }

    function getMonthName(month: number) {
        return new Date(2000, month).toLocaleString('de-DE', { month: 'long' });
    }

    function previousMonth() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
    }

    function nextMonth() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
    }

    $: daysInMonth = getDaysInMonth(currentMonth, currentYear);
    $: firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    $: monthName = getMonthName(currentMonth);

    $: calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1);
        return {
            date,
            tasks: tasks.filter(task => {
                // Ensure we're working with Date objects
                const taskDate = new Date(task.dueAt);
                // Reset time portion for both dates to compare only the date
                const taskDateOnly = new Date(
                    taskDate.getFullYear(),
                    taskDate.getMonth(),
                    taskDate.getDate()
                );
                const calendarDateOnly = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );
                
                // Compare timestamps of dates without time
                return taskDateOnly.getTime() === calendarDateOnly.getTime();
            })
        };
    });

    // Add this to help debug
    $: console.log('Tasks received:', tasks);
</script>

<div class="bg-white rounded-lg shadow">
    <div class="flex items-center justify-between p-4">
        <button
            class="p-2 rounded hover:bg-gray-100"
            on:click={previousMonth}
        >
            ←
        </button>
        <h2 class="text-xl font-semibold">
            {monthName} {currentYear}
        </h2>
        <button
            class="p-2 rounded hover:bg-gray-100"
            on:click={nextMonth}
        >
            →
        </button>
    </div>

    <div class="grid grid-cols-7 gap-px bg-gray-200 border-t border-b border-gray-200">
        {#each ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] as day}
            <div class="bg-gray-50 p-2 text-center text-sm font-medium">
                {day}
            </div>
        {/each}
    </div>

    <div class="grid grid-cols-7 gap-px bg-gray-200">
        {#each Array(firstDayOfMonth).fill(null) as _}
            <div class="bg-gray-50 p-2 h-32"></div>
        {/each}

        {#each calendarDays as { date, tasks: dayTasks }}
            <div class="bg-white p-2 h-32 overflow-y-auto">
                <div class="font-medium {date.toDateString() === new Date().toDateString() ? 'text-blue-600' : ''}">
                    {date.getDate()}
                </div>
                <!-- Debug output -->
                {#if dayTasks.length > 0}
                    <div class="text-xs text-red-500">
                        Tasks: {dayTasks.length}
                    </div>
                {/if}
                {#each dayTasks as task}
                    <div 
                        class="mt-1 p-1 text-sm rounded bg-blue-100 cursor-pointer hover:bg-blue-200"
                        on:click={() => dispatch('openUpdateTask', { task })}
                    >
                        <div class="font-medium truncate">{task.name}</div>
                        <div class="text-xs text-gray-600 truncate">
                            Task date: {new Date(task.dueAt).toLocaleDateString()}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    /* Hide scrollbar for Chrome, Safari and Opera */
    div::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    div {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
</style> 