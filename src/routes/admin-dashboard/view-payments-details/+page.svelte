<script lang="ts">
import FetchTransaction from "$lib/components/admin/FetchTransaction.svelte";
import { getUserContext } from "$lib/stores";

const { user, loading } = getUserContext();
</script>

{#if $user}
<FetchTransaction />
{:else}
<div class="bg-white shadow rounded-lg p-6">
    <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
</div>
{/if}

