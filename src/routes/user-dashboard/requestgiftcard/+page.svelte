<script lang="ts">
    import { onMount } from 'svelte';
    import { auth, db, checkAndUpdateEmailVerification } from '$lib/firebase';
    import { doc, getDoc } from 'firebase/firestore';
    import { onAuthStateChanged, type User } from 'firebase/auth';
    import { page } from '$app/stores';
    import GiftCardUpload from '$lib/components/user-dashboard/GiftCardUpload.svelte'

    
    let user: User | null = null;
    let username: string | null = null;
    let loading = true;

    onMount(async () => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                user = currentUser;
                await checkAndUpdateEmailVerification(user);
                const docRef = doc(db, 'profiles', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    username = userData.username;
                } else {
                    console.error('No such document!');
                    username = 'User';
                }
            } else {
                user = null;
                username = null;
            }
            loading = false;
        });

        return unsubscribe;
    });
</script>

{#if loading}
<div class="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center h-64">
    <div class="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500"></div>
</div>
{:else if user}


    <GiftCardUpload userId={user.uid} />

{:else}
    <p>Please log in to access your dashboard.</p>
{/if}

<style>
    h1 {
        font-size: 2rem;
    }
    p {
        font-size: 1.2rem;
    }
    a {
        text-decoration: none;
        color: #0066cc;
        padding: 0.5rem 1rem;
        border: 1px solid #0066cc;
        border-radius: 4px;
    }
    a:hover {
        background-color: #0066cc;
        color: white;
    }
</style>
