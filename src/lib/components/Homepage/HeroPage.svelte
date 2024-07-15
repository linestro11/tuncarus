<script lang="ts">
    import { user } from '$lib/stores';
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Logout from './Logout.svelte';
    import { goto } from '$app/navigation';
    import '../../../app.css';


    const navigateToLogin = () => {
        goto('/login');
    };

    const navigateToRegister = () => {
        goto('/register');
    };
</script>



<main class="flex-grow mt-36 mb-14">
    <div class="mb-0">
        <div class="mt-0 flex flex-col items-center justify-center p-4">
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight">
                Buy and Sell Giftcards <br> Anywhere Around <span class="text-green-500">Nigeria</span> at the best price instantly.
            </h1>
            <div class="mt-8 flex space-x-4">
                <button on:click={navigateToRegister} class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition duration-300">
                    Get Started
                </button>
                <button on:click={navigateToLogin} class="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-900 transition duration-300">
                    Sign In
                </button>
            </div>
            <div class="mt-12">
                <img src="/hero.png" alt="Phone showing app" class="w-100 md:w-100 lg:w-100">
            </div>
        </div>
    </div>
</main>



<style>
    @media (max-width: 768px) {
        body {
            overflow-y: auto !important;
        }
    }
</style>

