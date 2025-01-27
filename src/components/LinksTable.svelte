<script lang="ts">
	import { PUBLIC_API_URL as API_URL } from '$env/static/public';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { GlobalKeyState } from '../state.svelte';
	import type { LinkObject } from '../types/link';

	let { isAdmin }: { isAdmin: boolean } = $props();
	let isLoading: boolean = $state(false);
	let error: string | null = $state(null);
	let links: LinkObject[] = $state<LinkObject[]>([]);

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
					Authorization: GlobalKeyState.key,
					'Content-Type': 'application/json'
				}
			};

			if (!isAdmin) {
				options.body = JSON.stringify({ key: GlobalKeyState.key });
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
	<div class="mb-4 flex flex-col items-center justify-between gap-4 px-0 sm:flex-row sm:px-4">
		<h2 class="text-lg font-semibold text-gray-300 sm:text-xl">Links</h2>
		<div class="flex w-full items-center gap-4 sm:w-auto">
			<button
				onclick={fetchLinks}
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
	</div>

	{#if isLoading}
		<div class="min-w-full">
			<!-- loading skeleton -->
		</div>
	{:else if error}
		<div class="rounded bg-red-800 p-4 text-red-100">
			Error loading links: {error}
		</div>
	{:else}
		<Table hoverable={true} items={links}>
			<TableHead>
				<TableHeadCell
					sort={(a: LinkObject, b: LinkObject) => a.shortened.localeCompare(b.shortened)}
					>Short URL</TableHeadCell
				>
				<TableHeadCell
					sort={(a: LinkObject, b: LinkObject) => a.redirect_to.localeCompare(b.redirect_to)}
					>Original URL</TableHeadCell
				>
				<TableHeadCell
					sort={(a: LinkObject, b: LinkObject) => a.visits - b.visits}
					defaultDirection="desc"
					defaultSort
				>
					Visits
				</TableHeadCell>
				<TableHeadCell
					sort={(a: LinkObject, b: LinkObject) =>
						new Date(a.created_at).getTime() - new Date(b.created_at).getTime()}
					>Created At</TableHeadCell
				>
				{#if isAdmin}
					<TableHeadCell>Owner</TableHeadCell>
					<TableHeadCell>Key</TableHeadCell>
				{/if}
			</TableHead>
			<TableBody>
				<TableBodyRow slot="row" let:item>
					{@const link = item as LinkObject}
					<TableBodyCell>
						<a
							href={`${API_URL}/${link.shortened}`}
							class="text-blue-500 hover:text-blue-400"
							target="_blank"
							rel="noopener noreferrer"
						>
							{link.shortened}
						</a>
					</TableBodyCell>
					<TableBodyCell>
						<a
							href={link.redirect_to}
							class="text-blue-500 hover:text-blue-400"
							target="_blank"
							rel="noopener noreferrer"
						>
							{link.redirect_to.length > 50
								? `${link.redirect_to.substring(0, 50)}...`
								: link.redirect_to}
						</a>
					</TableBodyCell>
					<TableBodyCell>{(link as LinkObject).visits}</TableBodyCell>
					<TableBodyCell>{new Date(link.created_at).toLocaleDateString()}</TableBodyCell>
					{#if isAdmin}
						<TableBodyCell>{link.secret_key.name}</TableBodyCell>
						<TableBodyCell>
							<span class="font-mono text-sm">
								{link.secret_key.key.substring(0, 8)}...
							</span>
						</TableBodyCell>
					{/if}
				</TableBodyRow>
			</TableBody>
		</Table>
	{/if}
</div>
