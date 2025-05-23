<script lang="ts">
	import { formatCurrency } from '$lib';
	import { loadUserID } from '$lib/keyStore';
	import { sendSignedRequest } from '$lib/sign';
	import type { User } from '$lib/types';
	import { ArrowDownUp } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { fade, scale } from 'svelte/transition';

	let isOpen: boolean = false;
	let selectedUser: User | null = null;
	let amount: number = 0;
	let search: string = '';
	let users: User[] = [];
	let isLoading: boolean = false;
	let debounceTimeout: ReturnType<typeof setTimeout>;
	let currentID: string | null;

	onMount(async () => {
		currentID = await loadUserID();
	});

	function onSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		search = target.value;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			if (search.length > 0) {
				fetchUsers(search);
			}
		}, 300);
	}

	async function fetchUsers(query: string): Promise<void> {
		isLoading = true;

		try {
			const data: User[] = await sendSignedRequest(
				'GET',
				`/users?name=${encodeURIComponent(query)}`
			);

			const filtered = data.filter((e) => e.id !== currentID);

			users = filtered;
		} catch (err) {
			console.error('Failed to fetch users', err);
		} finally {
			isLoading = false;
		}
	}

	async function handleTransfer(): Promise<void> {
		if (!selectedUser || amount <= 0) {
			toast.error('Please select a user and enter a valid amount.');
			return;
		}

		const payload = {
			to_user_id: selectedUser.id,
			amount
		};

		try {
			const data = await sendSignedRequest('POST', '/transfer', payload);
			toast.success(`Berhasil transfer ${formatCurrency(amount)} ke ${selectedUser.name}`);
			window.location.reload();
		} catch (error) {
			toast.error('Gagal transfer coba lagi nanti');
			console.log(error);
			return;
		}

		isOpen = false;
	}
</script>

<button
	onclick={() => {
		isOpen = true;
	}}
	class="flex cursor-pointer flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md active:opacity-70"
>
	<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
		<ArrowDownUp size={16} strokeWidth={1.5} class="text-blue-500" />
	</div>
	<span class="text-sm font-medium text-gray-700">Transfer</span>
</button>

{#if isOpen}
	<div
		class="fixed inset-0 z-40 flex items-center justify-center bg-black/70"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="z-50 w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg"
			transition:scale={{ duration: 200 }}
		>
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Transfer Saldo</h2>

			<div class="mb-4">
				<label for="user" class="mb-1 block text-sm text-gray-600">Pilih User</label>
				<input
					type="text"
					class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
					id="user"
					placeholder="Cari user..."
					oninput={onSearchInput}
				/>
				{#if isLoading}
					<p class="mt-1 text-sm text-gray-500">Loading...</p>
				{/if}
				{#if users.length > 0}
					<ul class="mt-1 max-h-40 overflow-y-auto rounded border border-gray-300 bg-white">
						{#each users as user (user.id)}
							<button
								class="cursor-pointer px-4 py-2 text-sm hover:bg-blue-100"
								onclick={() => {
									selectedUser = user;
									users = [];
									search = '';
								}}
							>
								<li>
									{user.name}
								</li>
							</button>
						{/each}
					</ul>
				{/if}
				{#if selectedUser}
					<p class="mt-2 text-sm text-green-600">Terpilih: {selectedUser.name}</p>
				{/if}
			</div>

			<div class="mb-4">
				<label for="amount" class="mb-1 block text-sm text-gray-600">Nominal Transfer (Rp)</label>
				<input
					type="number"
					bind:value={amount}
					min="0"
					id="amount"
					class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="nominal transfet"
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
					onclick={handleTransfer}
				>
					Submit
				</button>
			</div>
		</div>
	</div>
{/if}

<Toaster />
