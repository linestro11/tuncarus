<script lang="ts">
    import { writable } from 'svelte/store';
    import { doc, setDoc } from 'firebase/firestore';
    import { db } from '$lib/firebase';

    let fullName = '';
    let accountNumber = '';
    let bankType = '';
    let accountName = '';
    let showPopup = writable(false);
    let errorMessage = writable('');

    async function submitForm() {
        const fullNameValue = fullName.trim();
        const accountNumberValue = accountNumber.trim();
        const bankTypeValue = bankType.trim();
        const accountNameValue = accountName.trim();

        errorMessage.set('');

        if (!fullNameValue) {
            errorMessage.set('Full Name is required');
            return;
        }

        if (!accountNumberValue) {
            errorMessage.set('Account Number is required');
            return;
        }

        if (!bankTypeValue) {
            errorMessage.set('Bank Type is required');
            return;
        }

        if (!accountNameValue) {
            errorMessage.set('Account Name is required');
            return;
        }

        try {
            await setDoc(doc(db, 'bankAccounts', accountNumberValue), {
                fullName: fullNameValue,
                accountNumber: Number(accountNumberValue),
                bankType: bankTypeValue,
                accountName: accountNameValue,
                timestamp: new Date()
            });

            console.log(`Bank account details submitted successfully for account number: ${accountNumberValue}`);

            showPopup.set(true);
            fullName = '';
            accountNumber = '';
            bankType = '';
            accountName = '';

            setTimeout(() => {
                showPopup.set(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting bank account details:', error);
            errorMessage.set('Failed to submit bank account details. Please try again.');
        }
    }
</script>

<div class="admin-dashboard mx-auto p-4 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4 text-center text-gray-900">Admin Bank Accounts</h2>

    <form on:submit|preventDefault={submitForm} class="space-y-6">
        <div>
            <label for="fullName" class="block mb-2 text-sm font-medium text-gray-900">Full Name</label>
            <input type="text" id="fullName" bind:value={fullName} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" required />
        </div>

        <div>
            <label for="accountNumber" class="block mb-2 text-sm font-medium text-gray-900">Account Number</label>
            <input type="text" id="accountNumber" bind:value={accountNumber} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="1234567890" required />
        </div>

        <div>
            <label for="bankType" class="block mb-2 text-sm font-medium text-gray-900">Bank Type</label>
            <input type="text" id="bankType" bind:value={bankType} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Savings" required />
        </div>

        <div>
            <label for="accountName" class="block mb-2 text-sm font-medium text-gray-900">Account Name</label>
            <input type="text" id="accountName" bind:value={accountName} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" required />
        </div>

        <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Submit</button>

        {#if $errorMessage}
            <div class="text-red-500 mt-4 text-center">{$errorMessage}</div>
        {/if}

        {#if $showPopup}
            <div class="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded shadow-lg z-10">
                Bank account details submitted successfully!
            </div>
        {/if}
    </form>
</div>

<style scoped>
    .admin-dashboard {
        margin: 20px;
        padding: 20px;
        max-width: 400px;
        background-color: #ffffff;
        border-radius: 0.75rem; /* 12px */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .admin-dashboard h2 {
        font-size: 1.5rem; /* 24px */
        margin-bottom: 1rem; /* 16px */
        text-align: center;
        color: #1a202c; /* gray-900 */
    }

    .admin-dashboard form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem; /* 24px */
    }

    .admin-dashboard label {
        font-size: 0.875rem; /* 14px */
        margin-bottom: 0.5rem; /* 8px */
        font-weight: 500;
        color: #1a202c; /* gray-900 */
    }

    .admin-dashboard input {
        background-color: #f7fafc; /* gray-50 */
        border: 1px solid #e2e8f0; /* gray-300 */
        color: #1a202c; /* gray-900 */
        font-size: 0.875rem; /* 14px */
        border-radius: 0.5rem; /* 8px */
        padding: 0.625rem; /* 10px */
        width: 100%;
        transition: border-color 0.2s ease-in-out;
    }

    .admin-dashboard input:focus {
        border-color: #3182ce; /* blue-500 */
        outline: none;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); /* blue-300 */
    }

    .admin-dashboard button {
        background-color: #3182ce; /* blue-700 */
        color: #ffffff;
        padding: 0.625rem; /* 10px */
        border-radius: 0.5rem; /* 8px */
        font-size: 0.875rem; /* 14px */
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }

    .admin-dashboard button:hover {
        background-color: #2b6cb0; /* blue-800 */
    }

    .admin-dashboard button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); /* blue-300 */
    }

    .admin-dashboard .error {
        color: #e53e3e; /* red-500 */
        font-size: 0.875rem; /* 14px */
        text-align: center;
        margin-top: 1rem; /* 16px */
    }

    .admin-dashboard .success-popup {
        position: fixed;
        bottom: 1.25rem; /* 20px */
        left: 50%;
        transform: translateX(-50%);
        background-color: #48bb78; /* green-500 */
        color: #ffffff;
        padding: 0.75rem 1.25rem; /* 12px 20px */
        border-radius: 0.5rem; /* 8px */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }
</style>
