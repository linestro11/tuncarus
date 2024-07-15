<!-- src/routes/login/+page.svelte -->
<script lang="ts">
    import { auth } from '$lib/firebase';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { user } from '$lib/stores';
    import { Eye, EyeOff } from "lucide-svelte";
  
    let email = '';
    let password = '';
    let error = '';
    let loading = false;
    let emailValid = false;
    let passwordValid = false;
    let formValid = false;
    const specialUserEmail = 'ericosas129@gmail.com';
  
    $: formValid = emailValid && passwordValid;
  
    function validateEmail(value: string) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        emailValid = emailRegex.test(value);
    }
  
    function validatePassword(value: string) {
        passwordValid = value.length >= 8;
    }
  
    async function handleLogin() {
        if (!formValid) return;
        loading = true;
        error = '';
  
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = userCredential.user;
  
            // Update the user store
            user.set(loggedInUser);
  
            // Redirect to the appropriate dashboard after successful login
            if (email === specialUserEmail) {
                goto('/admin-dashboard');
            } else {
                goto('/user-dashboard');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            error = err.message;
        } finally {
            loading = false;
        }
    }
  
    let showPassword = false;
  
    function togglePasswordVisibility() {
        showPassword = !showPassword;
    }
  </script>
  
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-sm p-4 bg-white border border-gray-200 shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form class="space-y-6" on:submit|preventDefault={handleLogin} autocomplete="off">
            <h5 class="text-xl font-medium text-gray-900 dark:text-white">Login</h5>
            <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    bind:value={email}
                    on:input={() => validateEmail(email)}
                    required
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
                {#if !emailValid && email}
                    <span class="text-red-600 text-xs">Please enter a valid email address</span>
                {/if}
            </div>
            <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                <div class="relative">
                    {#if showPassword}
                        <input
                            type="text"
                            id="password"
                            name="password"
                            bind:value={password}
                            on:input={() => validatePassword(password)}
                            required
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                    {:else}
                        <input
                            type="password"
                            id="password"
                            name="password"
                            bind:value={password}
                            on:input={() => validatePassword(password)}
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
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input id="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                    <label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                </div>
                <a href="/forget-password" class="text-sm text-blue-700 hover:underline dark:text-blue-500">Forgot Password?</a>
            </div>
            <button type="submit" disabled={!formValid || loading} class="w-full mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {#if loading}
                    <svg class="inline mr-2 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.477 0 0 6.477 0 14h4zm2 5.291A7.962 7.962 0 014 16H0c0 2.21.895 4.21 2.344 5.656l1.656-1.365z"></path>
                    </svg>
                    Loading...
                {:else}
                    Login
                {/if}
            </button>
        </form>
        <div class="text-sm font-medium mt-4 text-gray-500 dark:text-gray-300 text-center">
            Not registered? <a href="/register" class="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
        </div>
        {#if error}
            <p class="mt-2 text-sm text-red-600 text-center">{error}</p>
        {/if}
        <div class="text-sm font-medium mt-4 text-gray-500 dark:text-gray-300 text-center">
            <a href="/" class="text-blue-700 hover:underline dark:text-blue-500">Go to Home</a>
          </div>
    </div>
  </div>
  
  <style>
    .error {
        color: red;
        font-size: 0.8rem;
    }
  </style>
  