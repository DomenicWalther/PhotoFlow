<script lang="ts">
    import { taskPriorities } from '$lib/Stores/TaskPriorityStore';
    import { createEventDispatcher } from 'svelte';
    import type { TaskPriority } from '$lib/types/task';

    const dispatch = createEventDispatcher();
    let isMinimized = false;

    function toggleMinimize() {
        isMinimized = !isMinimized;
    }
</script>

<div class="priority-list bg-white rounded-lg shadow-lg p-4">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Priorisierte Aufträge</h2>
        <button 
            on:click={toggleMinimize}
            class="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title={isMinimized ? "Maximieren" : "Minimieren"}
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform duration-200 {isMinimized ? 'rotate-180' : ''}" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>
    
    <div class="space-y-3 transition-all duration-300 overflow-hidden" style="max-height: {isMinimized ? '0' : '2000px'}">
        {#if $taskPriorities}
            {#each $taskPriorities as { task, priority, riskLevel, recommendation, confidence }}
                <div 
                    class="task-priority-item p-3 rounded-lg border {riskLevel === 'high' ? 'border-red-300 bg-red-50' : 
                        riskLevel === 'medium' ? 'border-yellow-300 bg-yellow-50' : 'border-green-300 bg-green-50'}"
                    on:click={() => dispatch('openUpdateTask', { task })}
                >
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-medium">{task.name}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-sm px-2 py-1 rounded-full {
                                riskLevel === 'high' ? 'bg-red-200 text-red-800' :
                                riskLevel === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                            }">
                                Priorität: {priority.toFixed(1)}
                            </span>
                            <span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {(confidence * 100).toFixed(0)}% Konfidenz
                            </span>
                        </div>
                    </div>
                    <div class="text-sm text-gray-600">
                        Deadline: {new Date(task.dueAt).toLocaleDateString('de-DE')}
                    </div>
                    <div class="text-sm mt-2 {
                        riskLevel === 'high' ? 'text-red-700' :
                        riskLevel === 'medium' ? 'text-yellow-700' :
                        'text-green-700'
                    }">
                        {recommendation}
                    </div>
                </div>
            {/each}
        {:else}
            <div class="text-gray-500 text-center py-4">
                Keine priorisierten Aufträge verfügbar
            </div>
        {/if}
    </div>
</div>

<style>
    .task-priority-item {
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .task-priority-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
</style> 