<script lang="ts">
	import { getContext } from 'svelte';
	import AuthButton from '../components/AuthButton.svelte';
	import LinksTable from '../components/LinksTable.svelte';
	import type { KeyObject } from '../types/key';

	let secretKey: KeyObject = getContext('key-context');
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<main class="flex min-h-screen flex-col items-center justify-center gap-2 p-4">
		<div class="min-h-screen bg-gray-900 text-white">
			{#if secretKey.is_active}
				<!-- Dashboard Layout -->
				<header class="fixed left-0 right-0 top-0 z-50 bg-gray-800 shadow">
					<nav class="flex items-center justify-between p-4">
						<div class="flex items-center gap-4">
							<h1 class="text-xl font-bold">Link Shortener Dashboard</h1>
							<span class="rounded bg-gray-700 px-2 py-1 text-sm">
								{secretKey.name}
								{#if secretKey.is_admin}(Admin){/if}
							</span>
						</div>
						<AuthButton />
					</nav>
				</header>
				<main class="pt-20">
					<div class="p-6">
						<div class="mx-auto max-w-7xl">
							<div class="mb-6 rounded-lg bg-gray-800 p-6 shadow">
								<h2 class="mb-4 text-2xl font-bold">Your Links</h2>
								<LinksTable isAdmin={secretKey.is_admin} />
							</div>
						</div>
					</div>
				</main>
			{:else}
				<!-- Existing Login UI -->
				<main class="flex min-h-screen flex-col items-center justify-center gap-2 p-4">
					{#if secretKey.name !== '' && secretKey.key !== '' && secretKey.is_active}
						<div class="rounded-lg bg-gray-700 p-4 text-center shadow-lg">
							<h2 class="text-center text-3xl text-white">Key Info:</h2>
							<div class="flex flex-col items-start justify-center gap-2 p-4">
								<h1 class="pb-4 text-3xl text-white">
									Name: {secretKey.name}
								</h1>
								<p class="text-balance pb-4 text-center text-3xl text-white">
									Secret Key: {secretKey.key}
								</p>
							</div>
						</div>
					{/if}
					<h1 class="pb-4 text-5xl font-bold text-white">Link Shortener UI</h1>
					<p class="text-balance pb-4 text-center text-3xl text-white">
						A secret key is required to access the link shortener. Please authorize by entering your
						secret key.
					</p>
					<AuthButton />
					<button
						on:click={() => {
							secretKey.key = 'key123543252';
							secretKey.name = 'test name';
							secretKey.is_active = true;
							secretKey.is_admin = true;
						}}
						class="rounded bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-900"
					>
						Test Set Values
					</button>
				</main>
			{/if}
		</div>
	</main>
</div>
