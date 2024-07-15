<script lang="ts">
  import { getUserContext } from '$lib/stores';
  import UserWallet from '$lib/components/user-dashboard/UserWallet.svelte';
  import Transaction from '$lib/components/user-dashboard/Transaction.svelte';
  import { CreditCard, Settings, DollarSign, Wallet, Gift } from 'lucide-svelte';
  import Logout from '$lib/components/Homepage/Logout.svelte';
  import { goto } from '$app/navigation';
  import Chat from './Chat.svelte';
  import { onMount } from 'svelte';
  import { checkAndUpdateEmailVerification } from '$lib/firebase'
	import { getAuth } from 'firebase/auth';

  const { user, username, loading } = getUserContext();

  onMount(async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const isVerified = await checkAndUpdateEmailVerification(user);
      if (!isVerified) {
        console.log('User email is not verified, redirected to email verification page');
      }
    } else {
      console.log('No authenticated user');
      // Optionally redirect to login page
       //goto('/login');
    }
  });

</script>

<div class="space-y-6">
  {#if $loading}
    <div class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-29 w-29 border-t-2 border-b-2 border-green-500"></div>
    </div>
  {:else if $user}
    <div class="bg-white shadow rounded-lg p-6">
      <UserWallet />
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div class="flex flex-wrap gap-4">
        <a href="/user-dashboard/requestgiftcard" class="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors duration-300">
          <CreditCard class="h-4 w-4 mr-2" />
          Request Gift Card
        </a>
        <a href="/user-dashboard/buygiftcard" class="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-300">
          <Gift class="h-4 w-4 mr-2" />
          Buy Gift Card
        </a>
        <a href="/user-dashboard/choose-payment" class="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors duration-300">
          <DollarSign class="h-4 w-4 mr-2" />
          Payment
        </a>
        <a href="/user-dashboard/payout" class="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors duration-300">
          <Wallet class="h-4 w-4 mr-2" />
          WithDraw
        </a>
      </div>
    </div>

    <Transaction />

    <!-- Conditionally render the Chat component -->
    
  {:else}
    <div class="bg-white shadow rounded-lg p-6">
      <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
    </div>
  {/if}
</div>

<Chat />