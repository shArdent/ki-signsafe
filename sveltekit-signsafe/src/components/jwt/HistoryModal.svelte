<script lang="ts">
	import type { HistoryItem } from '$lib/types';
	import { History } from '@lucide/svelte';
	import HistoryCard from './HistoryCard.svelte';
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { apiJWT } from '$lib/api';

	let isOpen = false;

	export let history: HistoryItem[] = [];

	function toggleOpen() {
		isOpen = !isOpen;
	}

	onMount(async () => {
		try {
			const { data } = await apiJWT.get('/history');

			history = data;
		} catch (error) {
			console.log(error);
		}
	});
</script>

<button
	onclick={toggleOpen}
	class="flex cursor-pointer flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md active:opacity-70"
>
	<div class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-100">
		<History size={16} strokeWidth={1.5} class="text-blue-500" />
	</div>
	<span class="text-sm font-medium text-gray-700">Riwayat</span>
</button>

{#if isOpen}
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70"
		transition:fade={{ duration: 75 }}
	>
		<div
			class="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg"
			transition:scale={{ duration: 200 }}
		>
			<h2 class="mb-4 text-xl font-semibold">Riwayat Transaksi</h2>
			<div class="flex max-h-[400px] flex-col gap-3 overflow-y-auto">
				{#if history.length === 0}
					<p class="text-gray-500">Belum ada riwayat transaksi.</p>
				{:else}
					{#each history as item}
						<HistoryCard {item} />
					{/each}
				{/if}
			</div>

			<div class="mt-4 flex justify-end">
				<button
					onclick={toggleOpen}
					class="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
