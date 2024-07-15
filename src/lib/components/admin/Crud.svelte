<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { user } from '$lib/stores';
    import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, type DocumentData } from 'firebase/firestore';
    import { getStorage, ref, getDownloadURL } from 'firebase/storage';
    import { db } from '$lib/firebase';
    import { Gift, DollarSign, Hash, Mail, Phone, Image, Check, X, AlertTriangle } from 'lucide-svelte';

    interface GiftCardRequest {
        price: any;
        id: string;
        category: string;
        subcategory: string;
        amount: number;
        quantity: number;
        status: string;
        userEmail: string;
        userId: string;
        createdAt: Date;
        fileURL: string;
        userDisplayName: string;
        userPhoneNumber: string;
        imageUrl?: string;
        isNew?: boolean;
        emailSent?: boolean;
        confirmed?: boolean;
        notified?: boolean;
    }

    let requests: GiftCardRequest[] = [];
    let loading = true;
    let error: string | null = null;
    let unsubscribe: () => void;
    let showModal = false;
    let newRequest: GiftCardRequest | null = null;
    let shownRequestIds: Set<string> = new Set();
    let loadingStates: Record<string, boolean> = {};

    onMount(() => {
        if ($user) {
            loadShownRequestIds();
            setupRealtimeListener();
        } else {
            error = 'Please log in to view gift card requests.';
            loading = false;
        }
    });

    onDestroy(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    function loadShownRequestIds() {
        const savedIds = localStorage.getItem('shownRequestIds');
        if (savedIds) {
            shownRequestIds = new Set(JSON.parse(savedIds));
        }
    }

    function saveShownRequestIds() {
        localStorage.setItem('shownRequestIds', JSON.stringify(Array.from(shownRequestIds)));
    }

    async function setupRealtimeListener() {
        const q = query(collection(db, 'giftcard_requests'));
        unsubscribe = onSnapshot(q, async (snapshot) => {
            const updatedRequests: GiftCardRequest[] = [];
            for (const doc of snapshot.docs) {
                const data = doc.data() as GiftCardRequest;
                const request: GiftCardRequest = {
                    ...data,
                    id: doc.id,
                    createdAt: data.createdAt.toDate()
                };
                try {
                    const storage = getStorage();
                    const storageRef = ref(storage, request.fileURL);
                    const downloadURL = await getDownloadURL(storageRef);
                    request.imageUrl = downloadURL;
                } catch (err) {
                    console.error('Error fetching image:', err);
                    request.imageUrl = undefined;
                }

                if (!requests.find(r => r.id === request.id) && !shownRequestIds.has(request.id)) {
                    request.isNew = true;
                    newRequest = request;
                    showModal = true;
                    shownRequestIds.add(request.id);
                    saveShownRequestIds();
                } else {
                    request.isNew = false;
                }
                updatedRequests.push(request);
            }
            requests = updatedRequests;
            loading = false;
        }, (err) => {
            console.error('Firestore error:', err);
            error = `Failed to fetch requests: ${err.message}`;
            loading = false;
        });
    }

    async function updateRequest(id: string, data: Partial<DocumentData>) {
        if (!$user) return;
        error = null;
        try {
            await updateDoc(doc(db, 'giftcard_requests', id), data);
            console.log(`Request ${id} updated successfully`);
        } catch (err) {
            console.error('Error updating request:', err);
            error = `Failed to update request: ${err.message}`;
        }
    }

    async function deleteRequest(id: string) {
        if (!$user) return;
        error = null;
        loadingStates[id] = true; // Start loading
        try {
            await deleteDoc(doc(db, 'giftcard_requests', id));
            console.log(`Request ${id} deleted successfully`);
            shownRequestIds.delete(id); // Remove from shown IDs if deleted
            saveShownRequestIds();
            requests = requests.filter(r => r.id !== id);
        } catch (err) {
            console.error('Error deleting request:', err);
            error = `Failed to delete request: ${err.message}`;
        } finally {
            loadingStates[id] = false; // End loading
        }
    }

    async function confirmRequest(id: string) {
        if (!$user) return;
        error = null;
        loadingStates[id] = true; // Start loading
        try {
            const request = requests.find(r => r.id === id);
            if (!request) throw new Error('Request not found');

            await updateDoc(doc(db, 'giftcard_requests', id), { status: 'confirmed', isNew: false, confirmed: true });
            console.log(`Request ${id} confirmed successfully in Firestore`);

            const response = await fetch('/api/send-notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'confirmation',
                    category: request.category,
                    subcategory: request.subcategory,
                    amount: request.amount,
                    quantity: request.quantity,
                    userEmail: request.userEmail
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send confirmation email');
            }
            console.log('Confirmation email sent successfully');

            requests = requests.map(r => r.id === id ? { ...r, status: 'confirmed', isNew: false, emailSent: true, confirmed: true } : r);
        } catch (err) {
            console.error('Error confirming request:', err);
            error = `Failed to confirm request: ${err.message}`;
        } finally {
            loadingStates[id] = false; // End loading
        }
    }

    async function notifyNotAvailable(id: string) {
        if (!$user) return;
        error = null;
        loadingStates[id] = true; // Start loading
        try {
            const request = requests.find(r => r.id === id);
            if (!request) throw new Error('Request not found');

            const response = await fetch('/api/send-notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'not-available',
                    category: request.category,
                    subcategory: request.subcategory,
                    amount: request.amount,
                    quantity: request.quantity,
                    userEmail: request.userEmail
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send not-available email');
            }
            console.log('Not-available email sent successfully');

            await updateDoc(doc(db, 'giftcard_requests', id), { notified: true });

            requests = requests.map(r => r.id === id ? { ...r, emailSent: true, notified: true } : r);
        } catch (err) {
            console.error('Error sending not-available notification:', err);
            error = `Failed to send not-available notification: ${err.message}`;
        } finally {
            loadingStates[id] = false; // End loading
        }
    }
</script>

<style>
    .modal-background {
        overflow: hidden;
    }

    .modal-content {
        max-height: 90vh;
        overflow-y: auto;
    }
</style>

<div class="container mx-auto px-4 py-8 bg-gray-50 mt-0">
    <h1 class="text-2xl font-bold mb-8 text-center text-gray-800">Gift Card Requests</h1>
    {#if loading}
        <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    {:else if error}
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r-md" role="alert">
            <p class="flex items-center"><AlertTriangle class="mr-2" /> {error}</p>
        </div>
    {:else if $user}
        {#if requests.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {#each requests as request}
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 ">
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-4">
                                <h2 class="text-2xl font-semibold text-gray-800 flex items-center mb-2">
                                    <Gift class="mr-2 text-gray-500" /> {request.category} 
                                </h2>
                                {#if loadingStates[request.id]}
                                    <div class="flex justify-center items-center">
                                        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                {/if}
                            </div>
                            <p class="text-gray-600 mb-2"><DollarSign class="inline-block mr-1 text-gray-500" /> Amount: {request.amount}</p>
                            <p class="text-gray-600 mb-2"><Hash class="inline-block mr-1 text-gray-500" /> Quantity: {request.quantity}</p>
                            <p class="text-gray-600 mb-2"><Mail class="inline-block mr-1 text-gray-500" /> User Email: {request.userEmail}</p>
                            <p class="text-gray-600 mb-2"><Phone class="inline-block mr-1 text-gray-500" /> User Phone: {request.userPhoneNumber}</p>
                            {#if request.imageUrl}
                            <img src={request.imageUrl} alt="Gift Card" class="object-cover w-full h-48 mt-4" />
                            {:else}
                            <div class="bg-gray-200 h-48 flex justify-center items-center mt-4mt-8 mb-8">
                                <Image class="text-gray-400 h-12 w-12" />
                            </div>
                            {/if}
                            <div class="flex flex-wrap items-center mt-8 gap-2">
                                <button class="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md w-full sm:w-auto shadow-lg hover:shadow-xl active:shadow-md transition-shadow duration-200 transform hover:scale-105 active:scale-95" on:click={() => confirmRequest(request.id)} disabled={request.confirmed}>
                                    {request.confirmed ? 'Confirmed' : 'Confirm'}
                                </button>
                                <button class="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md w-full sm:w-auto shadow-lg hover:shadow-xl active:shadow-md transition-shadow duration-200 transform hover:scale-105 active:scale-95" on:click={() => notifyNotAvailable(request.id)} disabled={request.notified}>
                                    {request.notified ? 'Notified' : 'Notify Not Available'}
                                </button>
                                <button class="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full sm:w-auto shadow-lg hover:shadow-xl active:shadow-md transition-shadow duration-200 transform hover:scale-105 active:scale-95" on:click={() => deleteRequest(request.id)} disabled={loadingStates[request.id]}>
                                    {loadingStates[request.id] ? 'Loading...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-gray-600 text-center">No gift card requests found.</p>
        {/if}
    {/if}
</div>

<!-- Modal for displaying new request details -->
{#if showModal && newRequest}
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" style="display: block;">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                            <Check class="h-6 w-6 text-green-600" aria-hidden="true" />
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                New Gift Card Request
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500" id="modal-description">
                                    <span class="font-semibold">Category:</span> {newRequest.category} - {newRequest.subcategory}<br />
                                    <span class="font-semibold">Amount:</span> {newRequest.amount}<br />
                                    <span class="font-semibold">Quantity:</span> {newRequest.quantity}<br />
                                    <span class="font-semibold">User Email:</span> {newRequest.userEmail}<br />
                                    <span class="font-semibold">User Phone:</span> {newRequest.userPhoneNumber}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm" on:click={() => showModal = false}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

