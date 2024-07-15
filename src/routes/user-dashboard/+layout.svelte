<script lang="ts">
    import { onMount } from 'svelte';
    import { auth, db, checkAndUpdateEmailVerification } from '$lib/firebase';
    import { doc, getDoc } from 'firebase/firestore';
    import { onAuthStateChanged } from 'firebase/auth';
    import { createUserContext } from '$lib/stores';
    import { page } from '$app/stores';
    import Logout from '$lib/components/Homepage/Logout.svelte';
    import { Home, User, Settings, LockKeyhole, CircleUserRound } from 'lucide-svelte'; // Importing icons

    const { user, username, loading } = createUserContext();

    let sidebarOpen = false;

    const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
    };

    const navItems = [
        { href: '/user-dashboard', label: 'Dashboard', icon: Home },
        { href: '/user-dashboard/profile', label: 'Profile', icon: User },
        { href: '/user-dashboard/forget-password', label: 'Change Password', icon: LockKeyhole },
    ];

    onMount(() => {
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

<div class="flex h-screen bg-gray-100 ">
    <!-- Sidebar for desktop -->
    <aside class="hidden md:flex md:flex-shrink-0 md:w-64 bg-green-950">
        <div class="flex flex-col w-full">
            <div class="flex items-center justify-center h-16 bg-green-900">
                <span class="text-white text-xl font-semibold">Dashboard</span>
            </div>
            <nav class="mt-5 flex-grow">
                {#each navItems as item}
                    <a
                        href={item.href}
                        class="flex items-center px-6 py-2 mt-1 text-gray-100 hover:bg-gray-700"
                        class:bg-gray-700={$page.url.pathname === item.href}
                    >
                        <svelte:component this={item.icon} class="h-6 w-6 mr-2" /> <!-- Icon component -->
                        {item.label}
                    </a>
                {/each}
            </nav>
            <div class="mt-auto mb-4 px-6">
                <Logout />
            </div>
        </div>
    </aside>

    <!-- Mobile menu -->
    <div class="md:hidden">
        <div class="fixed inset-y-0 left-0 flex z-40 transition-transform duration-300 ease-in-out transform {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
            <div class="relative flex flex-col w-48 bg-gray-800">
                <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div class="flex-shrink-0 flex items-center px-4">
                        <span class="text-white text-lg font-semibold">Dashboard</span>
                    </div>
                    <nav class="mt-5 px-2 space-y-1">
                        {#each navItems as item}
                            <a
                                href={item.href}
                                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-gray-700"
                                class:bg-gray-900={$page.url.pathname === item.href}
                            >
                                <svelte:component this={item.icon} class="h-6 w-6 mr-2" /> <!-- Icon component -->
                                {item.label}
                            </a>
                        {/each}
                    </nav>
                </div>
                <div class="mt-auto mb-4 px-4">
                    <Logout />
                </div>
            </div>
        </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <header class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between">
                    <h1 class="text-xl font-semibold text-green-600/100 dark:text-green-600">
                       Welcome, {$username || 'User'}
                       
                    </h1>
                    <button
                        on:click={toggleSidebar}
                        class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    >
                        <span class="sr-only">{sidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
                        {#if sidebarOpen}
                            <svg class="h-6 w-6 stroke-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        {:else}
                            <svg class="h-6 w-6 stroke-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        {/if}
                    </button>
                </div>
            </div>
        </header>
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <slot />
            </div>
        </main>
    </div>
</div>
