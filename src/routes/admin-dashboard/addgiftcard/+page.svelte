<script>
  import AddGiftCard from '$lib/components/admin/AddGiftCard.svelte';
	import { getUserContext } from '$lib/stores';

 const { user, username, loading } = getUserContext();
    
    
</script>

{#if $user}
<AddGiftCard />
{:else}
<div class="bg-white shadow rounded-lg p-6">
  <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
</div>
{/if}
