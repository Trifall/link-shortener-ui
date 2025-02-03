<script lang="ts">
	import { PUBLIC_API_URL as API_URL } from '$env/static/public';
	import { GlobalKeyState } from '$lib/KeyState.svelte';
	import { showToast } from '@/lib/Toast.svelte';
	import type { KeyObject } from '@/types/key';
	import { formatDateTime } from '@/util/dates';
	import CreateKeyDialog from '@components/tabs/keys/CreateKeyDialog.svelte';
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
	let keys: KeyObject[] = $state<KeyObject[]>([]);

	const fetchKeys = async () => {
		if (!isAdmin) return;

		try {
			isLoading = true;
			error = null;

			const response = await fetch(`${API_URL}/api/v1/keys/retrieve-all`, {
				method: 'GET',
				headers: {
					Authorization: GlobalKeyState.key,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			keys = structuredClone(data.keys);
		} catch (err) {
			console.error('Fetch error:', err);
			error = err instanceof Error ? err.message : 'Failed to fetch keys';
		} finally {
			isLoading = false;
		}
	};

	const handleKeyCopy = (key: string) => {
		navigator?.clipboard?.writeText(key);
		showToast('Copied key to clipboard!');
	};

	onMount(() => {
		fetchKeys();
		const refreshHandler = () => fetchKeys();
		window.addEventListener('refreshKeys', refreshHandler);
		return () => window.removeEventListener('refreshKeys', refreshHandler);
	});
</script>

<div class="min-w-full rounded-lg shadow">
	<div class="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
		<div class="flex w-full justify-between gap-4">
			<h2 class="text-2xl font-bold">API Keys</h2>
			<div class="flex gap-2">
				<CreateKeyDialog />
				<button
					onclick={fetchKeys}
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
		{#if isLoading && keys?.length === 0}
			<div class="relative overflow-x-auto rounded-lg shadow">
				<div class="absolute left-1/2 top-1/3 z-[50] -translate-x-1/2">
					<Spinner size={24} color="blue" class="!text-gray-400" />
				</div>
				{#key keys}
					<Table
						hoverable={!isLoading}
						items={Array(4).fill({})}
						class="relative min-w-[600px] !animate-pulse md:min-w-[800px]"
					>
						<TableHead>
							<TableHeadCell class="whitespace-nowrap">Name</TableHeadCell>
							<TableHeadCell class="whitespace-nowrap">Key</TableHeadCell>
							<TableHeadCell class="whitespace-nowrap">Created At</TableHeadCell>
							<TableHeadCell class="whitespace-nowrap">Active</TableHeadCell>
							<TableHeadCell class="whitespace-nowrap">Admin</TableHeadCell>
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
								<TableBodyCell>
									<div class="h-4 animate-pulse rounded"></div>
								</TableBodyCell>
								<TableBodyCell>
									<div class="h-4 animate-pulse rounded"></div>
								</TableBodyCell>
							</TableBodyRow>
						</TableBody>
					</Table>
				{/key}
			</div>
		{:else if error}
			<div class="rounded bg-red-800 py-4 text-red-100">
				Error loading keys: {error}
			</div>
		{:else}
			<div class="relative overflow-x-auto rounded-lg shadow">
				{#key keys}
					<Table
						hoverable
						items={keys}
						class="relative min-w-[600px] md:min-w-[800px]"
						innerDivClass="py-4 px-0"
					>
						<TableHead theadClass="sticky top-0 z-10 bg-gray-800">
							<TableHeadCell
								class="whitespace-nowrap"
								sort={(a: KeyObject, b: KeyObject) => a.name.localeCompare(b.name)}
							>
								Name
							</TableHeadCell>
							<TableHeadCell class="whitespace-nowrap">Key</TableHeadCell>
							<TableHeadCell
								class="whitespace-nowrap"
								sort={(a: KeyObject, b: KeyObject) =>
									new Date(a.created_at).getTime() - new Date(b.created_at).getTime()}
							>
								Created At
							</TableHeadCell>
							<TableHeadCell
								class="whitespace-nowrap"
								sort={(a: KeyObject, b: KeyObject) =>
									new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()}
							>
								Updated At
							</TableHeadCell>
							<TableHeadCell
								class="whitespace-nowrap"
								sort={(a: KeyObject, b: KeyObject) =>
									a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1}
							>
								Active
							</TableHeadCell>
							<TableHeadCell
								class="whitespace-nowrap"
								sort={(a: KeyObject, b: KeyObject) =>
									a.is_admin === b.is_admin ? 0 : a.is_admin ? -1 : 1}
							>
								Admin
							</TableHeadCell>
						</TableHead>

						<TableBody tableBodyClass="">
							<TableBodyRow slot="row" let:item>
								{@const key = item as KeyObject}
								<TableBodyCell class="max-w-[120px] truncate" title={key.name}>
									{key.name}
								</TableBodyCell>
								<TableBodyCell class="flex items-center justify-start gap-2">
									<ClipboardCopy
										size={20}
										onclick={() => handleKeyCopy(key.key)}
										class="hover:cursor-pointer"
									/>
									<span class="truncate font-mono text-sm" title={key.key}>
										{key.key.substring(0, 8)}...
									</span>
								</TableBodyCell>
								<TableBodyCell class="whitespace-nowrap" title={formatDateTime(key.created_at)}>
									{formatDateTime(key.created_at)}
								</TableBodyCell>
								<TableBodyCell class="whitespace-nowrap" title={formatDateTime(key.updated_at)}>
									{formatDateTime(key.updated_at)}
								</TableBodyCell>
								<TableBodyCell>
									{#if key.is_active}
										<span class="text-green-400">✓</span>
									{:else}
										<span class="text-red-400">✗</span>
									{/if}
								</TableBodyCell>
								<TableBodyCell>
									{#if key.is_admin}
										<span class="text-green-400">✓</span>
									{:else}
										<span class="text-red-400">✗</span>
									{/if}
								</TableBodyCell>
							</TableBodyRow>
						</TableBody>
					</Table>
				{/key}
			</div>
		{/if}
	</div>
</div>
