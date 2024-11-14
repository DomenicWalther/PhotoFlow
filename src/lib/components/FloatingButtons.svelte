<script lang="ts">
    import SettingsIcon from '$lib/components/SVG/SettingsIcon.svelte';
    
    export let handleNewTask: () => void;
    export let handleSettings: () => void;
</script>

<button
    on:click={handleSettings}
    type="button"
    class="fixed bottom-56 right-10 h-20 w-20 rounded-[50%] bg-blue-500 text-4xl text-white transition-all hover:scale-105 hover:bg-blue-500"
>
    <div class="mx-auto my-0 flex h-10 w-10 items-center justify-center">
        <SettingsIcon />
    </div>
</button>

<button
    on:click={handleNewTask}
    type="button"
    class="fixed bottom-10 right-10 h-20 w-20 rounded-[50%] bg-blue-500 text-4xl text-white transition-all hover:scale-105 hover:bg-blue-500"
>+</button>

<a href="/dashboard">
    <button
        type="button"
        class="fixed bottom-32 right-10 h-20 w-20 rounded-[50%] bg-blue-500 text-4xl text-white transition-all hover:scale-105 hover:bg-blue-500"
    >H</button>
</a> 