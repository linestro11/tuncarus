<script>
    import DisplayAvailableGiftCard from '$lib/components/user-dashboard/DisplayAvailableCard.svelte';
	import { getUserContext } from "$lib/stores";
    const { user, username, loading } = getUserContext();
</script>


{#if $loading}
<div class="flex justify-center items-center h-64">
  <div class="animate-spin rounded-full h-29 w-29 border-t-2 border-b-2 border-green-500"></div>
</div>
{:else if $user}
<div class="bg-white shadow rounded-lg p-6">
  <DisplayAvailableGiftCard />
</div>
{:else}
<div class="bg-white shadow rounded-lg p-6">
  <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
</div>
{/if}


