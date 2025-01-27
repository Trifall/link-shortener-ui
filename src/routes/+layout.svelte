<script lang="ts">
	import '@/app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	let { children } = $props();

	// watch the GlobalKeyState secretKey value
	// $inspect(GlobalKeyState).with(console.trace);
</script>

<SvelteToast />
{@render children()}
