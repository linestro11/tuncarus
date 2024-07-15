<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { collection, query, onSnapshot, type Unsubscribe } from 'firebase/firestore';
    import { db } from '$lib/firebase';
  
    let bankAccounts: string | any[] = [];
    let unsubscribe: Unsubscribe;
  
    onMount(() => {
      const q = query(collection(db, 'bankAccounts'));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        bankAccounts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      });
    });
  
    onDestroy(() => {
      if (unsubscribe) unsubscribe();
    });
  </script>
  
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Bank Account Details</h2>
    {#if bankAccounts.length === 0}
      <p class="text-gray-600">No bank accounts found.</p>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each bankAccounts as account}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.fullName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.accountNumber}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.bankType}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.accountName}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>