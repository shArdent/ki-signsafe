<script lang="ts">
	import { EllipsisVertical } from '@lucide/svelte';
	import { fade } from 'svelte/transition';

	let isOpen = $state(false);

	const handleOpenModal = () => {
		isOpen = !isOpen;
	};

	const handleLogout = async () => {
		localStorage.clear();
		window.location.reload();
	};
</script>

<div class="relative">
	<EllipsisVertical size={25} onclick={handleOpenModal} class="cursor-pointer" />

	{#if isOpen}
		<div
			in:fade={{ duration: 70 }}
			out:fade={{ duration: 70 }}
			class="absolute -right-0 -bottom-10 rounded bg-white px-5 py-2 shadow"
		>
			<ul><button class="cursor-pointer" onclick={handleLogout}><li>Logout</li></button></ul>
		</div>
	{/if}
</div>
