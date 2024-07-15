<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { collection, query, where, onSnapshot } from 'firebase/firestore';
    import { db } from '$lib/firebase';

    interface UserData {
        id: string;
        username: string;
        email: string;
        amount: number;
    }

    let users: UserData[] = [];
    let unsubscribe: () => void;

    onMount(() => {
        const usersRef = collection(db, 'profiles');
        const walletsRef = collection(db, 'wallets');

        // Query to fetch only users with verified emails
        const usersQuery = query(usersRef, where('emailVerified', '==', true));

        unsubscribe = onSnapshot(usersQuery, (usersSnapshot) => {
            const updatedUsers: UserData[] = [];

            usersSnapshot.forEach((userDoc) => {
                const userData = userDoc.data();
                if (userData.username !== 'eric' && userData.email !== 'ericosas129@gmail.com') {
                    updatedUsers.push({
                        id: userDoc.id,
                        username: userData.username || 'N/A',
                        email: userData.email,
                        amount: 0, // Initialize amount, will be updated from wallets
                    });
                }
            });

            // Update wallet amounts
            onSnapshot(query(walletsRef), (walletsSnapshot) => {
                walletsSnapshot.forEach((walletDoc) => {
                    const walletData = walletDoc.data();
                    const userIndex = updatedUsers.findIndex(user => user.email === walletDoc.id);
                    if (userIndex !== -1) {
                        updatedUsers[userIndex].amount = walletData.amount || 0;
                    }
                });
                users = updatedUsers;
            });
        });
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });
</script>
<div class="admin-dashboard m-5">
    <h2 class="text-xl font-bold mb-4">View User Wallet</h2>
    <div class="overflow-x-auto">
        <table class="w-full min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100">
                        Username
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100">
                        Email
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-100">
                        Wallet Amount
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {#each users as user (user.id)}
                    <tr class="even:bg-gray-50 hover:bg-gray-100">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{user.username}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">{user.email}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">${user.amount.toFixed(2)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style scoped>
    .admin-dashboard {
        margin: 20px;
    }
</style>
