<script lang="ts">
	import { GlobalKeyState, ResetKeyState, UpdateKeyState } from '$lib/KeyState.svelte';
	import { deleteKeyCookie, loadKeyCookie } from '@/lib/Settings';
	import { validateKey } from '@/lib/ValidateKey';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';

	let isDialogOpen = $state(false);
	let inputKey = $state('');
	let isSubmitting = $state(false);
	let errorMessage = $state('');

	function openDialog() {
		// load the cookie to check for a valid
		const cookieKey = loadKeyCookie();
		if (cookieKey && cookieKey.length > 1) {
			submitPasskey(cookieKey);
		}

		isDialogOpen = true;
		inputKey = '';
		errorMessage = '';
	}

	function closeDialog() {
		isDialogOpen = false;
	}

	async function submitPasskey(overrideKey?: string) {
		errorMessage = '';
		isSubmitting = true;

		let reqKey;
		if (inputKey.length > 0) {
			reqKey = inputKey;
		} else if (overrideKey && overrideKey.length > 0) {
			reqKey = overrideKey;
		}

		try {
			if (reqKey && reqKey.length > 0) {
				const result = await validateKey(reqKey);

				if (!result.success) {
					errorMessage = result.error!;
					return;
				}

				if (!result || !result.data?.key) {
					errorMessage = 'Server error.';
					return;
				}

				console.log('Validate Key Response:', result.data);
				UpdateKeyState(result!.data!.key!);
				closeDialog();
			}
		} finally {
			isSubmitting = false;
		}
	}

	// removes stored cookie and resets the global key state
	function logout() {
		deleteKeyCookie();
		ResetKeyState();
	}
</script>

{#if GlobalKeyState.is_active}
	<button
		onclick={logout}
		class="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
	>
		Logout
	</button>
{:else}
	<button
		onclick={openDialog}
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
						onclick={closeDialog}
						class="rounded bg-gray-600 px-4 py-2 font-bold text-white hover:bg-gray-700"
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						onclick={() => submitPasskey()}
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
