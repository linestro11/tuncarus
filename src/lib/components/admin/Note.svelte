<script lang="ts">
  export let noteTitle: string = "Note:";
  export let noteText: string = "The above is a real-time wallet data update. Input the specific user's email and amount, and when submitted, the user's wallet will automatically update.";
  export let additionalText: string = "The component below is the wallet instance displaying the user's wallet amount to check if the amount is properly updated.";
</script>

<div class="p-4 dark:bg-white bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-80">
  <h1 class="text-lg font-semibold">{noteTitle}</h1>

  <p class="mb-3 text-red-500 dark:text-red-400 text-lg">
      {noteText}
  </p>
  <p class="text-red-500 dark:text-red-400 text-lg">
      {additionalText}
  </p>
</div>
