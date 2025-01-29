<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { Check } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	type ToastProps = {
		children?: Snippet;
		duration?: number;
		text?: string;
	};

	let { children, duration, text }: ToastProps = $props();

	let showToast = $state(false);

	export function show() {
		showToast = true;
		setTimeout(() => {
			showToast = false;
		}, duration ?? 5000);
	}
</script>

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
	{#if children}
		{@render children()}
	{/if}
	{#if text}
		<span>{text}</span>
	{/if}
</Toast>
