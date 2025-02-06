<script lang="ts">
	import { GlobalKeyState, IsValidKeyState, UpdateKeyState } from '$lib/KeyState.svelte';
	import Spinner from '@/icon/Spinner.svelte';
	import { deleteKeyCookie, loadKeyCookie } from '@/lib/Settings';
	import { validateKey } from '@/lib/ValidateKey';
	import LoginPanel from '@components/auth/LoginPanel.svelte';
	import Dashboard from '@components/Dashboard.svelte';
	import Footer from '@components/Footer.svelte';
	import ToastWrapper from '@components/ToastWrapper.svelte';
	import AnimatedGradientText from '@components/ui/AnimatedGradientText.svelte';
	import { onMount } from 'svelte';

	let isLoading: boolean = $state(true);

	onMount(async () => {
		// Load saved key on component mount
		const savedKey = loadKeyCookie();

		if (savedKey) {
			await precheckValidatedKey(savedKey);
		}

		// save handler
		async function precheckValidatedKey(key: string) {
			let res = await validateKey(key);

			if (
				!res.success &&
				res.error &&
				res?.error.toString().toLowerCase().includes('invalid secret key') &&
				!res?.data?.key
			) {
				// invalid key response
				deleteKeyCookie();
				return;
			}
			// valid key
			UpdateKeyState(res!.data!.key!);
		}
		isLoading = false;
	});
</script>

<ToastWrapper />
<div class="relative flex min-h-screen flex-col overflow-x-hidden">
	<div
		class={`flex max-w-full justify-center bg-gray-900 text-white ${IsValidKeyState() ? 'min-h-[60vh] items-start' : 'min-h-[85vh] items-center '}`}
	>
		{#if isLoading}
			<div
				class="absolute left-1/2 top-1/2 z-[50] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2"
			>
				<AnimatedGradientText
					spanClassName="mb-6 h-24 text-center text-5xl sm:text-6xl font-bold md:text-7xl transition-all"
					>Loading</AnimatedGradientText
				>
				<Spinner size={64} stroke={'#00ffff'} />
			</div>{:else}
			{#key GlobalKeyState.key}
				{#if IsValidKeyState()}
					<!-- Dashboard Layout -->
					<Dashboard />
				{:else}
					<!-- Login UI -->
					<LoginPanel />
				{/if}
			{/key}
		{/if}
	</div>

	<Footer />
</div>
