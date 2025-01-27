<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../app.css';

	let { children } = $props();

	// watch the GlobalKeyState secretKey value
	// $inspect(GlobalKeyState).with(console.trace);
</script>

<SvelteToast />
{@render children()}
