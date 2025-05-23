<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	let username = '';
	let password = '';
	let error = '';

	async function handleLogin() {
		try {
			const { data } = await axios.post('http://localhost:9000/api/auth/login', {
				username,
				password
			});

			localStorage.setItem('token', data.token);

			goto('/jwt');
		} catch (err) {
			console.log(err);
			error = 'Terjadi kesalahan saat menghubungi server.';
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h2 class="mb-6 text-2xl font-semibold">Login JWT</h2>

		{#if error}
			<p class="mb-4 text-sm text-red-500">{error}</p>
		{/if}

		<form on:submit|preventDefault={handleLogin} class="space-y-4">
			<input
				type="text"
				placeholder="Username"
				bind:value={username}
				class="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				required
			/>
			<input
				type="password"
				placeholder="Password"
				bind:value={password}
				class="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				required
			/>
			<button
				type="submit"
				class="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
			>
				Masuk
			</button>
		</form>
	</div>
</div>
