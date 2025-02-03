<script lang="ts">
	import AuthButton from './AuthButton.svelte';
</script>

<main class="flex flex-col items-center justify-center gap-2 p-4">
	<h1 class="text-pretty pb-4 text-center text-3xl font-bold text-white sm:text-5xl">
		Link Shortener
	</h1>
	<div class="flex flex-col items-center justify-center gap-2 p-4 text-white">
		<p class="text-balance text-center text-lg sm:text-2xl">
			A secret key is required to access the link shortener UI.
		</p>
		<p class="text-balance text-center text-lg sm:text-2xl">
			Please authorize by entering your secret key.
		</p>
	</div>
	<AuthButton />

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
