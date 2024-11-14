<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Task } from '$lib/types/Task';

    export let tasks: Task[];
    
    const dispatch = createEventDispatcher();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calendar state
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Helper functions
    function getDaysInMonth(month: number, year: number) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(month: number, year: number) {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
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
    <div class="flex items-center justify-between p-4 border-b">
        <button
            class="p-2 rounded hover:bg-gray-100 text-gray-600"
            on:click={previousMonth}
        >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h2 class="text-xl font-semibold text-gray-800">
            {monthName} {currentYear}
        </h2>
        <button
            class="p-2 rounded hover:bg-gray-100 text-gray-600"
            on:click={nextMonth}
        >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>

    <div class="grid grid-cols-7 border-b">
        {#each ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as day}
            <div class="p-3 text-center text-sm font-semibold text-gray-600 border-r last:border-r-0">
                {day}
            </div>
        {/each}
    </div>

    <div class="grid grid-cols-7">
        {#each Array(firstDayOfMonth).fill(null) as _}
            <div class="min-h-[120px] p-2 bg-gray-50 border-b border-r"></div>
        {/each}

        {#each calendarDays as { date, tasks: dayTasks }}
            <div class="min-h-[120px] p-2 border-b border-r relative {date.toDateString() === today.toDateString() ? 'today' : ''} hover:bg-gray-50">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-sm font-medium {date.toDateString() === today.toDateString() ? 'text-blue-600' : 'text-gray-700'}">
                        {date.getDate()}
                    </span>
                    {#if dayTasks.length > 0}
                        <span class="task-count">
                            {dayTasks.length}
                        </span>
                    {/if}
                </div>
                <div class="space-y-1 overflow-y-auto max-h-[80px]">
                    {#each dayTasks as task}
                        <div 
                            class="task-item"
                            on:click={() => dispatch('openUpdateTask', { task })}
                        >
                            {task.name}
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .today {
        @apply relative;
        
        &::before {
            content: '';
            @apply absolute inset-0 border-2 border-blue-500;
            z-index: 1;
        }
    }

    .task-count {
        @apply bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 
               flex items-center justify-center;
    }

    .task-item {
        @apply text-xs p-1 rounded bg-blue-50 text-blue-700 
               cursor-pointer truncate hover:bg-blue-100 transition-colors;
    }

    /* Scrollbar Styling */
    div {
        scrollbar-width: thin;
        scrollbar-color: rgba(203, 213, 225, 1) transparent;

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-track {
            @apply bg-transparent;
        }

        &::-webkit-scrollbar-thumb {
            @apply bg-slate-300 rounded;
        }
    }

    /* Hover-Effekt für den aktuellen Tag */
    .today {
        &::after {
            content: '';
            @apply absolute -inset-px bg-blue-50 -z-10;
        }
    }
</style> 