<script lang="ts">
	import { GlobalKeyState } from '../state.svelte';
	import AuthButton from './AuthButton.svelte';
	import LinksTable from './LinksTable.svelte';
</script>

<header class="fixed left-0 right-0 top-0 z-50 max-w-[100vw] bg-gray-800 shadow">
	<nav class="flex items-center justify-between p-4">
		<div class="flex items-center gap-4">
			<h1 class="text-xl font-bold">
				<span class="hidden sm:inline-block">Link Shortener&nbsp;</span>Dashboard
			</h1>
			<span class="rounded bg-gray-700 px-2 py-1 text-sm">
				{GlobalKeyState.name}
				{#if GlobalKeyState.is_admin}(Admin){/if}
			</span>
		</div>
		<AuthButton />
	</nav>
</header>
<main class="max-w-[100vw]">
	<div class="mx-auto max-w-7xl">
		<div class="mb-6 rounded-lg bg-gray-800 p-6 shadow">
			<LinksTable isAdmin={GlobalKeyState.is_admin} />
		</div>
	</div>
</main>
