<script lang="ts">
	import { PUBLIC_API_URL as API_URL } from '$env/static/public';
	import { GlobalKeyState } from '$lib/KeyState.svelte';
	import { FormatError } from '@/lib/FormatError';
	import { Plus } from 'lucide-svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import { z } from 'zod';

	let isDialogOpen = $state(false);
	let isSubmitting = $state(false);
	let errorMessage = $state('');

	// Form state
	let customUrl = $state('');
	let redirectTo = $state('');
	let expiresAt = $state('');

	// Form validation schema
	const linkSchema = z.object({
		custom_url: z.string().optional(),
		redirect_to: z.string().url('Please enter a valid URL'),
		expires_at: z
			.string()
			.refine((val) => !val || new Date(val) > new Date(), {
				message: 'Expiration date must be in the future'
			})
			.optional()
			.transform((val) => (val ? new Date(val).toISOString() : null))
	});

	function openDialog() {
		isDialogOpen = true;
		resetForm();
	}

	function closeDialog() {
		isDialogOpen = false;
		resetForm();
	}

	function resetForm() {
		customUrl = '';
		redirectTo = '';
		expiresAt = '';
		errorMessage = '';
	}

	async function submitForm() {
		try {
			isSubmitting = true;
			errorMessage = '';

			// Validate form data
			const validatedData = linkSchema.parse({
				custom_url: customUrl,
				redirect_to: redirectTo,
				expires_at: expiresAt
			});

			const response = await fetch(`${API_URL}/api/v1/links/shorten`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: GlobalKeyState.key
				},
				body: JSON.stringify(validatedData)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(FormatError(data.message) || 'Failed to create link');
			}

			// Close dialog and trigger refresh of links table
			closeDialog();
			window.dispatchEvent(new CustomEvent('refreshLinks'));
		} catch (err) {
			if (err instanceof z.ZodError) {
				errorMessage = err.errors[0].message;
			} else {
				errorMessage = err instanceof Error ? err.message : 'An error occurred';
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<button
	onclick={openDialog}
	class="rounded-full p-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
	title="Create New Link"
	aria-label="Create New Link"
>
	<Plus size={24} />
</button>

{#if isDialogOpen}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
	>
		<div
			transition:scale={{ duration: 300, easing: quintOut }}
			class="w-96 rounded-lg bg-gray-800 p-6 text-white shadow-lg"
		>
			<h2 class="mb-4 text-lg font-bold">Create New Link</h2>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					submitForm();
				}}
				class="space-y-4"
			>
				<div>
					<label for="redirectTo" class="mb-2 block text-sm font-medium"> Destination URL * </label>
					<input
						id="redirectTo"
						type="url"
						bind:value={redirectTo}
						class="w-full rounded border bg-gray-700 p-2 {errorMessage
							? 'border-red-400'
							: 'border-gray-600'}"
						placeholder="https://example.com"
						required
						disabled={isSubmitting}
					/>
				</div>

				<div>
					<label for="customUrl" class="mb-2 block text-sm font-medium">
						Custom URL (optional)
					</label>
					<input
						id="customUrl"
						type="text"
						bind:value={customUrl}
						class="w-full rounded border bg-gray-700 p-2 {errorMessage
							? 'border-red-400'
							: 'border-gray-600'}"
						placeholder="custom-url"
						disabled={isSubmitting}
					/>
				</div>

				<div>
					<label for="expiresAt" class="mb-2 block text-sm font-medium">
						Expiration Date (optional)
					</label>
					<input
						id="expiresAt"
						type="datetime-local"
						bind:value={expiresAt}
						class="w-full rounded border bg-gray-700 p-2 {errorMessage
							? 'border-red-400'
							: 'border-gray-600'}"
						min={new Date().toISOString().slice(0, 16)}
						disabled={isSubmitting}
					/>
				</div>

				{#if errorMessage}
					<div class="text-sm text-red-400">{errorMessage}</div>
				{/if}

				<div class="flex justify-end gap-2">
					<button
						type="button"
						onclick={closeDialog}
						class="rounded bg-gray-600 px-4 py-2 font-bold text-white hover:bg-gray-700"
						disabled={isSubmitting}
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-900 disabled:opacity-50"
						disabled={isSubmitting || !redirectTo.trim()}
					>
						{#if isSubmitting}
							<div class="flex items-center gap-2">
								<span>Creating...</span>
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
							Create Link
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
