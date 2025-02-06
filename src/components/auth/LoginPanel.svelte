<script lang="ts">
	import { Links } from '@/lib/Links';
	import { HomeIcon } from 'lucide-svelte';
	import AuthButton from './AuthButton.svelte';
</script>

<main class="flex flex-col items-center justify-center gap-2 p-4">
	<h1 class="text-pretty pb-4 text-center text-3xl font-bold text-white sm:text-5xl">
		Link Shortener
	</h1>
	<div class="flex flex-col items-center justify-center gap-2 p-4 text-white">
		<p class="max-w-5xl text-balance text-center text-lg sm:text-2xl">
			A secret key is required to access the link shortener UI.
		</p>
		<p class="mt-4 max-w-xl text-balance text-center text-lg text-gray-300">
			If you do not have one, then you can try contacting the server administrator to get one.
		</p>
	</div>
	<AuthButton />
	<a
		data-sveltekit-reload
		href={Links.HOME}
		class="flex min-w-[225px] max-w-[225px] flex-1 items-center justify-center gap-1 rounded-lg bg-gray-700 px-2 py-3 text-blue-400 transition-colors hover:bg-gray-600"
	>
		<HomeIcon />
		Return to home page
	</a>

	<!-- TODO: Remove this testing code
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
		onclick={() => {
			showToast('Success!' + Math.random() * 515151);
		}}
		class="rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-900"
	>
		Test toast 1
	</button> -->
</main>
