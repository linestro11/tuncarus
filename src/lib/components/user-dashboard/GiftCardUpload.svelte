<script lang="ts">
    import { addDoc, collection } from 'firebase/firestore';
    import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
    import { db } from '$lib/firebase';
    import { Gift } from 'lucide-svelte';
	import { getUserContext } from '$lib/stores';
    const { user } = getUserContext();
    export let userId: string;

    let category = '';
    let amount = '';
    let userEmail = '';
    let file: File | null = null;
    let quantity = 1;
    let isLoading = false;
    let showSuccessModal = false;

    const categories = [
        { name: 'Binance (USDT) Ng', image: '/images/binance.png' },
        { name: 'Crypto Voucher', image: '/images/crypto_voucher.png' },
        { name: 'Jawaker Ng', image: '/images/jawaker.png' },
        { name: 'MoLek-Syntez ng', image: '/images/molek_syntez.png' },
        { name: 'Obucks ng', image: '/images/obucks.png' },
        { name: 'Redcoin voucher', image: '/images/redcoin.png' },
        { name: 'Riot acess Latam America Ng', image: '/images/riot_access.png' },
        { name: 'SHENZHEN', image: '/images/shenzhen.png' },
        { name: 'Razer Gold Global', image: '/images/razer_gold.png' }
    ];

    async function handleSubmit() {
        try {
            if (!file) {
                throw new Error('Please select a file to upload');
            }
            
            isLoading = true;

            const storage = getStorage();
            const storageRef = ref(storage, `giftcards/${userId}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            const docRef = await addDoc(collection(db, 'giftcard_requests'), {
                category,
                amount: parseFloat(amount),
                userEmail,
                quantity: parseInt(quantity),
                status: 'pending',
                createdAt: new Date(),
                fileURL: downloadURL,
                userId: userId
            });

            showSuccessModal = true;
            resetForm();
        } catch (error) {
            console.error('Failed to submit request:', error);
            alert('Failed to submit request: ' + error.message);
        } finally {
            isLoading = false;
        }
    }

    function resetForm() {
        category = '';
        amount = '';
        userEmail = '';
        file = null;
        quantity = 1;
    }

    function closeSuccessModal() {
        showSuccessModal = false;
    }
</script>
{#if $user}
<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
            <h5 class="text-xl font-medium text-gray-900 dark:text-white">Request Gift Card</h5>
            <div>
                <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <select id="category" bind:value={category} required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                    <option value="">Select a category</option>
                    {#each categories as cat}
                        <option value={cat.name}>{cat.name}</option>
                    {/each}
                </select>
            </div>
            <div>
                <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
                <input type="number" id="amount" bind:value={amount} required min="1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
            </div>
            <div>
                <label for="quantity" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number of Gift Cards</label>
                <input type="number" id="quantity" bind:value={quantity} required min="1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
            </div>
            <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                <input type="email" id="email" bind:value={userEmail} required class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
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
{:else}
<div class="bg-white shadow rounded-lg p-6">
  <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
</div>
{/if}

{#if showSuccessModal}
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-hidden h-full w-full flex items-center justify-center">
        <div class="bg-white p-4 sm:p-8 rounded-xl shadow-2xl max-w-xs sm:max-w-lg w-full mx-4">
            <h2 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center">
                <Gift class="mr-2 text-blue-500" /> Gift Card Request Sent
            </h2>
            <p class="text-gray-700 mb-4 sm:mb-4">Your gift card request has been submitted successfully.</p>
            <button class="mt-4 sm:mt-8 bg-blue-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-blue-600 transition duration-300 w-full text-base sm:text-lg font-semibold" on:click={closeSuccessModal}>Close</button>
        </div>
    </div>
{/if}