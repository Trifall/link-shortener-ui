<script lang="ts">
	import type { Snippet } from 'svelte';

	type AnimatedGradientTextProps = {
		className?: string;
		spanClassName?: string;
		noBorder?: boolean;
		inline?: boolean;
		children: Snippet<[]>;
	};

	let {
		className,
		spanClassName,
		noBorder = true,
		inline = false,
		children
	}: AnimatedGradientTextProps = $props();
</script>

<div
	class={`group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl px-4 py-1.5 text-sm font-medium transition-shadow duration-500 ease-out [--bg-size:300%] 
    ${!noBorder ? 'bg-white/40 shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40' : ''} 
    ${inline ? 'mx-0 inline-flex px-0' : ''} 
    ${className}`}
>
	{#if !noBorder}
		<div
			class="animate-gradient absolute inset-0 block h-full w-full bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px] [border-radius:inherit] ![mask-composite:subtract] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]"
		></div>
	{/if}

	<span
		class={`animate-gradient mb-4 block bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400 bg-[length:var(--bg-size)_100%] bg-clip-text text-3xl font-semibold text-transparent ${spanClassName}`}
	>
		{@render children()}
	</span>
</div>
