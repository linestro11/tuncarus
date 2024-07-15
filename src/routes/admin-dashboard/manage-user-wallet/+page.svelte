<script lang="ts">
    import { getUserContext } from '$lib/stores';
    import UpdateWallet from '$lib/components/admin/UpdateWallet.svelte'
    import ViewUser from '$lib/components/admin/ViewUser.svelte';
    import Note from '$lib/components/admin/Note.svelte';
    import BankDetails from '$lib/components/admin/BankDetails.svelte'
    

    const { user, username, loading } = getUserContext();

</script>

{#if $user}
<UpdateWallet/><br>

<Note /><br>

<ViewUser />
{:else}
<div class="bg-white shadow rounded-lg p-6">
  <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
</div>
{/if}