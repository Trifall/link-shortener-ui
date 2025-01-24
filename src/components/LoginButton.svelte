<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';

	let isDialogOpen = false;
	let secretPasskey = '';
	let isSubmitting = false;

	function openDialog() {
		isDialogOpen = true;
	}

	function closeDialog() {
		isDialogOpen = false;
	}

	async function submitPasskey() {
		isSubmitting = true;
		// Simulate a network request
		await new Promise((resolve) => setTimeout(resolve, 555000));
		isSubmitting = false;
		closeDialog();
		alert('Passkey submitted!');
	}
</script>

<button
	on:click={openDialog}
	class=" text-white font-bold py-2 px-4 rounded bg-blue-700 hover:bg-blue-900"
>
	Login
</button>

{#if isDialogOpen}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
	>
		<div
			transition:scale={{ duration: 300, easing: quintOut }}
			class=" p-6 rounded-lg shadow-lg bg-gray-800 text-white"
		>
			<h2 class="text-lg font-bold mb-4">Enter Secret Passkey</h2>
			<input
				type="password"
				bind:value={secretPasskey}
				class="w-full p-2 border rounded mb-4 bg-gray-700 border-gray-600"
				placeholder="Secret Passkey"
			/>
			<div class="flex justify-end">
				<button
					on:click={closeDialog}
					class=" font-bold py-2 px-4 rounded mr-2 bg-gray-600 hover:bg-gray-700 text-white"
				>
					Cancel
				</button>
				<button
					on:click={submitPasskey}
					class=" text-white font-bold py-2 px-4 rounded bg-blue-700 hover:bg-blue-900"
					disabled={isSubmitting}
				>
					{#if isSubmitting}
          <div class="flex justify-center items-center gap-2">
            <span>Submitting...</span>
						<span class="animate-spin"><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2v4" />
              <path d="m16.2 7.8 2.9-2.9" />
              <path d="M18 12h4" />
              <path d="m16.2 16.2 2.9 2.9" />
              <path d="M12 18v4" />
              <path d="m4.9 19.1 2.9-2.9" />
              <path d="M2 12h4" />
              <path d="m4.9 4.9 2.9 2.9" />
            </svg></span>
          </div>
					{:else}
						Submit
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}


