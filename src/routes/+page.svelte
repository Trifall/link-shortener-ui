<script lang="ts">
	import ToastWrapper from '@components/ToastWrapper.svelte';

	import { GlobalKeyState, IsValidKeyState } from '$lib/KeyState.svelte';
	import Dashboard from '@components/Dashboard.svelte';
	import Footer from '@components/Footer.svelte';
	import LoginPanel from '@components/LoginPanel.svelte';

	let toastWrapper = $state<ToastWrapper>();

	$effect(() => {
		if (IsValidKeyState()) {
			toastWrapper?.show();
		}
	});
</script>

<div class="relative overflow-x-hidden">
	<ToastWrapper bind:this={toastWrapper} text="Successfully logged in!" />
	<div class="flex min-h-[80vh] max-w-full items-center justify-center bg-gray-900 text-white">
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
