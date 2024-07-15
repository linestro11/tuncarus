<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { db } from '$lib/firebase';
    import { doc, getDoc, updateDoc } from 'firebase/firestore';
    import { User, Phone, Mail, Edit2, Save } from 'lucide-svelte';
    
    let username = '';
    let phoneNumber = '';
    let email = '';
    let emailVerified = false;
    let uid: string | null = null;
    let isEditable = false;
    let isLoading = true;
    let error = '';
    
    onMount(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                uid = user.uid;
                fetchProfileData();
            } else {
                error = 'User not authenticated';
                goto('/login');
            }
        });
    });
    
    async function fetchProfileData() {
        isLoading = true;
        error = '';
        if (!uid) {
            error = 'User ID not available';
            isLoading = false;
            return;
        }
        try {
            const docRef = doc(db, 'profiles', uid);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const data = docSnap.data();
                username = data.username || '';
                phoneNumber = data.phoneNumber || '';
                email = data.email || '';
                emailVerified = data.emailVerified || false;
            } else {
                error = 'Profile not found';
            }
        } catch (err) {
            console.error('Error fetching profile data:', err);
            if (err.code === 'unavailable') {
                error = 'Unable to connect to the server. Please check your internet connection.';
            } else {
                error = 'Error fetching profile data. Please try again later.';
            }
        } finally {
            isLoading = false;
        }
    }
    
    
    async function updateProfile() {
        if (!uid) {
            error = 'User ID not available';
            return;
        }
        isLoading = true;
        error = '';
        try {
            const docRef = doc(db, 'profiles', uid);
            await updateDoc(docRef, { username, phoneNumber, email });
            isEditable = false;
        } catch (err) {
            console.error('Error updating profile:', err);
            if (err.code === 'unavailable') {
                error = 'Unable to connect to the server. Please check your internet connection.';
            } else {
                error = 'Error updating profile. Please try again later.';
            }
        } finally {
            isLoading = false;
        }
    }
    
    function toggleEdit() {
        isEditable = !isEditable;
    }
</script>

<div class="max-w-2xl mx-auto">
    {#if isLoading}
    <div class="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-green-500"></div>
    </div>
    {:else if error}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p class="font-bold">Error</p>
            <p>{error}</p>
        </div>
    {:else}
        <div class="bg-white shadow rounded-lg p-6 space-y-6">
            <h2 class="text-2xl font-semibold text-gray-800">User Profile</h2>
            <form on:submit|preventDefault={updateProfile} class="space-y-4">
                <div class="flex items-center space-x-4">
                    <User class="text-gray-400" />
                    <div class="flex-grow">
                        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" id="username" bind:value={username} disabled={!isEditable} 
                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm
                                      {isEditable ? '' : 'bg-gray-100'}"
                        />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <Phone class="text-gray-400" />
                    <div class="flex-grow">
                        <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" id="phoneNumber" bind:value={phoneNumber} disabled={!isEditable}
                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm
                                      {isEditable ? '' : 'bg-gray-100'}"
                        />
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <Mail class="text-gray-400" />
                    <div class="flex-grow">
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" bind:value={email} disabled={!isEditable}
                               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm
                                      {isEditable ? '' : 'bg-gray-100'}"
                        />
                    </div>
                </div>
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                    <span class="font-medium">Email Verified:</span>
                    <span class={emailVerified ? "text-green-600" : "text-red-600"}>
                        {emailVerified ? "Yes" : "No"}
                    </span>
                </div>
                <div class="pt-5">
                    {#if isEditable}
                        <button type="submit" disabled={isLoading} 
                                class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <Save class="w-4 h-4 mr-2" />
                            Save Profile
                        </button>
                    {:else}
                        <button type="button" on:click={toggleEdit}
                                class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Edit2 class="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</div>