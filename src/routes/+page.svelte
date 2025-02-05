<script lang="ts">
	import Cloudflare from '@/icon/logos/Cloudflare.svelte';
	import Docker from '@/icon/logos/Docker.svelte';
	import Golang from '@/icon/logos/Golang.svelte';
	import Postgresql from '@/icon/logos/Postgresql.svelte';
	import Svelte from '@/icon/logos/Svelte.svelte';
	import Swagger from '@/icon/logos/Swagger.svelte';
	import Tailwindcss from '@/icon/logos/Tailwindcss.svelte';
	import Footer from '@components/Footer.svelte';
	import AnimatedGradientText from '@components/ui/AnimatedGradientText.svelte';
	import { Github } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { fade, fly } from 'svelte/transition';

	// Svelte 5 reactive state
	let intersectionObserver: IntersectionObserver;
	let visibleSections = new Set();

	// Spring animation for hover effects
	const scale = new Spring(1, {
		stiffness: 0.2,
		damping: 0.4
	});

	onMount(() => {
		intersectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						visibleSections.add(entry.target.id);
						visibleSections = visibleSections;
					}
				});
			},
			{ threshold: 0.2 }
		);

		document.querySelectorAll('section').forEach((section) => {
			intersectionObserver.observe(section);
		});

		return () => intersectionObserver.disconnect();
	});
</script>

<div class="min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-900 to-black text-white">
	<!-- Hero Section -->
	<section
		id="hero"
		class="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-24"
	>
		{#if visibleSections.has('hero')}
			<div in:fade={{ duration: 1000 }} class="flex flex-col items-center justify-center">
				<AnimatedGradientText spanClassName="mb-6 text-center text-6xl font-bold md:text-7xl"
					>Simplify Your Links</AnimatedGradientText
				>
				<p
					class="mx-auto mb-12 max-w-2xl text-balance text-center text-xl text-gray-300 md:text-2xl"
				>
					A simple and concise link shortener built with Svelte and Go
				</p>
				<div class="flex w-full max-w-md flex-col justify-center gap-4 md:flex-row">
					<a
						href="#features"
						class="flex-1 rounded-lg bg-blue-600 px-8 py-3 text-center transition-colors hover:bg-blue-700"
					>
						Learn more
					</a>
					<a
						href="https://github.com/Trifall/link-shortener-ui"
						class="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-800 px-8 py-3 transition-colors hover:bg-gray-700"
					>
						<Github />
						View on GitHub
					</a>
				</div>
			</div>
		{/if}
	</section>

	<!-- Features Section -->
	<section id="features" class="container mx-auto px-4 py-24">
		{#if visibleSections.has('features')}
			<div in:fade={{ duration: 1000 }}>
				<AnimatedGradientText spanClassName="mb-16 !h-12 text-center text-4xl font-bold"
					>Key Features</AnimatedGradientText
				>
				<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each [{ title: 'Secret-Key System', description: 'Generate root keys and create hierarchical access with granular permissions' }, { title: 'API Documentation', description: 'Comprehensive Swagger documentation for seamless integration' }, { title: 'Interactive Dashboard', description: 'Modern dashboard for link creation and management' }, { title: 'Link Expiration', description: 'Set precise expiration times for temporary links' }, { title: 'Simplified Backend', description: 'Contains robust logging and authentication middleware' }, { title: 'Smooth UI', description: 'Responsive design with intuitive notifications' }] as feature}
						<div
							class="transform rounded-lg bg-gray-800 p-6 transition-all hover:-translate-y-1 hover:bg-gray-700"
							in:fly={{ y: 20, duration: 600, delay: 200 }}
						>
							<h3 class="mb-3 text-xl font-semibold">{feature.title}</h3>
							<p class="text-gray-300">{feature.description}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</section>

	<!-- Tech Stack Section -->
	<section id="tech" class="mx-auto px-4 py-24 lg:container">
		{#if visibleSections.has('tech')}
			<div in:fade={{ duration: 1000 }}>
				<AnimatedGradientText spanClassName="mb-16 !h-12 text-center text-4xl font-bold"
					>Built With Modern Tech</AnimatedGradientText
				>
				<div class="grid gap-12 md:grid-cols-2">
					<!-- Frontend Card -->
					<div class="w-full rounded-lg bg-gray-800 p-8 transition-all hover:bg-gray-700">
						<h3 class="mb-4 text-2xl font-bold">Frontend</h3>
						<div class="mb-4 flex flex-wrap gap-4">
							<Svelte />
							<Tailwindcss />
							<Cloudflare />
						</div>
						<p class="mb-4 text-gray-300">
							Built with Svelte 5 and TailwindCSS and hosted on Cloudflare for a modern, responsive
							experience
						</p>
						<a
							href="https://github.com/Trifall/link-shortener-ui"
							class="inline-flex items-center text-blue-400 hover:text-blue-300"
						>
							View on GitHub →
						</a>
					</div>

					<!-- Backend Card -->
					<div class="w-full rounded-lg bg-gray-800 p-8 transition-all hover:bg-gray-700">
						<h3 class="mb-4 text-2xl font-bold">Backend</h3>
						<div class="mb-4 flex flex-wrap gap-4">
							<Golang size={48} />
							<!-- Reduced size for responsiveness -->
							<Postgresql />
							<Docker />
							<Swagger />
						</div>
						<p class="mb-4 text-gray-300">
							Powered by Go with PostgreSQL, Docker support, and Swagger documentation
						</p>
						<a
							href="https://github.com/Trifall/go-link-shortener"
							class="inline-flex items-center text-blue-400 hover:text-blue-300"
						>
							View on GitHub →
						</a>
					</div>
				</div>
			</div>
		{/if}
	</section>

	<Footer />
</div>
