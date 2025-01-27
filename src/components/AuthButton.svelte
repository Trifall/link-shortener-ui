<script lang="ts">
	import { PUBLIC_API_URL as API_URL } from '$env/static/public';
	import { UpdateKeyState } from '$lib/KeyState.svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import { GlobalKeyState, ResetKeyState } from '../state.svelte';
	import type { ValidateKeyResponse } from '../types/key';
	import { capitalizeFirstLetter } from '../util/strings';

	let isDialogOpen = false;
	let inputKey = '';
	let isSubmitting = false;
	let errorMessage = '';

	function openDialog() {
		isDialogOpen = true;
		inputKey = '';
		errorMessage = '';
	}

	function closeDialog() {
		isDialogOpen = false;
	}

	async function submitPasskey() {
		errorMessage = '';
		const cleanedKey = inputKey.trim();

		if (!cleanedKey) {
			errorMessage = 'Passkey is required';
			return;
		}

		// basic SQL injection prevention
		const sqlInjectionPattern = /(['";\\]+|--|\.\.)/;
		if (sqlInjectionPattern.test(cleanedKey)) {
			errorMessage = 'Invalid characters detected';
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch(`${API_URL}/api/v1/keys/validate`, {
				method: 'POST',
				headers: {
					Authorization: cleanedKey
				}
			});

			// parse body
			const responseData: ValidateKeyResponse = await response.json();

			if (!response.ok) {
				// use error message from response if available
				throw new Error(
					responseData?.message && responseData?.message?.length > 0
						? capitalizeFirstLetter(responseData.message, true)
						: 'Invalid passkey'
				);
			}

			console.log('Validate Key Response:', responseData);

			// You can use specific properties from the response
			if (responseData.key && responseData.key.key.length > 0) {
				UpdateKeyState(responseData.key);
				closeDialog();
			} else {
				throw new Error('Validation failed');
			}
		} catch (err) {
			console.error('Validation error:', err);
			errorMessage =
				capitalizeFirstLetter((err as Error).message, true) ||
				'Failed to validate passkey. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	// Add logout function
	function logout() {
		ResetKeyState();
		// reload the page
		window.location.reload();
	}
</script>

{#if GlobalKeyState.is_active}
	<button
		on:click={logout}
		class="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
	>
		Logout
	</button>
{:else}
	<button
		on:click={openDialog}
		class="rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-900"
	>
		Authorize
	</button>

	{#if isDialogOpen}
		<div
			transition:fade={{ duration: 300 }}
			class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
		>
			<div
				transition:scale={{ duration: 300, easing: quintOut }}
				class="w-96 rounded-lg bg-gray-800 p-6 text-white shadow-lg"
			>
				<h2 class="mb-4 text-lg font-bold">Enter Secret Passkey</h2>
				<h3 class="mb-4 text-sm">Current Passkey: {GlobalKeyState.key || 'N/A'}</h3>

				<input
					type="password"
					bind:value={inputKey}
					class="mb-2 w-full rounded border bg-gray-700 p-2 {errorMessage
						? 'border-red-400'
						: 'border-gray-600'}"
					placeholder="Secret Passkey"
					disabled={isSubmitting}
				/>

				{#if errorMessage}
					<div class="mb-4 text-sm text-red-400">{errorMessage}</div>
				{/if}

				<div class="flex justify-end gap-2">
					<button
						on:click={closeDialog}
						class="rounded bg-gray-600 px-4 py-2 font-bold text-white hover:bg-gray-700"
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						on:click={submitPasskey}
						class="rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-900 disabled:opacity-50"
						disabled={isSubmitting || !inputKey.trim()}
					>
						{#if isSubmitting}
							<div class="flex items-center gap-2">
								<span>Verifying...</span>
								<span class="animate-spin">
									<svg
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
									</svg>
								</span>
							</div>
						{:else}
							Verify
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}
