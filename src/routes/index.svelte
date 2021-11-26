<script>
import Disco from "./_disco.svelte"
</script>

<svelte:head>
  <title>Lock Test Page</title>
</svelte:head>

{#each Array(16) as _}
  <Disco />
{/each}
