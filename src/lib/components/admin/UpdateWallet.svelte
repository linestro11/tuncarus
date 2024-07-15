<script lang="ts">
    import { writable } from 'svelte/store';
    import { doc, setDoc } from 'firebase/firestore';
    import { db } from '$lib/firebase';

    let email = '';
    let amount = writable('');
    let showPopup = writable(false);
    let errorMessage = writable('');

    async function submitAmount() {
        const emailValue = email.trim();
        const amountValue = parseFloat($amount);

        errorMessage.set('');

        if (!emailValue) {
            errorMessage.set('Email is required');
            return;
        }

        if (!amountValue || isNaN(amountValue)) {
            errorMessage.set('Valid amount is required');
            return;
        }

        try {
            await setDoc(doc(db, 'wallets', emailValue), {
                amount: amountValue,
                timestamp: new Date()
            });

            console.log(`Amount ${amountValue} submitted successfully for email: ${emailValue}`);

            showPopup.set(true);
            email = '';
            amount.set('');

            setTimeout(() => {
                showPopup.set(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting amount:', error);
            errorMessage.set('Failed to submit amount. Please try again.');
        }
    }
</script>

<div class="admin-dashboard mx-auto p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
    <h2 class="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Update user wallet amount</h2>

    <form on:submit|preventDefault={submitAmount} class="space-y-6">
        <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Email</label>
            <input type="email" id="email" bind:value={email} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
        </div>

        <div>
            <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
            <input type="number" id="amount" bind:value={$amount} step="0.01" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
        </div>

        <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

        {#if $errorMessage}
            <div class="text-red-500 mt-4 text-center">{$errorMessage}</div>
        {/if}

        {#if $showPopup}
            <div class="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded shadow-lg z-10">
                Amount submitted successfully!
            </div>
        {/if}
    </form>
</div>

<style>
    @media (max-width: 640px) {
        .admin-dashboard {
            max-width: 100%;
            padding: 1rem;
        }
    }
</style>