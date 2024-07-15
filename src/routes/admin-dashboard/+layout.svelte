<!-- src/routes/admin-dashboard/+layout.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { auth, db, checkAndUpdateEmailVerification } from '$lib/firebase';
    import { doc, getDoc } from 'firebase/firestore';
    import { onAuthStateChanged, type User } from 'firebase/auth';
    import { createUserContext } from '$lib/stores';
    import { page } from '$app/stores';
    import Logout from '$lib/components/Homepage/Logout.svelte';

    const { user, username, loading } = createUserContext();

    const navItems = [
        { href: '/admin-dashboard', label: 'Manage-user request' },
        { href: '/admin-dashboard/manage-user-wallet', label: 'Manage-user-wallet' },
        { href: '/admin-dashboard/addgiftcard', label: 'Add-gift-card' },
        { href: '/admin-dashboard/view-payments-details', label: 'View-payment-details' },
    ];

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    onMount(async () => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            loading.set(true);
            if (currentUser) {
                user.set(currentUser);
                await checkAndUpdateEmailVerification(currentUser);
                const docRef = doc(db, 'profiles', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    username.set(userData.username);
                } else {
                    console.error('No such document!');
                    username.set('User');
                }
            } else {
                user.set(null);
                username.set(null);
            }
            loading.set(false);
        });

        return unsubscribe;
    });
</script>

{#if $user}
<div class="min-h-screen flex flex-col">
    <!-- Top links area -->
    <div class="bg-green-950 text-white p-4 z-30 ">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between ">
            <span class="text-xl font-semibold mb-2 md:mb-0">Admin Dashboard</span>
            <button class="md:hidden" on:click={toggleMenu}>
                {#if isMenuOpen}
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                {:else}
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                {/if}
            </button>
            <div class="hidden md:flex flex-wrap items-center space-x-4">
                {#each navItems as item}
                    <a
                        href={item.href}
                        class="hover:underline"
                        class:font-bold={$page.url.pathname === item.href}
                    >
                        {item.label}
                    </a>
                {/each}
                <Logout />
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    {#if isMenuOpen}
        <div class="mt-16 absolute top-0 left-0 w-full md:hidden bg-green-950 text-white p-4 transition-transform transform duration-300 ease-in-out z-30">
            <div class="flex flex-col space-y-4">
                {#each navItems as item}
                    <a
                        href={item.href}
                        class="hover:underline"
                        class:font-bold={$page.url.pathname === item.href}
                    >
                        {item.label}
                    </a>
                {/each}
                <Logout />
            </div>
        </div>
    {/if}

    <!-- Main content -->
    <main class="flex-1 max-w-7xl mx-auto p-4 overflow-y-auto">
        <h1 class="text-2xl font-semibold text-gray-900 mb-4">
            Welcome, Admin {$username || 'User'}
        </h1>
    </main>
    <slot />
</div>
{:else}
<div class="bg-white shadow rounded-lg p-6">
  <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
  {#if !checkAndUpdateEmailVerification($user)}
  <div>
    please verify your email
  </div>
  {/if}
</div>
{/if}




<style>
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow-x: hidden;
    }

    .min-h-screen {
        min-height: 100vh;
    }

    .flex-1 {
        flex: 1;
    }

    .bg-green-950 {
        background-color: #0f3d3e; /* Assuming this is your intended color */
    }

    @media (max-width: 640px) {
        .p-4 {
            padding: 1rem;
        }
    }
</style>