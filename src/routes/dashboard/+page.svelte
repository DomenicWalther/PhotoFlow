<script lang="ts">
    import type { PageData } from './$types'
    
    export let data: PageData
</script>

<p>Client Count: {data.clientCount}</p>
<p>Client's in the past 30 days: {data.pastClientCount} </p>
<p>Total amount of finished Tasks: {data.totalFinishedTasks}</p>


