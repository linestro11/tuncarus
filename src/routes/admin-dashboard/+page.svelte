<script lang="ts">
    import Crud from '$lib/components/admin/Crud.svelte';
    import { onMount } from 'svelte';
    import { getUserContext } from '$lib/stores';
    import { goto } from '$app/navigation';
    import '../../app.css';

    const { user, username, loading } = getUserContext();

    // Ensure your onMount logic is correctly set up if you have any
    onMount(() => {
        if ($user && $user.email !== 'ericosas129@gmail.com') {
            goto('/user-dashboard');
        }
    });
</script>

{#if $loading}
    <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500"></div>
    </div>
{:else if $user}
    <Crud />
{:else}
    <p>Please log in to access your dashboard.</p>
{/if}

<style>
    /* Add any custom scoped styles here */
</style>
