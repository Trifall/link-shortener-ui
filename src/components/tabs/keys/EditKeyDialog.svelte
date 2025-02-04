<script lang="ts">
	import { PUBLIC_API_URL as API_URL } from '$env/static/public';
	import { GlobalKeyState } from '$lib/KeyState.svelte';
	import Spinner from '@/icon/Spinner.svelte';
	import { FormatError } from '@/lib/FormatError';
	import type { KeyObject } from '@/types/key';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import { z } from 'zod';

	let {
		key,
		name,
		is_admin,
		is_active,
		isDialogOpen
	}: Partial<KeyObject> & {
		isDialogOpen: boolean;
	} = $props();

	let isSubmitting = $state(false);
	let errorMessage = $state('');

	let keyVal = $state(key);
	let keyName = $state(name);
	let isAdmin = $state(is_admin);
	let isActive = $state(is_active);

	const updateKeySchema = z.object({
		key: z.string(),
		name: z.string().min(3, 'Name must be at least 3 characters'),
		is_admin: z.boolean().default(false),
		is_active: z.boolean().default(true)
	});

	function closeDialog() {
		isDialogOpen = false;
		resetForm();
	}

	function resetForm() {
		keyVal = '';
		keyName = '';
		isAdmin = false;
		isActive = true;
		errorMessage = '';
	}

	async function submitForm() {
		try {
			isSubmitting = true;
			errorMessage = '';

			const validatedData = updateKeySchema.parse({
				key: keyVal,
				name: keyName,
				is_admin: isAdmin,
				is_active: isActive
			});

			const response = await fetch(`${API_URL}/api/v1/keys/update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: GlobalKeyState.key
				},
				body: JSON.stringify(validatedData)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(FormatError(data.message) || 'Failed to edit key');
			}

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

{#if isDialogOpen}
	<div
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
	>
		<div
			transition:scale={{ duration: 300, easing: quintOut }}
			class="w-96 rounded-lg bg-gray-800 p-6 text-white shadow-lg"
		>
			<h2 class="mb-4 text-lg font-bold">Edit API Key</h2>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					submitForm();
				}}
				class="space-y-4"
			>
				<div>
					<label for="keyName" class="mb-2 block text-sm font-medium"> Key Name * </label>
					<input
						id="keyName"
						type="text"
						bind:value={keyName}
						class="w-full rounded border bg-gray-700 p-2 {errorMessage
							? 'border-red-400'
							: 'border-gray-600'}"
						placeholder="Key Name"
						required
						disabled={isSubmitting}
					/>
				</div>

				<div class="flex items-center gap-2">
					<input
						id="isActive"
						type="checkbox"
						bind:checked={isActive}
						class="h-4 w-4 rounded border-gray-600 bg-gray-700"
						disabled={isSubmitting}
					/>
					<label for="isActive" class="text-sm">Active</label>
				</div>

				<div class="flex items-center gap-2">
					<input
						id="isAdmin"
						type="checkbox"
						bind:checked={isAdmin}
						class="h-4 w-4 rounded border-gray-600 bg-gray-700"
						disabled={isSubmitting}
					/>
					<label for="isAdmin" class="text-sm">Admin Privileges</label>
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
						disabled={isSubmitting || !keyName?.trim()}
					>
						{#if isSubmitting}
							<div class="flex items-center gap-2">
								<span>Editing...</span>
								<Spinner />
							</div>
						{:else}
							Edit Key
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
