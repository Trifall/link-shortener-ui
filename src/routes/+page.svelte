<script lang="ts">
	import { GlobalKeyState, IsValidKeyState } from '$lib/KeyState.svelte';
	import Dashboard from '@components/Dashboard.svelte';
	import Footer from '@components/Footer.svelte';
	import LoginPanel from '@components/LoginPanel.svelte';
	import ToastWrapper from '@components/ToastWrapper.svelte';
</script>

<ToastWrapper />
<div class="relative flex min-h-screen flex-col overflow-x-hidden">
	<div
		class={`flex min-h-[80vh] max-w-full items-center justify-center bg-gray-900 text-white ${IsValidKeyState() ? 'mt-24' : ''}`}
	>
		<div class="flex flex-col items-center justify-start gap-2 bg-gray-900 text-white">
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
