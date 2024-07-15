<!--$lib/components/VerifyEmailPrompt.svelte-->
<script lang="ts">
    import { auth } from '$lib/firebase';
    import { sendEmailVerification } from 'firebase/auth';

    let message = '';

    async function resendVerificationEmail() {
        try {
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                message = 'Verification email sent. Please check your inbox.';
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            message = 'Error sending verification email. Please try again later.';
        }
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="p-8 bg-white shadow-md rounded-lg">
        <h2 class="text-2xl font-bold mb-4">Email Verification Required</h2>
        <p class="mb-4">Please verify your email address to access the dashboard.</p>
        <button
            on:click={resendVerificationEmail}
            class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
            Resend Verification Email
        </button>
        {#if message}
            <p class="mt-4 text-sm text-gray-600">{message}</p>
        {/if}
    </div>
</div>