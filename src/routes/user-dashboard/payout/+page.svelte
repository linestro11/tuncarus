<script lang="ts">
	import { getUserContext } from '$lib/stores';
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    const { user, username, loading } = getUserContext();

    let accountName = '';
    let accountNumber = '';
    let bankCode = '';
    let amount = 0;
    let reason = '';
    let isLoading = false;

    const dispatch = createEventDispatcher();

    async function handleSubmit(event: Event) {
        event.preventDefault();
        isLoading = true;

        const recipientData = {
            name: accountName,
            account_number: accountNumber,
            bank_code: bankCode
        };

        // Create transfer recipient
        const recipientResponse = await fetch('/api/initiate-transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipientData)
        });

        if (recipientResponse.ok) {
            const recipientResult = await recipientResponse.json();
            const recipientCode = recipientResult.data.recipient_code;

            // Initiate transfer
            const transferData = {
                amount,
                recipient_code: recipientCode,
                reason
            };

            const transferResponse = await fetch('/api/initiate-transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transferData)
            });

            isLoading = false;

            if (transferResponse.ok) {
                const transferResult = await transferResponse.json();
                dispatch('transferSuccess', transferResult.data);
            } else {
                console.error('Failed to initiate transfer');
            }
        } else {
            console.error('Failed to create transfer recipient');
        }

        isLoading = false;
    }
</script>

<main class="flex items-center justify-center min-h-screen bg-gray-100">
    <form on:submit={handleSubmit} class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 class="text-2xl font-semibold text-gray-900 mb-4">Payout</h1>
        <div class="mb-4">
            <label for="accountName" class="block text-gray-700 font-bold mb-2">Account Name:</label>
            <input type="text" id="accountName" name="accountName" bind:value={accountName} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="mb-4">
            <label for="accountNumber" class="block text-gray-700 font-bold mb-2">Account Number:</label>
            <input type="text" id="accountNumber" name="accountNumber" bind:value={accountNumber} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="mb-4">
            <label for="bankCode" class="block text-gray-700 font-bold mb-2">Bank Code:</label>
            <input type="text" id="bankCode" name="bankCode" bind:value={bankCode} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="mb-4">
            <label for="amount" class="block text-gray-700 font-bold mb-2">Amount:</label>
            <input type="number" id="amount" name="amount" bind:value={amount} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="mb-4">
            <label for="reason" class="block text-gray-700 font-bold mb-2">Reason:</label>
            <input type="text" id="reason" name="reason" bind:value={reason} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center">
            {#if isLoading}
                <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            {/if}
            {isLoading ? 'Processing...' : 'Submit'}
        </button>
    </form>
</main>
