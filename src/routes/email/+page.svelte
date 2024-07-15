<script lang="ts">
  import { writable } from 'svelte/store';
  import { sendVerificationEmail } from '$lib/sendVerificationEmail';

  const popupMessage = writable<string | null>(null);
  const isLoading = writable<boolean>(false);

  function closePopup() {
    popupMessage.set(null);
  }

  async function handleResendEmail() {
    isLoading.set(true);
    await sendVerificationEmail((message) => popupMessage.set(message));
    isLoading.set(false);
  }
</script>

<div class="flex h-screen justify-center items-center mx-5">
  <div class="max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md py-10 px-6">
    <h1 class="text-gray-800 text-3xl font-bold mb-4 text-center">Check your email</h1>
    <p class="text-gray-600 mb-4 text-center">We've sent a verification email to your email address. Please check your email and verify your account.</p>
    <a href="/login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center mb-4">Go to login</a>
    <!-- Your component content -->
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center"
      on:click={handleResendEmail}
      disabled={$isLoading}
    >
      {#if $isLoading}
        <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 0 6.477 0 14h4zm2 5.291A7.962 7.962 0 014 16H0c0 2.21.895 4.21 2.344 5.656l1.656-1.365z"></path>
        </svg>
        Sending...
      {:else}
        Resend Verification Email
      {/if}
    </button>
  </div>
</div>

{#if $popupMessage}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full mx-5">
      <p class="text-gray-800 text-center mb-4">{$popupMessage}</p>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" on:click={closePopup}>Close</button>
    </div>
  </div>
{/if}
