<script lang="ts">
	import { toastState } from '@/lib/Toast.svelte';
	import { Toast } from 'flowbite-svelte';
	import { Check } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
</script>

<Toast
	transition={fly}
	params={{ x: 200 }}
	position={'bottom-right'}
	color="blue"
	class="!z-[9999] mb-4 !rounded-xl !text-white"
	bind:toastStatus={toastState.show}
	on:close={() => {
		toastState.show = false;
	}}
	defaultIconClass="!bg-transparent"
>
	<Check slot="icon" class="h-6 w-6 bg-transparent !stroke-green-500" />
	<span>{toastState.text}</span>
</Toast>
