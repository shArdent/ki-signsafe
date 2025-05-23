<script lang="ts">
	import { formatCurrency } from '$lib';
	import type { HistoryItem } from '$lib/types';
	import { ArrowDownCircle, ArrowUpCircle } from '@lucide/svelte';

	export let item: HistoryItem;

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('id-ID', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="flex w-full items-center justify-between">
	<div class="flex items-center gap-3">
		<div
			class={`flex h-8 w-8 items-center justify-center rounded-full
						${item.type === 'topup' || item.type === 'receive' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
		>
			{#if item.type === 'topup' || item.type === 'receive'}
				<ArrowDownCircle size={20} />
			{:else}
				<ArrowUpCircle size={20} />
			{/if}
		</div>
		<div>
			<div class="font-medium">
				{item.type === 'topup'
					? 'Top Up'
					: item.type === 'receive'
						? `Receive from ${item.sender_name ?? 'unknown'}`
						: `Transfer to ${item.reciever_name ?? 'unknown'}`}
			</div>
			<div class="text-sm text-gray-500">
				{formatDate(item.timestamp)}
			</div>
		</div>
	</div>
	<div
		class={`text-right font-semibold 
					${item.type === 'topup' || item.type === 'receive' ? 'text-green-600' : 'text-red-600'}`}
	>
		{item.type === 'transfer' ? '-' : '+'}{formatCurrency(item.amount)}
	</div>
</div>
