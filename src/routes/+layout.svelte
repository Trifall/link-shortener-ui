<script lang="ts">
	import { setContext } from 'svelte';
	import '../app.css';

	let keyContext = $state({ key: null });

	setContext('key-context', keyContext);
	let { children } = $props();

	// watch the keyContext secretKey value
	// $inspect(keyContext).with(console.trace);
</script>

{@render children()}
