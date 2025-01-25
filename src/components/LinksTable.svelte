<script lang="ts">
	import { PUBLIC_API_URL as API_URL } from '$env/static/public';
	import { getContext, onMount } from 'svelte';
	import type { KeyObject } from '../types/key';
	import type { LinkObject } from '../types/link';

	export let isAdmin: boolean = false;
	let isLoading: boolean = true;
	let error: string | null = null;
	let links: LinkObject[] = [];

	let showTooltip: boolean = false;

	const secretKey: KeyObject = getContext('key-context');

	async function fetchLinks() {
		try {
			isLoading = true;
			error = null;

			const url = isAdmin
				? `${API_URL}/api/v1/links/retrieve-all`
				: `${API_URL}/api/v1/links/retrieve-all-by-key`;

			const options: RequestInit = {
				method: isAdmin ? 'GET' : 'POST',
				headers: {
					Authorization: secretKey.key,
					'Content-Type': 'application/json'
				}
			};

			if (!isAdmin) {
				options.body = JSON.stringify({ key: secretKey.key });
			}

			const response = await fetch(url, options);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log(`links: ${JSON.stringify(data.links, null, 2)}`);
			links = data.links;
		} catch (err) {
			console.error('Fetch error:', err);
			error = (err as Error).message;
		} finally {
			isLoading = false;
		}
	}

	onMount(fetchLinks);
</script>

<div class="min-w-full overflow-x-auto rounded-lg shadow">
	<div class="mb-4 flex items-center justify-between px-0 sm:px-4">
		<h2 class="text-lg font-semibold text-gray-300 sm:text-xl">Links</h2>
		<button
			on:click={fetchLinks}
			class="rounded-full p-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
			title="Refresh"
			aria-label="Refresh"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
				/>
			</svg>
		</button>
	</div>

	{#if isLoading}
		<div class="min-w-full animate-pulse">
			<table class="min-w-full divide-y divide-gray-700">
				<thead class="bg-gray-800">
					<tr>
						<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">
							<div class="h-4 w-3/4 rounded bg-gray-700"></div>
						</th>
						<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">
							<div class="h-4 w-3/4 rounded bg-gray-700"></div>
						</th>
						<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">
							<div class="h-4 w-1/4 rounded bg-gray-700"></div>
						</th>
						<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">
							<div class="h-4 w-1/2 rounded bg-gray-700"></div>
						</th>
						{#if isAdmin}
							<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">
								<div class="h-4 w-3/4 rounded bg-gray-700"></div>
							</th>
							<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">
								<div class="h-4 w-3/4 rounded bg-gray-700"></div>
							</th>
						{/if}
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-700 bg-gray-900">
					{#each { length: 5 } as _, i}
						<tr>
							<td class="px-3 py-2 sm:px-6 sm:py-4">
								<div class="h-4 w-4/5 rounded bg-gray-800"></div>
							</td>
							<td class="px-3 py-2 sm:px-6 sm:py-4">
								<div class="h-4 rounded bg-gray-800"></div>
							</td>
							<td class="px-3 py-2 sm:px-6 sm:py-4">
								<div class="h-4 w-1/4 rounded bg-gray-800"></div>
							</td>
							<td class="px-3 py-2 sm:px-6 sm:py-4">
								<div class="h-4 w-1/3 rounded bg-gray-800"></div>
							</td>
							{#if isAdmin}
								<td class="px-3 py-2 sm:px-6 sm:py-4">
									<div class="h-4 w-2/3 rounded bg-gray-800"></div>
								</td>
								<td class="px-3 py-2 sm:px-6 sm:py-4">
									<div class="h-4 w-3/4 rounded bg-gray-800"></div>
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if error}
		<div class="rounded bg-red-800 p-4 text-red-100">
			Error loading links: {error}
		</div>
	{:else}
		<table class="min-w-full divide-y divide-gray-700" id="links-table">
			<thead class="bg-gray-800">
				<tr>
					<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">Short URL</th>
					<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">Original URL</th>
					<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">Visits</th>
					<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">Created At</th>
					{#if isAdmin}
						<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">Owner (Name)</th>
						<th class="px-3 py-2 text-left text-xs sm:px-6 sm:py-3 sm:text-sm">Owner (Key)</th>
					{/if}
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-700 bg-gray-900">
				{#each links as link}
					<tr class="hover:bg-gray-800">
						<td class="px-3 py-2 sm:px-6 sm:py-4">
							<a
								href={`${API_URL}/${link.shortened}`}
								class="text-sm text-blue-400 hover:text-blue-300"
							>
								<span class="hidden sm:inline">{link.shortened}</span>
								<span class="sm:hidden">/{link.shortened.split('/').pop()}</span>
							</a>
						</td>
						<td class="max-w-[100px] truncate px-3 py-2 sm:max-w-none sm:px-6 sm:py-4">
							<a href={link.redirect_to} class="text-sm text-blue-400 hover:text-blue-300">
								{link.redirect_to}
							</a>
						</td>
						<td class="px-3 py-2 text-sm sm:px-6 sm:py-4">{link.visits}</td>
						<td class="px-3 py-2 text-sm sm:px-6 sm:py-4">
							{new Date(link.created_at).toLocaleDateString()}
						</td>
						{#if isAdmin}
							<td class="px-3 py-2 text-sm sm:px-6 sm:py-4">{link.secret_key.name}</td>
							<td class="relative max-w-[200px] truncate px-3 py-2 text-sm sm:px-6 sm:py-4">
								<!-- Secret key copy button -->
								<div class="flex items-center">
									<button
										on:click={() => {
											navigator.clipboard.writeText(link.secret_key.key);
										}}
										class="rounded bg-gray-700 px-2 py-1 text-sm text-white hover:bg-gray-800"
										aria-label="Copy secret key"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h4a2 2 0 002-2M8 5a2 2 0 012-2h4a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
											/>
										</svg>
									</button>
									<!-- Tooltip container -->
									<span
										class="ml-2 overflow-x-auto align-middle hover:underline"
										id="tooltip-target"
									>
										{link.secret_key.key}
									</span>
								</div>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
