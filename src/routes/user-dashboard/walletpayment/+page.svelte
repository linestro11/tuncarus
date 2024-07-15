<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getUserContext } from "$lib/stores";
  import { cardStore } from "$lib/cardStore";
  import { db } from '$lib/firebase';
  import { doc, updateDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  const { user } = getUserContext();

  let cardDetails = {
    category: '',
    amount: 0,
    quantity: 1,
    unitPrice: 0
  };
  let email = '';
  let error = '';
  let success = '';
  let showModal = false;
  let isLoading = false;
  let walletLoaded = false;
  let walletAmount: number | string = 0;
  let unsubscribeCard: () => void;
  let unsubscribeUser: () => void;
  let unsubscribeWallet: () => void;
  let isEditing = false; // New variable to track edit mode

  function getWalletAmount(wallet: number | string): number {
    return typeof wallet === 'string' ? parseFloat(wallet) || 0 : wallet;
  }

  onMount(() => {
    unsubscribeCard = cardStore.subscribe(value => {
      cardDetails = { 
        ...value, 
        unitPrice: value.amount / value.quantity,
        quantity: value.quantity || 1
      };
      updateTotal();
    });

    unsubscribeUser = user.subscribe(($user) => {
      if ($user?.email) {
        email = $user.email;
        const docRef = doc(db, 'wallets', $user.email);

        unsubscribeWallet = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            walletAmount = getWalletAmount(docSnap.data().amount);
            walletLoaded = true;
          } else {
            console.warn('No wallet found for:', $user.email);
            walletLoaded = true;
          }
        });
      }
    });
  });

  onDestroy(() => {
    if (unsubscribeCard) unsubscribeCard();
    if (unsubscribeUser) unsubscribeUser();
    if (unsubscribeWallet) unsubscribeWallet();
  });

  function updateTotal() {
    cardDetails.amount = cardDetails.quantity * cardDetails.unitPrice;
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    error = '';
    success = '';
    isLoading = true;

    if (getWalletAmount(walletAmount) < cardDetails.amount) {
      error = 'Insufficient balance';
      isLoading = false;
      return;
    }

    try {
      const newBalance = getWalletAmount(walletAmount) - cardDetails.amount;
      await updateDoc(doc(db, 'wallets', email), {
        amount: newBalance
      });

      cardStore.setDetails(cardDetails);

      await addDoc(collection(db, 'transactions'), {
        email,
        category: cardDetails.category,
        unitPrice: cardDetails.unitPrice,
        quantity: cardDetails.quantity,
        totalAmount: cardDetails.amount,
        timestamp: new Date()
      });

      success = 'Payment sent. You will receive your gift card in a few minutes.';
      showModal = true;
      isLoading = false;

      cardDetails = {
        category: '',
        amount: 0,
        quantity: 1,
        unitPrice: 0
      };
      email = '';

      setTimeout(() => {
        goto('/user-dashboard');
      }, 3000);

    } catch (err) {
      if (err instanceof Error) {
        error = `An error occurred during payment: ${err.message}`;
      } else {
        error = 'An unknown error occurred during payment';
      }
      console.error(err);
      isLoading = false;
    }
  }

  function toggleEdit() {
    isEditing = !isEditing;
  }
</script>

<div class="flex h-screen justify-center items-center mx-5">
<div class="max-w-md w-full bg-white rounded-lg border border-gray-200 shadow-md py-10 px-6">
  <h2 class="text-2xl font-bold mb-4">Wallet Payment</h2>
  {#if !walletLoaded}
    <p>Loading wallet balance...</p>
  {:else}
    <form on:submit={handleSubmit}>
      <div class="mb-4 relative">
        <label for="walletBalance" class="block text-sm font-medium text-gray-700">Wallet Balance</label>
        <div class="mt-1 flex items-center">
          <span class="inline-block px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">₦</span>
          <input type="text" id="walletBalance" value={walletAmount} readonly class="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>  
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" bind:value={email} required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div class="mb-4">
        <label for="category" class="block text-sm font-medium text-gray-700">Card Category</label>
        <input type="text" id="category" bind:value={cardDetails.category} readonly={!isEditing} class="mt-1 block w-full px-3 py-2 {isEditing ? 'bg-white' : 'bg-gray-100'} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div class="mb-4">
        <label for="unitPrice" class="block text-sm font-medium text-gray-700">Unit Price</label>
        <input type="number" id="unitPrice" bind:value={cardDetails.unitPrice} on:input={updateTotal} readonly={!isEditing} class="mt-1 block w-full px-3 py-2 {isEditing ? 'bg-white' : 'bg-gray-100'} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div class="mb-4">
        <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
        <input 
          type="number" 
          id="quantity" 
          bind:value={cardDetails.quantity} 
          on:input={updateTotal} 
          min="1" 
          step="1"
          required
          readonly={!isEditing}
          class="mt-1 block w-full px-3 py-2 {isEditing ? 'bg-white' : 'bg-gray-100'} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
        />
      </div>
      <div class="mb-4">
        <label for="totalAmount" class="block text-sm font-medium text-gray-700">Total Amount</label>
        <input type="number" id="totalAmount" bind:value={cardDetails.amount} readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div class="flex justify-between mb-4">
        <button
          type="button"
          on:click={toggleEdit}
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isEditing ? 'Done Editing' : 'Edit'}
        </button>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={getWalletAmount(walletAmount) < cardDetails.amount || isLoading || isEditing}
        >
          {#if isLoading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20c2.485 0 4.713-.894 6.469-2.375l-3-5.196A8.018 8.018 0 0112 20zm8-8c0-3.042-1.135-5.824-3-7.938l-3 2.647A7.962 7.962 0 0112 4v4c2.485 0 4.713.894 6.469 2.375zM6.531 6.375A7.978 7.978 0 014 12h4c0-2.485.894-4.713 2.375-6.469l-3-5.196z"></path>
            </svg>
            Processing...
          {:else}
            Pay
          {/if}
        </button>
      </div>
      {#if error}
        <p class="text-red-500 mt-2">{error}</p>
      {/if}
      {#if success}
        <p class="text-green-500 mt-2">{success}</p>
      {/if}
    </form>
  {/if}
</div>

<!-- Modal -->
{#if showModal}
  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Payment Successful
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Your payment was processed successfully. You will receive your gift card in a few minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button on:click={() => showModal = false} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
</div>