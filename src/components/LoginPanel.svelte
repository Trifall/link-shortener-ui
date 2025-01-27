<script lang="ts">
	import { UpdateKeyState } from '$lib/KeyState.svelte';
	import type { EventHandler } from 'svelte/elements';
	import { GlobalKeyState } from '../state.svelte';
	import type { KeyObject } from '../types/key';
	import AuthButton from './AuthButton.svelte';

	let { showToastHandler }: { showToastHandler: EventHandler } = $props();
</script>

<main class="flex flex-col items-center justify-center gap-2 p-4">
	{#if GlobalKeyState.name !== '' && GlobalKeyState.key !== '' && GlobalKeyState.is_active}
		<div class="rounded-lg bg-gray-700 p-4 text-center shadow-lg">
			<h2 class="text-center text-3xl text-white">Key Info:</h2>
			<div class="flex flex-col items-start justify-center gap-2 p-4">
				<h1 class="pb-4 text-3xl text-white">
					Name: {GlobalKeyState.name}
				</h1>
				<p class="text-balance pb-4 text-center text-3xl text-white">
					Secret Key: {GlobalKeyState.key}
				</p>
			</div>
		</div>
	{/if}
	<h1 class="pb-4 text-5xl font-bold text-white">Link Shortener UI</h1>
	<p class="text-balance pb-4 text-center text-3xl text-white">
		A secret key is required to access the link shortener. Please authorize by entering your secret
		key.
	</p>
	<AuthButton />
	<button
		onclick={() => {
			let testKeyState: KeyObject = {
				key: 'key123543252',
				name: 'test name',
				created_at: '2023-07-01T00:00:00.000Z',
				updated_at: '2023-07-01T00:00:00.000Z',
				is_active: true,
				is_admin: true
			};

			UpdateKeyState(testKeyState);
		}}
		class="rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-900"
	>
		Test Set Values
	</button>

	<button
		onclick={showToastHandler}
		class="rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-900"
	>
		Test toast 1
	</button>
</main>
