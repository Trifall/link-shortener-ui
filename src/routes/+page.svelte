<script lang="ts">
	import { GlobalKeyState, IsValidKeyState } from '$lib/KeyState.svelte';
	import Dashboard from '@components/Dashboard.svelte';
	import Footer from '@components/Footer.svelte';
	import LoginPanel from '@components/LoginPanel.svelte';
	import ToastWrapper from '@components/ToastWrapper.svelte';
</script>

<div class="relative flex min-h-screen flex-col overflow-x-hidden">
	<ToastWrapper />

	<div
		class="mt-24 flex min-h-[80vh] max-w-full items-center justify-center bg-gray-900 text-white"
	>
		<div class="flex flex-col items-center justify-center gap-2 bg-gray-900 text-white">
			{#key GlobalKeyState.key}
				{#if IsValidKeyState()}
					<!-- Dashboard Layout -->
					<Dashboard />
				{:else}
					<!-- Existing Login UI -->
					<LoginPanel />
				{/if}
			{/key}
		</div>
	</div>

	<Footer />
</div>
