<script lang="ts">
	import { formatCurrency } from '$lib';
	import DashboardModal from '../components/DashboardModal.svelte';
	import TopupModal from '../components/TopupModal.svelte';
	import type { HistoryItem, User } from '$lib/types';
	import { loadUserID } from '$lib/keyStore';
	import { sendSignedRequest } from '$lib/sign';
	import { onMount } from 'svelte';
	import TransferModal from '../components/TransferModal.svelte';
	import HistoryModal from '../components/HistoryModal.svelte';
	import HistoryCard from '../components/HistoryCard.svelte';

	let actualUserInfo: User | undefined;
	let isLoading = true;
	let error: any | undefined = undefined;
	let history: HistoryItem[] = [];

	onMount(async () => {
		try {
			const userID = await loadUserID();
			history = await sendSignedRequest('GET', '/history?limit=3');
			actualUserInfo = await sendSignedRequest('GET', `/users/${userID}`);

			console.log(history);
		} catch (e) {
			console.error('Error fetching user info on client:', e);
			error = e;
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto mb-4 flex max-w-md items-center justify-between rounded-lg bg-white p-4">
		<h1 class="text-center text-2xl font-bold text-blue-500">E-Wallet</h1>
		<DashboardModal />
	</div>

	<div class="mx-auto max-w-md px-2">
		<div
			class="mb-6 flex flex-col items-stretch justify-between rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 p-6 text-white shadow-lg"
		>
			<div class="flex items-center justify-between">
				<div class="flex flex-col items-start justify-center">
					<p class="text-xs text-blue-100">Username</p>
					<p class="text-sm font-medium text-white">{actualUserInfo ? actualUserInfo.name : '-'}</p>
				</div>
				<div class="flex flex-col items-start justify-center">
					<p class="text-xs text-blue-100">User ID</p>
					<p class="text-sm font-medium text-white">
						{actualUserInfo ? actualUserInfo.id : '-'}
					</p>
				</div>
			</div>
			<div>
				<p class="text-sm font-medium text-blue-100">Saldo Sekarang</p>
				<h1 class="text-3xl font-bold">
					{actualUserInfo ? formatCurrency(actualUserInfo.balance) : 0}
				</h1>
			</div>
		</div>

		<div class="mb-6 grid grid-cols-3 gap-4">
			<TopupModal />

			<TransferModal />

			<HistoryModal />
		</div>

		<div class="rounded-2xl bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-800">Aktivitas Terakhir</h2>
			</div>

			<div class="flex w-full flex-col gap-4">
				{#if !history || history.length <= 0}
					<p class="w-full text-center text-gray-500">Belum ada riwayat transaksi.</p>
				{:else}
					{#each history as item}
						<HistoryCard {item} />
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
