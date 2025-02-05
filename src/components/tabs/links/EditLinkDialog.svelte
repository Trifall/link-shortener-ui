<script lang="ts">
	import { PUBLIC_API_URL as API_URL } from '$env/static/public';
	import { GlobalKeyState } from '$lib/KeyState.svelte';
	import Spinner from '@/icon/Spinner.svelte';
	import { FormatError } from '@/lib/FormatError';
	import { showToast } from '@/lib/Toast.svelte';
	import type { LinkObject } from '@/types/link';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import { z } from 'zod';

	type EditLinkObject = LinkObject & { new_shortened?: string };

	type EditDialogProps = {
		selectedLink?: EditLinkObject;
		isEditDialogOpen: boolean;
	};

	let isSubmitting = $state(false);
	let errorMessage = $state('');

	// Use Svelte 5 runes for bindable props
	let { selectedLink, isEditDialogOpen = $bindable() }: EditDialogProps = $props();

	if (selectedLink) {
		selectedLink.new_shortened = selectedLink?.shortened;
	}

	$inspect(selectedLink);

	const editLinkObjectSchema = z.object({
		id: z.string(),
		redirect_to: z.string(),
		shortened: z.string(),
		new_shortened: z.string().optional(),
		expires_at: z
			.string()
			.refine(
				(val) => {
					if (!val) return true;
					const timestamp = new Date(val).getTime();
					return timestamp === 0 || new Date(val) > new Date();
				},
				{
					message: 'Expiration date must be in the future'
				}
			)
			.optional()
			.transform((val) => (val ? new Date(val).toISOString() : null))
	});

	let localExpiresAt = $state('');

	// TODO: could be optimized
	$effect(() => {
		if (selectedLink) {
			localExpiresAt = selectedLink.expires_at ? selectedLink.expires_at.slice(0, 16) : '';
		}
	});

	function closeDialog() {
		isEditDialogOpen = false;
		resetForm();
	}

	function resetForm() {
		selectedLink = undefined;
		errorMessage = '';
	}

	$inspect(selectedLink, localExpiresAt);

	async function submitForm() {
		if (!selectedLink) return;
		try {
			isSubmitting = true;
			errorMessage = '';

			// Sync the local expiration value back to selectedLink
			selectedLink.expires_at = localExpiresAt;

			// If expires_at is null, undefined, or empty string, set it to the earliest possible timestamp
			if (!selectedLink.expires_at) {
				selectedLink.expires_at = '1970-01-01T00:00:00.000Z';
			}

			const reqObj = { ...selectedLink } as EditLinkObject;
			// check for a new_shortened url, if its equal to the already existing one, then delete the field
			if (selectedLink?.new_shortened && selectedLink?.new_shortened?.length > 0) {
				if (selectedLink.shortened !== selectedLink.new_shortened.trim()) {
					reqObj.new_shortened = selectedLink.new_shortened.trim();
				} else {
					delete reqObj.new_shortened;
				}
			}

			const validatedData = editLinkObjectSchema.parse(reqObj);

			const response = await fetch(`${API_URL}/api/v1/links/update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: GlobalKeyState.key
				},
				body: JSON.stringify(validatedData)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(FormatError(data.message) || 'Failed to edit link');
			}

			navigator?.clipboard?.writeText(`${API_URL}/${data?.shortened}`);
			showToast('Edited link successfully! It has been copied to your clipboard.');
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

{#if isEditDialogOpen && selectedLink}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
	>
		<div
			transition:scale={{ duration: 300, easing: quintOut }}
			class="w-96 rounded-lg bg-gray-800 p-6 text-white shadow-lg"
		>
			<h2 class="mb-4 text-lg font-bold">Edit Link</h2>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					submitForm();
				}}
				class="space-y-4"
			>
				<div>
					<label for="shortened" class="mb-2 block text-sm font-medium"> Shortened Path * </label>
					<input
						id="shortened"
						type="text"
						bind:value={selectedLink.new_shortened}
						class="w-full rounded border border-gray-600 bg-gray-700 p-2 disabled:cursor-not-allowed disabled:opacity-50"
						placeholder="short-url"
						required
					/>
				</div>

				<div>
					<label for="redirectTo" class="mb-2 block text-sm font-medium"> Redirect URL * </label>
					<input
						id="redirectTo"
						type="url"
						bind:value={selectedLink.redirect_to}
						class="w-full rounded border border-gray-600 bg-gray-700 p-2"
						placeholder="https://example.com"
						required
						disabled={isSubmitting}
					/>
				</div>

				<div>
					<label for="expiresAt" class="mb-2 block text-sm font-medium"> Expiration Date </label>
					<input
						id="expiresAt"
						type="datetime-local"
						bind:value={localExpiresAt}
						class="w-full rounded border border-gray-600 bg-gray-700 p-2"
						disabled={isSubmitting}
					/>
				</div>

				<div class="flex items-center gap-2">
					<input
						id="isActive"
						type="checkbox"
						bind:checked={selectedLink.is_active}
						class="h-4 w-4 rounded border-gray-600 bg-gray-700"
						disabled={isSubmitting}
					/>
					<label for="isActive" class="text-sm">Active</label>
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
						disabled={isSubmitting ||
							!selectedLink?.redirect_to?.trim() ||
							!selectedLink?.shortened?.trim() ||
							!selectedLink?.secret_key?.key?.trim()}
					>
						{#if isSubmitting}
							<div class="flex items-center gap-2">
								<span>Editing...</span>
								<Spinner />
							</div>
						{:else}
							Edit Link
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
