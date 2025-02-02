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
		class={`flex max-w-full justify-center bg-gray-900 text-white ${IsValidKeyState() ? 'min-h-[60vh] items-start' : 'min-h-[85vh] items-center '}`}
	>
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

	<Footer />
</div>
