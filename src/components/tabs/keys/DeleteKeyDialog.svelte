<script lang="ts">
	import { PUBLIC_API_URL as API_URL } from '$env/static/public';
	import { GlobalKeyState } from '$lib/KeyState.svelte';
	import Spinner from '@/icon/Spinner.svelte';
	import { FormatError } from '@/lib/FormatError';
	import { showToast } from '@/lib/Toast.svelte';
	import type { KeyObject } from '@/types/key';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import { z } from 'zod';

	type DeleteDialogProps = {
		selectedKey?: Partial<KeyObject>;
		isDeleteDialogOpen: boolean;
	};

	let { selectedKey, isDeleteDialogOpen = $bindable() }: DeleteDialogProps = $props();

	let isSubmitting = $state(false);
	let errorMessage = $state('');

	let key = $state(selectedKey?.key ?? '');

	const deleteKeySchema = z.object({
		key: z.string()
	});

	function closeDialog() {
		isDeleteDialogOpen = false;
		resetForm();
	}

	function resetForm() {
		key = '';
		errorMessage = '';
	}

	async function submitForm() {
		if (!key || key.trim().length < 1) return;
		try {
			isSubmitting = true;
			errorMessage = '';

			const validatedData = deleteKeySchema.parse({
				key: key
			});

			const response = await fetch(`${API_URL}/api/v1/keys/delete`, {
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

			showToast('Deleted key successfully!');
			closeDialog();
			window.dispatchEvent(new CustomEvent('refreshKeys'));
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

{#if isDeleteDialogOpen && selectedKey && selectedKey?.key && selectedKey?.key?.length > 0}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
	>
		<div
			transition:scale={{ duration: 300, easing: quintOut }}
			class="w-96 rounded-lg bg-gray-800 p-6 text-white shadow-lg"
		>
			<h2 class="mb-4 text-lg font-bold">Delete Key</h2>
			<h3 class="mb-4 text-base">Are you sure you want to delete this key?</h3>

			<code class="text-xs"
				>Key:
				{selectedKey.key}
			</code>
			<code class="text-xs"
				>Name:
				{selectedKey.name}
			</code>

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
						disabled={isSubmitting || !key?.trim()}
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
