<script lang="ts">
	import { apiJWT } from '$lib/api';
	import { loadUserID } from '$lib/keyStore';
	import { Upload } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { fade, scale } from 'svelte/transition';

	let { userID } = $props();

	let isOpen: boolean = $state(false);

	let amount: number | null = $state(null);

	const handleTopUp = async () => {
		if (!amount || amount <= 0) {
			toast.error('Amount must be greater than 0');
			return;
		}

		const payload = {
			user_id: userID,
			amount
		};

		try {
			const res = await apiJWT.post('/topup', payload);
			toast.success('Berhasil melakukan topup');
			window.location.reload();
		} catch (error) {
			console.log(error);
			toast.error('Terjadi kesalahan saat topup');
		}

		amount = null;
	};

	onMount(async () => {
		try {
			userID = await loadUserID();
		} catch (e) {
			console.error('Error fetching user info on client:', e);
		}
	});
</script>

<button
	onclick={() => (isOpen = true)}
	class="flex cursor-pointer flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md active:opacity-70"
>
	<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
		<Upload size={16} strokeWidth={1.5} class="text-blue-500" />
	</div>
	<span class="text-sm font-medium text-gray-700">Top Up</span>
</button>

{#if isOpen}
	<div
		class=" fixed inset-0 z-40 flex items-center justify-center bg-black/70"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="z-50 w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg"
			transition:scale={{ duration: 200 }}
		>
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Top Up Balance</h2>

			<div class="mb-4">
				<label for="userID" class="mb-1 block text-sm text-gray-600">User ID</label>
				<input
					type="text"
					class="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm"
					value={userID}
					id="userID"
					readonly
				/>
			</div>

			<div class="mb-4">
				<label for="amount" class="mb-1 block text-sm text-gray-600">Amount (Rp)</label>
				<input
					type="number"
					bind:value={amount}
					min="0"
					id="amount"
					class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="Masukkan jumlah top up"
				/>
			</div>

			<div class="flex justify-end gap-3">
				<button
					class="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
					onclick={() => {
						isOpen = false;
					}}
				>
					Cancel
				</button>
				<button
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
					onclick={handleTopUp}
				>
					Submit
				</button>
			</div>
		</div>
	</div>
{/if}

<Toaster />
