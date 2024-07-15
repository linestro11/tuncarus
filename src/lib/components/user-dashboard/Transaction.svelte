<!-- src/routes/transactions.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { collection, getDocs, query, orderBy } from 'firebase/firestore';
    import { db } from '$lib/firebase';

    let transactions: any[] = [];

    onMount(async () => {
        const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        transactions = querySnapshot.docs.map(doc => doc.data());
    });
</script>

<div class="overflow-x-auto mr-3 ml-3"><br>
    <h2 class="text-xl font-semibold mb-4">Recent Transactions</h2>
    <table class="w-full min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Type
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                </th>
            </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            {#each transactions as transaction}
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.date.seconds * 1000).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.amount / 100}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.status}</td>
            </tr>
            {/each}
        </tbody>
    </table>
</div>
