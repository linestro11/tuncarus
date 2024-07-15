<script lang="ts">
  import { onMount } from 'svelte';
  import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db } from '$lib/firebase';
  import { goto } from '$app/navigation';
  import { cardStore } from '$lib/cardStore';

  let category = '';
  let cardName = '';
  let amount: number;
  let quantity: number;
  let userEmail = '';
  let file: File;
  let isLoading = false;
  let showSuccessModal = false;
  let giftcards: any[] = [];

  const storage = getStorage();

  onMount(() => {
      const q = query(collection(db, 'giftcards'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
          giftcards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });

      return () => unsubscribe();
  });

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

  function navigateToPaystack(giftcard: any) {
      // Store the selected card details in the cardStore
      cardStore.setDetails({
          category: giftcard.category,
          amount: giftcard.amount,
          quantity: 1  // Default to 1, can be adjusted later if needed
      });
      goto('/user-dashboard/choose-payment');
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-white">
  <div class="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-white">
      <h5 class="text-xl font-medium text-gray-900 mb-6">Available Gift Cards</h5>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {#each giftcards as giftcard}
              <div class="p-4 bg-white border border-gray-200 shadow rounded-lg">
                  <img src={giftcard.imageUrl} alt="Gift Card Image" class="w-full h-32 object-cover rounded-lg mb-4" />
                  <h6 class="text-lg font-medium text-black  mb-2">{giftcard.category}</h6>
                  <p class="text-sm text-black mb-2">price: ₦{giftcard.amount}</p>
                  <p class="text-sm text-black mb-2">Quantity: {giftcard.quantity}</p>
                  <button on:click={() => navigateToPaystack(giftcard)} class="w-20 mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      {#if isLoading}
                          <svg class="animate-spin h-5 w-5 mr-3 bg-white rounded-full" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path d="M4 12a8 8 0 018-8" fill="currentColor"></path>
                          </svg>
                          Loading...
                      {:else}
                          Buy
                      {/if}
                  </button>
              </div>
          {/each}
      </div>
  </div>
</div>

{#if showSuccessModal}
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                              Success!
                          </h3>
                          <div class="mt-2">
                              <p class="text-sm text-gray-500">
                                  Your gift card has been successfully added.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" on:click={closeSuccessModal} class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                      Close
                  </button>
              </div>
          </div>
      </div>
  </div>
{/if}