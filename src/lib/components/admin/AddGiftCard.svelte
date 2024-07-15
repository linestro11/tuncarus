<script lang="ts">
    import { onMount } from 'svelte';
    import { getFirestore, collection, addDoc } from 'firebase/firestore';
    import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
    import { db,  } from '$lib/firebase';
    // Adjust the path to your Firebase initialization file
  
    let category = '';
    let cardName = '';
    let amount: number;
    let quantity: number;
    let userEmail = '';
    let file: File;
    let isLoading = false;
    let showSuccessModal = false;
  
    const storage = getStorage();
  
    async function handleSubmit() {
      isLoading = true;
      try {
        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `giftcards/${file.name}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
  
        // Add the gift card data to Firestore
        await addDoc(collection(db, 'giftcards'), {
          category,
          cardName,
          amount,
          quantity,
          userEmail,
          imageUrl,
          createdAt: new Date()
        });
  
        showSuccessModal = true;
      } catch (error) {
        console.error('Error adding document: ', error);
      } finally {
        isLoading = false;
      }
    }
  
    function closeSuccessModal() {
      showSuccessModal = false;
    }
</script>
  
<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
  <div class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
    <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">ADD GIFT CARD</h5>
      <div>
        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
        <input type="text" id="category" bind:value={category} required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
      </div>
      <div>
        <label for="cardName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name of Card</label>
        <input type="text" id="cardName" bind:value={cardName} required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
      </div>
      <div>
        <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">price</label>
        <input type="number" id="amount" bind:value={amount} required min="1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
      </div>
      <div>
        <label for="quantity" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">quantity</label>
        <input type="number" id="quantity" bind:value={quantity} required min="1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
      </div>
      <div>
        <label for="file" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gift Card Image</label>
        <input type="file" id="file" accept="image/*" on:change={(e) => file = e.target.files[0]} required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
      </div>
      <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        {#if isLoading}
          <svg class="animate-spin h-5 w-5 mr-3 bg-white rounded-full" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path d="M4 12a8 8 0 018-8" fill="currentColor"></path>
          </svg>
          Loading...
        {:else}
          Submit Request
        {/if}
      </button>
    </form>
  </div>
</div>
  
{#if showSuccessModal}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-hidden h-full w-full flex items-center justify-center">
    <div class="bg-white p-4 sm:p-8 rounded-xl shadow-2xl max-w-xs sm:max-w-lg w-full mx-4">
      <h2 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
        <svg class="mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Gift card submitted
      </h2>
      <p class="text-gray-700 mb-4 sm:mb-4">Gift card has been added to Available Gift Cards</p>
      <button class="mt-4 sm:mt-8 bg-blue-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-blue-600 transition duration-300 w-full text-base sm:text-lg font-semibold" on:click={closeSuccessModal}>Close</button>
    </div>
  </div>
{/if}