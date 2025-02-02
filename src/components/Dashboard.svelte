<script lang="ts">
	import { GlobalKeyState, IsValidKeyState } from '$lib/KeyState.svelte';
	import { showToast } from '@/lib/Toast.svelte';
	import { TabItem, Tabs } from 'flowbite-svelte';
	import AuthButton from './AuthButton.svelte';
	import LinksTable from './LinksTable.svelte';

	let authToast = false;

	if (IsValidKeyState() && !authToast) {
		showToast('Successfully authenticated!');
		authToast = true;
	}
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

<main class="relative h-[60vh] min-w-[100vw]">
	<div class="mx-auto flex min-h-96 max-w-[100vw] flex-col lg:max-w-7xl">
		<Tabs
			activeClasses="bg-blue-500 rounded-t-xl"
			inactiveClasses="rounded-t-xl"
			contentClass="p-4 bg-gray-50 rounded-lg dark:bg-gray-800 mt-4 mx-4"
		>
			<TabItem
				open
				title="Profile"
				class="ml-4 flex flex-col justify-end"
				defaultClass="!p-2 text-sm"
			>
				<div class="mb-6 rounded-lg bg-gray-800 p-6 shadow">
					<LinksTable isAdmin={GlobalKeyState.is_admin} />
				</div>
			</TabItem>
			<TabItem title="Settings" class="flex flex-col justify-end" defaultClass="!p-2 text-sm">
				<span>test</span>
			</TabItem>
		</Tabs>
	</div>
</main>
