<!-- src/routes/forget-password/+page.svelte -->
<script lang="ts">
    import { auth } from '$lib/firebase';
    import { sendPasswordResetEmail } from 'firebase/auth';
    import { onMount } from 'svelte';
    import { writable } from '$lib/stores';
  
    let email = '';
    const error = writable<string | null>(null);
    const message = writable<string | null>(null);
  
    const handlePasswordReset = async (event: Event) => {
      event.preventDefault();
      error.set(null);
      message.set(null);
  
      try {
        await sendPasswordResetEmail(auth, email);
        message.set('Password reset email sent. Please check your inbox.');
      } catch (err) {
        error.set(err.message);
      }
    };
  
    // Close the message modal after a delay
    const closeModal = () => {
      message.set(null);
    };
  
    // Automatically close the message modal after 5 seconds
    onMount(() => {
      const timeout = setTimeout(() => {
        closeModal();
      }, 5000); // 5000 milliseconds = 5 seconds
  
      return () => clearTimeout(timeout);
    });
  </script>
  
  <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-4">
    <form class="space-y-6" on:submit={handlePasswordReset} autocomplete="off">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Reset Password</h5>
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          required
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send Password Reset Email</button>
    </form>
  
    {#if $error}
      <p class="text-red-600 text-sm mt-2">{$error}</p>
    {/if}
  
    {#if $message}
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg">
          <p class="text-green-600 text-sm">{$message}</p>
          <button class="mt-4 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5" on:click={closeModal}>Close</button>
        </div>
      </div>
    {/if}
  </div>
