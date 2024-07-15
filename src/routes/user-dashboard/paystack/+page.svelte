<script lang="ts">
	import { getUserContext } from "$lib/stores";
    import Note from "$lib/components/admin/Note.svelte";

    const { user, username, loading } = getUserContext();

    let email = '';
    let amount = 0;
    let firstName = '';
    let lastName = '';
    let description = '';
    let isLoading = false;

    async function handleSubmit(event: Event) {
        event.preventDefault();
        isLoading = true;

        const formData = {
            email,
            amount,
            firstName,
            lastName,
            description
        };

        const response = await fetch('/api/pay-stack', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        isLoading = false;

        if (response.ok) {
            const result = await response.json();
            const output = result.data.authorization_url;
            window.location.href = output;
        } else {
            console.error('Failed to initialize transaction');
        }
    }
</script>

<Note 
  noteTitle="Important Note:" 
  noteText="Fill the form below for payment." 
  additionalText="fill in the details of the particular task you want to complete.
  e.g details of giftcard to payfor ,top up balance, etc."
/>

{#if $user  && !$loading}
<main class="flex items-center justify-center min-h-screen bg-gray-100">
    <form on:submit={handleSubmit} class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 class="text-2xl font-semibold text-gray-900 mb-4">Payment</h1>
        <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2">Email:</label>
            <input type="email" id="email" name="email" bind:value={email} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="mb-4">
            <label for="amount" class="block text-gray-700 font-bold mb-2">Amount:</label>
            <input type="number" id="amount" name="amount" bind:value={amount} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="mb-4">
            <label for="firstName" class="block text-gray-700 font-bold mb-2">First Name:</label>
            <input type="text" id="firstName" name="firstName" bind:value={firstName} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="mb-4">
            <label for="lastName" class="block text-gray-700 font-bold mb-2">Last Name:</label>
            <input type="text" id="lastName" name="lastName" bind:value={lastName} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2">Description:</label>
            <input type="text" id="description" name="description" bind:value={description} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g Top up Wallet, Gift Card payment, etc"/>
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
{:else}
<div class="bg-white shadow rounded-lg p-6">
  <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
</div>
{/if}
