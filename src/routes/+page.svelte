<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { Check } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	import { GlobalKeyState, IsValidKeyState } from '$lib/KeyState.svelte';
	import Dashboard from '@components/Dashboard.svelte';
	import Footer from '@components/Footer.svelte';
	import LoginPanel from '@components/LoginPanel.svelte';

	let showToast = $state(false);

	$effect(() => {
		if (IsValidKeyState()) showToastHandler();
	});

	function showToastHandler() {
		showToast = true;
		setTimeout(() => {
			showToast = false;
		}, 5000);
	}
</script>

<div class="relative overflow-x-hidden">
	<Toast
		transition={fly}
		params={{ x: 200 }}
		position={'bottom-right'}
		color="blue"
		class="!z-[9999] mb-4 !rounded-xl !text-white"
		bind:toastStatus={showToast}
		on:close={() => {
			showToast = false;
		}}
		defaultIconClass="!bg-transparent"
	>
		<Check slot="icon" class="h-6 w-6 bg-transparent !stroke-green-500" />
		<span>Successfully logged in!</span>
	</Toast>
	<div class="flex min-h-[80vh] max-w-full items-center justify-center bg-gray-900 text-white">
		<div class="flex flex-col items-center justify-center gap-2 bg-gray-900 text-white">
			{#key GlobalKeyState.key}
				{#if IsValidKeyState()}
					<!-- Dashboard Layout -->
					<Dashboard />
				{:else}
					<!-- Existing Login UI -->
					<LoginPanel {showToastHandler} />
				{/if}
			{/key}
		</div>
	</div>

	<Footer />
</div>
