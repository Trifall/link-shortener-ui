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

	type DeleteDialogProps = {
		selectedLink?: LinkObject;
		isDeleteDialogOpen: boolean;
	};

	let { selectedLink, isDeleteDialogOpen }: DeleteDialogProps = $props();

	let isSubmitting = $state(false);
	let errorMessage = $state('');

	let shortened = $state(selectedLink?.shortened ?? '');

	const deleteLinkSchema = z.object({
		shortened: z.string()
	});

	function closeDialog() {
		isDeleteDialogOpen = false;
		resetForm();
	}

	function resetForm() {
		shortened = '';
		errorMessage = '';
	}

	async function submitForm() {
		if (!shortened || shortened.trim().length < 1) return;
		try {
			isSubmitting = true;
			errorMessage = '';

			const validatedData = deleteLinkSchema.parse({
				shortened: shortened
			});

			const response = await fetch(`${API_URL}/api/v1/links/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: GlobalKeyState.key
				},
				body: JSON.stringify(validatedData)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(FormatError(data.message) || 'Failed to delete key');
			}

			showToast('Deleted link successfully!');
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

{#if isDeleteDialogOpen && selectedLink && selectedLink?.shortened?.length > 0 && selectedLink?.redirect_to?.length > 0}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
	>
		<div
			transition:scale={{ duration: 300, easing: quintOut }}
			class="w-96 rounded-lg bg-gray-800 p-6 text-white shadow-lg"
		>
			<h2 class="mb-4 text-lg font-bold">Delete Link</h2>
			<h3 class="mb-4 text-base">Are you sure you want to delete this link?</h3>

			<code class="text-xs"
				>Shortened URL: <a
					href={`${API_URL}/${selectedLink.shortened}`}
					class="text-blue-500 hover:text-blue-400"
					target="_blank"
					rel="noopener noreferrer"
					title={selectedLink.shortened}
				>
					{selectedLink.shortened}
				</a></code
			>
			<br />
			<code class="text-xs"
				>Original URL: <a
					href={selectedLink.redirect_to}
					class="text-blue-500 hover:text-blue-400"
					target="_blank"
					rel="noopener noreferrer"
					title={selectedLink.redirect_to}
				>
					{selectedLink.redirect_to.length > 50
						? `${selectedLink.redirect_to.substring(0, 50)}...`
						: selectedLink.redirect_to}
				</a></code
			>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					submitForm();
				}}
				class="space-y-4 pt-4"
			>
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
						disabled={isSubmitting || !shortened?.trim()}
					>
						{#if isSubmitting}
							<div class="flex items-center gap-2">
								<span>Deleting...</span>
								<Spinner />
							</div>
						{:else}
							Delete Key
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
