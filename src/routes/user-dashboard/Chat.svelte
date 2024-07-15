<script lang="ts">
    import { onMount } from 'svelte';
    import { getAuth } from 'firebase/auth';
    import { checkAndUpdateEmailVerification } from '$lib/firebase'; // Adjust the path as necessary
    import { loadTawkScript } from '$lib/tawk'; // Adjust the path as necessary
    import { goto } from '$app/navigation';

    onMount(async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const isVerified = await checkAndUpdateEmailVerification(user);
            if (isVerified) {
                loadTawkScript();
            } else {
                console.log('User email is not verified, redirected to email verification page');
                goto('/email');
            }
        } else {
            console.log('No authenticated user');
            goto('/login');
        }
    });
</script>

<main>
    <!-- Your component content -->
</main>
