<!--src/routes/+layout.svelte-->
<script lang="ts">
    import { onMount } from 'svelte';
    import { user, isAuthenticated, isLoading, } from '$lib/stores';
    import { auth } from '$lib/firebase';
    import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
    import Navbar from '$lib/components/Homepage/NavBar.svelte';
    import Footer from '$lib/components/Homepage/Footer.svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import '../app.css';


    export let data;

    $: isAuthPage = $page.url.pathname === '/login' || $page.url.pathname === '/register';
    $: isUserDashboard = $page.url.pathname.startsWith('/user-dashboard');
    $: isAdminDashboard = $page.url.pathname.startsWith('/admin-dashboard');
    $: serverUser = data.serverUser;

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
            isLoading.set(true);
            try {
                if (currentUser) {
                    user.set({
                        uid: currentUser.uid,
                        email: currentUser.email || '',
                        displayName: currentUser.displayName || 'Anonymous',
                        name: currentUser.displayName || 'Anonymous'
                    });
                    isAuthenticated.set(true);

                    // Check if the user has just registered
                    
                } else {
                    user.set(null);
                    isAuthenticated.set(false);

                    // Comment out or remove the redirection logic
                    // if ($page.url.pathname === '/') {
                    //     goto('/');
                    // }
                }
            } catch (error) {
                console.error('Error during authentication state change:', error);
                user.set(null);
                isAuthenticated.set(false);
            } finally {
                isLoading.set(false);
            }
        });

        return unsubscribe;
    });
</script>

<div>
    {#if $isLoading}
        <div class="flex justify-center items-center h-screen">
            <div class="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500"></div>
        </div>
    {:else}
        {#if !isAuthPage && !isUserDashboard && !isAdminDashboard}
            <Navbar />
        {/if}

        <main class="flex flex-col min-h-screen">
            <slot></slot>
        </main>

        {#if !isAuthPage && !isUserDashboard && !isAdminDashboard}
            <Footer />
        {/if}
    {/if}
</div>

<style>
    :global(body, html) {
        margin: 0;
        padding: 0;
        height: 100%;
    }
</style>