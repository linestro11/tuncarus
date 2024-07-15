<!-- src/lib/components/user-dashboard/ChoosePayment.svelte -->
<script lang="ts">
import { goto } from "$app/navigation";
import { getUserContext } from "$lib/stores";

const { user, username, loading } = getUserContext();
function navigateToWalletPayment() {
  goto('/user-dashboard/walletpayment');
}
</script>

{#if $user}
<div class="flex h-screen justify-center items-center mx-5">
    <div class="max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md py-10 px-6">
      <!-- Your component content -->
      <button on:click={navigateToWalletPayment} class=" mb-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center"
      >Pay with Wallet</button>
      <a href="/user-dashboard/paystack" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center">Pay with paystack</a>
    </div>

  </div>
  {/if}