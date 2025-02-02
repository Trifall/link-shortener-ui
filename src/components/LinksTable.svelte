<script lang="ts">
	import { PUBLIC_API_URL as API_URL } from '$env/static/public';
	import { GlobalKeyState } from '$lib/KeyState.svelte';
	import { showToast } from '@/lib/Toast.svelte';
	import type { LinkObject } from '@/types/link';
	import CreateLinkDialog from '@components/CreateLinkDialog.svelte';
	import {
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { ClipboardCopy } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let { isAdmin }: { isAdmin: boolean } = $props();
	let isLoading: boolean = $state(false);
	let error: string | null = $state(null);
	let links: LinkObject[] = $state<LinkObject[]>([]);

	// API configuration
	const getApiConfig = () => {
		return {
			url: isAdmin
				? `${API_URL}/api/v1/links/retrieve-all`
				: `${API_URL}/api/v1/links/retrieve-all-by-key`,
			method: isAdmin ? 'GET' : 'POST',
			headers: {
				Authorization: GlobalKeyState.key,
				'Content-Type': 'application/json'
			},
			body: !isAdmin ? JSON.stringify({ key: GlobalKeyState.key }) : undefined
		};
	};

	// Error handling
	const handleError = (err: unknown) => {
		console.error('Fetch error:', err);
		error = err instanceof Error ? err.message : 'Failed to fetch links';
	};

	const handleKeyCopy = (key: string) => {
		navigator?.clipboard?.writeText(key);
		showToast('Copied key to clipboard!');
	};

	async function fetchLinks() {
		try {
			isLoading = true;
			error = null;

			const { url, method, headers, body } = getApiConfig();
			const response = await fetch(url, { method, headers, body });

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			links = structuredClone(data.links);
		} catch (err) {
			handleError(err);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchLinks();
		const refreshHandler = () => fetchLinks();
		window.addEventListener('refreshLinks', refreshHandler);
		return () => window.removeEventListener('refreshLinks', refreshHandler);
	});
</script>

<div class="min-w-full rounded-lg shadow">
	<div class="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
		<div class="flex w-full justify-between gap-4">
			<h2 class="text-2xl font-bold">Links</h2>
			<div class="flex gap-2">
				<CreateLinkDialog />
				<button
					onclick={fetchLinks}
					class="rounded-full p-2 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
					class:animate-spin={isLoading}
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
	</div>
	<div class="relative overflow-x-auto rounded-lg shadow">
		{#if isLoading && links.length === 0}
			<div class="relative overflow-x-auto rounded-lg shadow">
				<div class="absolute left-1/2 top-1/3 z-[50] -translate-x-1/2">
					<Spinner size={24} color="blue" class="!text-gray-400" />
				</div>
				{#key links}
					<Table
						hoverable={!isLoading}
						items={Array(4).fill({})}
						class="relative min-w-[600px] !animate-pulse md:min-w-[800px]"
					>
						<TableHead>
							<TableHeadCell class="whitespace-nowrap">Short URL</TableHeadCell>
							<TableHeadCell class="whitespace-nowrap">Original URL</TableHeadCell>
							<TableHeadCell class="whitespace-nowrap">Visits</TableHeadCell>
							<TableHeadCell class="whitespace-nowrap">Created At</TableHeadCell>
							{#if isAdmin}
								<TableHeadCell class="whitespace-nowrap">Owner</TableHeadCell>
								<TableHeadCell class="whitespace-nowrap">Key</TableHeadCell>
							{/if}
						</TableHead>
						<TableBody>
							<TableBodyRow slot="row" let:item>
								<TableBodyCell class="max-w-[120px] truncate">
									<div class="h-4 animate-pulse rounded"></div>
								</TableBodyCell>
								<TableBodyCell class="max-w-[150px]">
									<div class="h-4 animate-pulse rounded"></div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="h-4 animate-pulse rounded"></div>
								</TableBodyCell>
								<TableBodyCell class="whitespace-nowrap">
									<div class="h-4 animate-pulse rounded"></div>
								</TableBodyCell>
								{#if isAdmin}
									<TableBodyCell class="max-w-[100px] truncate">
										<div class="h-4 animate-pulse rounded"></div>
									</TableBodyCell>
									<TableBodyCell class="truncate">
										<div class="h-4 animate-pulse rounded"></div>
									</TableBodyCell>
								{/if}
							</TableBodyRow>
						</TableBody>
					</Table>
				{/key}
			</div>
		{:else if error}
			<div class="rounded bg-red-800 py-4 text-red-100">
				Error loading links: {error}
			</div>
		{:else}
			<div class="relative overflow-x-auto rounded-lg shadow">
				{#key links}
					<!-- <div class="max-h-[250px] overflow-y-auto"> -->
					<Table
						hoverable
						items={links}
						class="relative min-w-[600px] md:min-w-[800px]"
						filter={(t, term) => {
							return (
								t.shortened.toLowerCase().includes(term.toLowerCase()) ||
								t.redirect_to.toLowerCase().includes(term.toLowerCase()) ||
								t.secret_key.name.toLowerCase().includes(term.toLowerCase())
							);
						}}
						innerDivClass="py-4 px-0"
					>
						<TableHead theadClass="sticky top-0 z-10 bg-gray-800">
							<TableHeadCell
								class="whitespace-nowrap"
								sort={(a: LinkObject, b: LinkObject) => a.shortened.localeCompare(b.shortened)}
							>
								Short URL
							</TableHeadCell>
							<TableHeadCell
								class="whitespace-nowrap"
								sort={(a: LinkObject, b: LinkObject) => a.redirect_to.localeCompare(b.redirect_to)}
							>
								Original URL
							</TableHeadCell>
							<TableHeadCell
								class="whitespace-nowrap"
								sort={(a: LinkObject, b: LinkObject) => a.visits - b.visits}
								defaultDirection="desc"
								defaultSort
							>
								Visits
							</TableHeadCell>
							<TableHeadCell
								class="whitespace-nowrap"
								sort={(a: LinkObject, b: LinkObject) =>
									new Date(a.created_at).getTime() - new Date(b.created_at).getTime()}
							>
								Created At
							</TableHeadCell>
							{#if isAdmin}
								<TableHeadCell class="whitespace-nowrap">Owner</TableHeadCell>
								<TableHeadCell class="whitespace-nowrap">Key</TableHeadCell>
							{/if}
						</TableHead>

						<TableBody tableBodyClass="">
							<TableBodyRow slot="row" let:item>
								{@const link = item as LinkObject}
								<TableBodyCell class="max-w-[120px] truncate">
									<a
										href={`${API_URL}/${link.shortened}`}
										class="text-blue-500 hover:text-blue-400"
										target="_blank"
										rel="noopener noreferrer"
										title={link.shortened}
									>
										{link.shortened}
									</a>
								</TableBodyCell>
								<TableBodyCell class="max-w-[150px]">
									<a
										href={link.redirect_to}
										class="text-blue-500 hover:text-blue-400"
										target="_blank"
										rel="noopener noreferrer"
										title={link.redirect_to}
									>
										<span class="block truncate">
											{link.redirect_to.length > 50
												? `${link.redirect_to.substring(0, 50)}...`
												: link.redirect_to}
										</span>
									</a>
								</TableBodyCell>
								<TableBodyCell>{link.visits}</TableBodyCell>
								<TableBodyCell class="whitespace-nowrap">
									{new Date(link.created_at).toLocaleDateString()}
								</TableBodyCell>
								{#if isAdmin}
									<TableBodyCell class="max-w-[200px] truncate" title={link.secret_key.name}>
										{link.secret_key.name}
									</TableBodyCell>
									<TableBodyCell class="flex items-center justify-start gap-2">
										<ClipboardCopy
											size={20}
											onclick={() => {
												handleKeyCopy(link.secret_key.key);
											}}
											class="hover:cursor-pointer"
										/>
										<span class="truncate font-mono text-sm" title={link.secret_key.key}>
											{link.secret_key.key.substring(0, 8)}...
										</span>
									</TableBodyCell>
								{/if}
							</TableBodyRow>
						</TableBody>
					</Table>
					<!-- </div> -->
				{/key}
			</div>
		{/if}
	</div>
</div>
