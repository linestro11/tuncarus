<!-- src/lib/components/Logout.svelte -->
<script lang="ts">
    import { user } from '$lib/stores'; // Import the user store
    import { get } from 'svelte/store'; // Import get to get the current value of the store
    import { auth } from '$lib/firebase'; // Import your Firebase authentication instance
    import { signOut } from 'firebase/auth';
    import { goto } from '$app/navigation';

    const handleLogout = async () => {
        try {
            await signOut(auth);
            user.set(null); // Reset the user store to null
            goto('/login'); // Redirect to login page
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
</script>

<button on:click={handleLogout} class="bg-red-500 text-white py-2 px-4 rounded w-20">
    Logout
</button>
