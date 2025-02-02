<script lang="ts">
	import Github from 'lucide-svelte/icons/github';
	import UserCircle2 from 'lucide-svelte/icons/user-circle-2';
	import { fade } from 'svelte/transition';

	export let isFixed = false;
</script>

<footer
	transition:fade={{ delay: 200, duration: 1500 }}
	class=" mt-auto pb-8 md:px-6 lg:px-8"
	class:fixed={isFixed}
	class:relative={!isFixed}
>
	<div class="mx-auto max-w-screen-xl text-center">
		<ul class="mb-2 flex flex-wrap items-center justify-center gap-4 text-white">
			<!-- Tooltip placeholder -->
			<li class="flex justify-center rounded-md">
				<a href="https://trifall.com" target="_blank" title="Jerren's Website">
					<UserCircle2
						class="m-auto h-8 w-8 cursor-pointer stroke-pink-500 hover:stroke-pink-600 dark:stroke-pink-300 dark:hover:stroke-pink-600"
					/>
				</a>
			</li>

			<!-- Tooltip placeholder -->
			<li class="flex justify-center rounded-md">
				<a href="https://github.com/Trifall" target="_blank" title="Jerren's GitHub">
					<Github
						class="m-auto h-8 w-8 cursor-pointer stroke-pink-500 transition-colors hover:stroke-pink-600 dark:stroke-pink-300 dark:hover:stroke-pink-600"
					/>
				</a>
			</li>
		</ul>

		<div class="flex flex-col flex-wrap justify-center">
			<span class="text-sm text-gray-800 dark:text-gray-400 sm:text-center sm:text-base">
				© {new Date().getFullYear()} by
				<a
					href="https://github.com/Trifall"
					target="_blank"
					class="text-pink-500 transition-colors hover:text-pink-600 hover:underline dark:text-pink-300 dark:hover:text-pink-400"
				>
					Jerren Trifan
				</a>
			</span>
			<span class="text-sm text-gray-800 dark:text-gray-400 sm:text-center sm:text-base">
				All Rights Reserved
			</span>
		</div>
	</div>
</footer>
