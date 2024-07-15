<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from '$lib/firebase';
    import { collection, query, onSnapshot } from 'firebase/firestore';

    let transactions = [];

    onMount(() => {
        const q = query(collection(db, 'transactions'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            transactions = querySnapshot.docs.map(doc => doc.data());
        });

        return () => unsubscribe();
    });
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="container mx-auto py-10 px-4">
        <h2 class="text-2xl font-bold mb-4 text-center">Transactions</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr>
                        <th class="py-2 px-4 border-b">Email</th>
                        <th class="py-2 px-4 border-b">Category</th>
                        <th class="py-2 px-4 border-b">Unit Price</th>
                        <th class="py-2 px-4 border-b">Quantity</th>
                        <th class="py-2 px-4 border-b">Total Amount</th>
                        <th class="py-2 px-4 border-b">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {#each transactions as transaction}
                        <tr>
                            <td class="py-2 px-4 border-b">{transaction.email}</td>
                            <td class="py-2 px-4 border-b">{transaction.category}</td>
                            <td class="py-2 px-4 border-b">{transaction.unitPrice}</td>
                            <td class="py-2 px-4 border-b">{transaction.quantity}</td>
                            <td class="py-2 px-4 border-b">{transaction.totalAmount}</td>
                            <td class="py-2 px-4 border-b">{new Date(transaction.timestamp.seconds * 1000).toLocaleString()}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>