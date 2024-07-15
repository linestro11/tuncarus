<!-- src/lib/components/Modal.svelte -->
<script>
    export let isOpen = false;
    export let message = '';
    export let onClose = () => {};
  </script>
  
  {#if isOpen}
    <div class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" on:click={onClose}></div>
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <p class="text-gray-800 text-lg">{message}</p>
        <div class="mt-4 flex justify-end">
          <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={onClose}>Close</button>
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .fixed {
      position: fixed;
    }
    .inset-0 {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .z-50 {
      z-index: 50;
    }
    .bg-black {
      background-color: black;
    }
    .opacity-50 {
      opacity: 0.5;
    }
    .bg-white {
      background-color: white;
    }
    .rounded-lg {
      border-radius: 0.5rem;
    }
    .shadow-lg {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .p-6 {
      padding: 1.5rem;
    }
    .max-w-sm {
      max-width: 24rem;
    }
    .w-full {
      width: 100%;
    }
    .mx-4 {
      margin-left: 1rem;
      margin-right: 1rem;
    }
    .text-gray-800 {
      color: #2d3748;
    }
    .text-lg {
      font-size: 1.125rem;
    }
    .mt-4 {
      margin-top: 1rem;
    }
    .flex {
      display: flex;
    }
    .justify-end {
      justify-content: flex-end;
    }
    .bg-blue-500 {
      background-color: #4299e1;
    }
    .text-white {
      color: white;
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    .rounded {
      border-radius: 0.25rem;
    }
  </style>