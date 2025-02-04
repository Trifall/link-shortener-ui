<script lang="ts">
	import { GlobalKeyState, IsValidKeyState } from '$lib/KeyState.svelte';
	import { showToast } from '@/lib/Toast.svelte';
	import AuthButton from '@components/auth/AuthButton.svelte';
	import KeysTable from '@components/tabs/keys/KeysTable.svelte';
	import LinksTable from '@components/tabs/links/LinksTable.svelte';
	import Settings from '@components/tabs/settings/Settings.svelte';
	import { TabItem, Tabs } from 'flowbite-svelte';

	if (IsValidKeyState()) {
		showToast('Successfully authenticated!');
	}
</script>

<header class="fixed left-0 right-0 top-0 z-50 max-w-[100vw] bg-gray-800 shadow">
	<nav class="flex items-center justify-between p-4">
		<div class="mx-2 flex items-center gap-2">
			<h1 class="text-xl font-bold">
				<span class="hidden sm:inline-block">Link Shortener&nbsp;</span>Dashboard
			</h1>
			<span class="text-balance rounded bg-gray-700 px-2 py-1 text-center text-sm">
				{GlobalKeyState.name}
				{#if GlobalKeyState.is_admin}(Admin){/if}
			</span>
		</div>
		<AuthButton />
	</nav>
</header>

<main class="relative flex-1">
	<div class="mx-auto mt-24 flex h-full min-w-[100vw] max-w-[100vw] flex-col lg:max-w-7xl">
		<Tabs
			activeClasses="bg-blue-500 rounded-t-xl"
			inactiveClasses="rounded-t-xl"
			contentClass="flex-1 p-4 bg-gray-50 dark:bg-gray-800 mx-4 mb-4"
		>
			<TabItem
				open
				title="Profile"
				class="ml-4 flex flex-col justify-end "
				defaultClass="!p-2 text-base min-w-[65px]"
			>
				<div class="mb-6 rounded-lg bg-gray-800 p-6 shadow">
					<LinksTable isAdmin={GlobalKeyState.is_admin} />
				</div>
			</TabItem>
			{#if GlobalKeyState.is_admin}
				<TabItem
					title="Keys"
					class="flex flex-col justify-end"
					defaultClass="!p-2 text-base min-w-[65px]"
				>
					<div class="mb-6 rounded-lg bg-gray-800 p-6 shadow">
						<KeysTable isAdmin={GlobalKeyState.is_admin} />
					</div>
				</TabItem>
			{/if}
			<TabItem
				title="Settings"
				class="flex flex-col justify-end"
				defaultClass="!p-2 text-base min-w-[65px]"
			>
				<Settings />
			</TabItem>
		</Tabs>
	</div>
</main>
