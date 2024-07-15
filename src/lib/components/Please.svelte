<script lang="ts">
import { goto } from "$app/navigation";

function navigateToLogin() {
    goto('/login');
}
</script>

<div class="bg-white shadow-md rounded-lg p-6 md:w-2/3 lg:w-1/2 mx-auto">
    <p class="text-xl text-gray-600 text-center">Please log in to access your dashboard.</p>
    <button on:click={navigateToLogin} class="mt-4 inline-flex items-center px-4 py-2 bg-blue-300 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-500 transition-colors duration-300">Go to Login</button>
</div>

