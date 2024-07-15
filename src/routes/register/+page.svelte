<script lang="ts">
  import { auth, db } from '$lib/firebase';
  import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { Eye, EyeOff } from "lucide-svelte";

  let email = '';
  let password = '';
  let confirmPassword = '';
  let username = '';
  let phoneNumber = '';
  let error: string | null = null;
  let message: string | null = null;
  let loading = false;
  let showModal = writable(false);

  let emailValid = false;
  let passwordValid = true;
  let confirmPasswordValid = true;
  let usernameValid = false;
  let phoneNumberValid = false;
  let showPassword = false

  $: formValid = emailValid && passwordValid && confirmPasswordValid && usernameValid && phoneNumberValid;

  function validateEmail(value: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    emailValid = emailRegex.test(value);
  }

  function validatePassword(value: string) {
    passwordValid = value.length >= 8;
  }

  function validateConfirmPassword(value: string) {
    confirmPasswordValid = value === password;
  }

  function validateUsername(value: string) {
    usernameValid = value.length >= 3 && value.length <= 20;
  }


  function validatePhoneNumber(value: string) {
    // Remove the +234 prefix before validating
    const phoneRegex = /^\d{10,14}$/;
    phoneNumberValid = phoneRegex.test(value.replace("+234", ""));
  }

  async function handleRegister() {
    if (!formValid) return;
    loading = true;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username });
        await sendEmailVerification(user);

        await setDoc(doc(db, 'profiles', user.uid), {
            username,
            phoneNumber,
            email,
            emailVerified: false
        });

        error = null; // Set the justRegistered flag
        goto('/email')

    } catch (err: any) {
        if (auth.currentUser) {
            await auth.currentUser.delete();
        }
        error = err.message;
        message = null;
    } finally {
        loading = false;
    }


}

function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>


<div class="w-full max-w-sm p-4 bg-white border border-gray-200 shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-4">
    <form class="space-y-6" on:submit|preventDefault={handleRegister} autocomplete="off">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">Register</h5>
      
      <!-- Username Field -->
      <div>
        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          bind:value={username}
          on:input={() => validateUsername(username)}
          autocomplete="username"
          required
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
        {#if !usernameValid && username}
          <span class="text-red-600 text-xs">Username must be between 3 and 20 characters</span>
        {/if}
      </div>
  
      <!-- Email Field -->
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          bind:value={email}
          on:input={() => validateEmail(email)}
          autocomplete="email"
          required
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
        {#if !emailValid && email}
          <span class="text-red-600 text-xs">Please enter a valid email address</span>
        {/if}
      </div>
  
      <!-- Phone Number Field -->
      <div>
        <label for="phoneNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
        <div class="flex items-center">
          <span class="inline-block px-3 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg dark:bg-gray-600 dark:border-gray-500 text-gray-900 dark:text-white">+234</span>
          <input
            type="tel"
            id="phoneNumber"
            name="tel"
            bind:value={phoneNumber}
            on:input={() => validatePhoneNumber(phoneNumber)}
            autocomplete="tel"
            required
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            style="border-left-width: 0;"
          />
        </div>
        {#if !phoneNumberValid && phoneNumber}
          <span class="text-red-600 text-xs">Please enter a valid phone number</span>
        {/if}
      </div>
  
      <!-- Password and Confirm Password Field -->
      <div>
        <label for="new-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
        <div class="relative">
          {#if showPassword}
            <input
              type="text"
              id="new-password"
              name="new-password"
              bind:value={password}
              on:input={() => validatePassword(password)}
              autocomplete="new-password"
              required
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          {:else}
            <input
              type="password"
              id="new-password"
              name="new-password"
              bind:value={password}
              on:input={() => validatePassword(password)}
              autocomplete="new-password"
              required
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          {/if}
          <button type="button" on:click={togglePasswordVisibility} class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
            {#if showPassword}
              <EyeOff class="h-5 w-5 text-gray-500" />
            {:else}
              <Eye class="h-5 w-5 text-gray-500" />
            {/if}
          </button>
        </div>
        {#if !passwordValid && password}
          <span class="text-red-600 text-xs">Password must be at least 8 characters long</span>
        {/if}
      </div>
  
      <!-- Confirm Password Field -->
      <div>
        <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
        <div class="relative">
          {#if showPassword}
            <input
              type="text"
              id="confirm-password"
              name="confirm-password"
              bind:value={confirmPassword}
              on:input={() => validateConfirmPassword(confirmPassword)}
              autocomplete="new-password"
              required
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          {:else}
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              bind:value={confirmPassword}
              on:input={() => validateConfirmPassword(confirmPassword)}
              autocomplete="new-password"
              required
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          {/if}
        </div>
        {#if !confirmPasswordValid && confirmPassword}
          <span class="text-red-600 text-xs">Passwords do not match</span>
        {/if}
      </div>
  
      <!-- Submit Button -->
      <button type="submit" disabled={!formValid || loading} class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        {#if loading}
          <svg class="inline mr-2 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 0 6.477 0 14h4zm2 5.291A7.962 7.962 0 014 16H0c0 2.21.895 4.21 2.344 5.656l1.656-1.365z"></path>
          </svg>
          Loading...
        {:else}
          Register
        {/if}
      </button>
    </form>
  
    <!-- Login Link -->
    <div class="text-sm mt-3 font-medium text-gray-500 dark:text-gray-300">
      Already registered? <a href="/login" class="text-blue-700 hover:underline dark:text-blue-500">Login</a>
      <div class="text-sm font-medium mt-4 text-gray-500 dark:text-gray-300 text-center">
        <a href="/" class="text-blue-700 hover:underline dark:text-blue-500">Go to Home</a>
      </div>
    </div>
   
  
    <!-- Error and Message Display -->
    {#if error}
      <p class="text-red-600 text-sm mt-2">{error}</p>
    {/if}
    {#if message}
      <p class="text-green-600 text-sm mt-2">{message}</p>
    {/if}
  
    <!-- Modal -->
    {#if $showModal}
      <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-4 rounded-lg shadow-lg w-1/3 text-center">
          <p>{message}</p>
        </div>
      </div>
    {/if}
  </div>