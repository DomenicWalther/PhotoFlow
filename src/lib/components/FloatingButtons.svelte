<script lang="ts">
    import SettingsIcon from '$lib/components/SVG/SettingsIcon.svelte';
    
    export let handleNewTask: () => void;
    export let handleSettings: () => void;
</script>

<div class="fixed bottom-6 right-6">
    <div class="relative group">
        <!-- Unsichtbarer Hover-Bereich -->
        <div class="hover-area"></div>

        <!-- Container für die radialen Buttons -->
        <div class="radial-menu">
            <!-- Settings Button -->
            <button
                on:click={handleSettings}
                type="button"
                class="floating-button secondary-button"
                title="Einstellungen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>

            <!-- Kanban Board Button -->
            <a 
                href="/dashboard"
                class="floating-button secondary-button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
            </a>
        </div>

        <!-- Main Button (Always visible) -->
        <button
            on:click={handleNewTask}
            type="button"
            class="floating-button main-button"
            title="Neuer Auftrag"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    </div>
</div>

<style lang="scss">
    .hover-area {
        position: absolute;
        bottom: -20px;
        right: -20px;
        width: 200px;
        height: 200px;
        background: transparent;
    }

    .floating-button {
        @apply h-14 w-14 rounded-full bg-blue-500 text-white shadow-lg 
               flex items-center justify-center transition-all
               hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 
               focus:ring-blue-400 focus:ring-offset-2;

        &:hover {
            @apply bg-blue-600;
        }
    }

    .main-button {
        position: relative;
        z-index: 20;
    }

    .radial-menu {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0;
        height: 0;
    }

    .secondary-button {
        position: absolute;
        opacity: 0;
        pointer-events: none;
        bottom: 7px;
        right: 7px;
        transition-delay: 0s;
        
        &:nth-child(1) {
            .group:hover & {
                transform: translate(-70px, -90px);
                opacity: 1;
                pointer-events: auto;
                transition-delay: 0.1s;
            }
        }
        
        &:nth-child(2) {
            .group:hover & {
                transform: translate(-120px, -40px);
                opacity: 1;
                pointer-events: auto;
                transition-delay: 0.1s;
            }
        }
    }

    .secondary-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.1s ease-in-out;
    }

    /* Verzögerung beim Ausblenden */
    .group:not(:hover) .secondary-button {
        transition-delay: 0.3s;
    }
</style> 