<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { getUserContext } from '$lib/stores';
    import { db } from '$lib/firebase';
    import { doc, onSnapshot } from 'firebase/firestore';
	import { goto } from '$app/navigation';

    function naigateToPayStack() {
        goto('/user-dashboard/paystack');
    }
    // Get the user context
    const { user, username, loading } = getUserContext();
  
    let walletAmount: string | number = 'Loading...';
    let unsubscribe: () => void;
    let isVisible = false;
  
    onMount(() => {
        const unsubscribeUser = user.subscribe(($user) => {
            if ($user?.email) {
                const docRef = doc(db, 'wallets', $user.email);
  
                unsubscribe = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        walletAmount = docSnap.data().amount;
                    } else {
                        console.warn('No wallet found for:', $user.email);
                        walletAmount = 'Not available';
                    }
                }, (error) => {
                    console.error('Error fetching wallet amount:', error);
                    walletAmount = 'Error loading amount';
                });
            } else {
                console.error('User email not available');
            }
        });
  
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
            unsubscribeUser();
        };
    });
  
    function toggleVisibility() {
        isVisible = !isVisible;
    }
  </script>

  {#if $user}
  <div class="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="p-6">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div class="flex items-center space-x-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                    <h2 class="text-lg font-semibold text-gray-700">Available Balance</h2>
                    <div class="flex items-center space-x-2">
                        <p class="text-2xl font-bold text-green-600">
                            {isVisible ? `₦${typeof walletAmount === 'number' ? walletAmount.toFixed(2) : walletAmount}` : '\u2022\u2022\u2022\u2022\u2022\u2022'}
                        </p>
                        <button
                            class="text-gray-500 hover:text-gray-700 focus:outline-none"
                            on:click={toggleVisibility}
                            aria-label={isVisible ? "Hide balance" : "Show balance"}
                        >
                            {#if isVisible}
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            {:else}
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                </svg>
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
            <button on:click={naigateToPayStack} class="w-full md:w-auto bg-white text-green-500 border border-green-500 font-semibold py-2 px-4 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                    Top Up Balance
            </button>
        </div>
    </div>
</div>
{:else}
<div class="bg-white shadow rounded-lg p-6">
  <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
</div>
{/if}


