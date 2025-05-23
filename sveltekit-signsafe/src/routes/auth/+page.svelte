<script lang="ts">
	import { loadUserID, savePrivateKey } from '$lib/keyStore';
	import {api} from '$lib/api';
	import { fade, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { User } from '$lib/types';
	import { onMount } from 'svelte';

	interface DownloadableKeyData {
		userId: string;
		name: string;
		privateKey: JsonWebKey; // Gunakan tipe yang benar untuk kunci privat
	}

	let name = '';
	let error = '';
	let isLoading = false;
	let showModal = false;

	let privateKeyText = '';
	let privateKeyDataForDownload: DownloadableKeyData | null = null;

	let selectedFile: File | null = null;
	let fileName: string | null = null;
	let loginLoading: boolean = false;
	let loginError: string = '';

	const handleRegister = async (e: Event) => {
		e.preventDefault();
		isLoading = true;
		error = '';
		try {
			const { privateKey, publicKey } = await crypto.subtle.generateKey(
				{
					name: 'RSASSA-PKCS1-v1_5',
					modulusLength: 2048,
					publicExponent: new Uint8Array([1, 0, 1]),
					hash: 'SHA-256'
				},
				true,
				['sign', 'verify']
			);

			const publicJWK = await crypto.subtle.exportKey('jwk', publicKey);
			const privateJWK = await crypto.subtle.exportKey('jwk', privateKey);

			const publicJWKString = JSON.stringify(publicJWK);

			const payload = {
				name,
				public_key: publicJWKString
			};

			const { data }: { data: User } = await api.post('/auth/register', payload);

			privateKeyDataForDownload = {
				userId: data.id,
				name: data.name,
				privateKey: privateJWK
			};

			await savePrivateKey(name, privateJWK, data.id);
			privateKeyText = JSON.stringify(privateJWK, null, 2);
			showModal = true;
		} catch (err) {
			console.log(err);
			if (err && (err as any).status == 409) {
				toast.error('Akun dengan username tersebut sudah ada');
				return;
			} else {
				toast.error('Server bermasalah coba lagi nanti');
				return;
			}
		} finally {
			isLoading = false;
		}
	};

	const downloadPrivateKey = () => {
		if (!privateKeyDataForDownload) {
			toast.error('Tidak ada data kunci untuk diunduh.');
			return;
		}

		const downloadDataString = JSON.stringify(privateKeyDataForDownload, null, 2);

		const filename = `${(privateKeyDataForDownload as DownloadableKeyData).name}-keys-${(privateKeyDataForDownload as DownloadableKeyData).userId.substring(0, 8)}.json`;
		const blob = new Blob([downloadDataString], {
			type: 'application/json'
		});
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a); // Perlu ditambahkan ke DOM sebelum klik
		a.click(); // Trigger unduhan
		document.body.removeChild(a); // Hapus elemen setelah unduhan
		URL.revokeObjectURL(url); // Bersihkan URL objek

		toast.success('File kunci Anda telah diunduh. Simpan di tempat yang aman!');
	};

	const triggerFileInput = () => {
		const fileInput = document.getElementById('key-file-input') as HTMLInputElement;
		if (fileInput) {
			fileInput.click();
		}
	};

	const handleFileChange = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			selectedFile = input.files[0];
			fileName = selectedFile.name;
			loginError = ''; // Reset error login
		} else {
			selectedFile = null;
			fileName = null;
		}
	};

	const handleLoginWithFile = async () => {
		if (!selectedFile) {
			toast.error('Harap pilih file kunci terlebih dahulu.');
			return;
		}

		loginLoading = true;
		loginError = '';

		try {
			const fileContent = await selectedFile.text();
			const keyData: DownloadableKeyData = JSON.parse(fileContent);

			if (
				!keyData.userId ||
				!keyData.privateKey ||
				typeof keyData.privateKey !== 'object' ||
				!keyData.privateKey.kty
			) {
				toast.error('Format file kunci tidak valid. Pastikan berisi userId dan privateKey.');
				return;
			}

			await savePrivateKey(keyData.name, keyData.privateKey, keyData.userId);

			toast.success(`Login berhasil untuk user: ${keyData.name || keyData.userId}`);
			goto('/');
		} catch (err: any) {
			console.error('Login with file error:', err);
			if (err instanceof SyntaxError) {
				loginError = 'File yang diunggah bukan JSON yang valid.';
				toast.error(loginError);
			} else if (err.status === 401 || err.status === 403) {
				loginError = 'Kunci tidak valid atau tidak cocok dengan akun.';
				toast.error(loginError);
			} else {
				loginError = 'Gagal login dengan file. Coba lagi nanti.';
				toast.error(loginError);
			}
		} finally {
			loginLoading = false;
			selectedFile = null;
			fileName = null;
		}
	};

	let isChecking = true;

	onMount(async () => {
		const cred = await loadUserID();
		if (cred) {
			goto('/');
		} else {
			isChecking = false;
		}
	});
</script>

{#if isChecking}
	<p class="mt-10 text-center text-gray-600">Checking session...</p>
{:else}
	<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
		<div class="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
			<h1 class="mb-4 text-2xl font-bold text-gray-700">Registrasi Akun</h1>

			<form onsubmit={handleRegister} class="space-y-4">
				<input
					class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					type="text"
					placeholder="Username"
					bind:value={name}
					required
				/>

				<button
					class="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
					type="submit"
					disabled={isLoading}
				>
					{isLoading ? 'Memproses...' : 'Daftar'}
				</button>

				{#if error}
					<p class="text-sm text-red-600">{error}</p>
				{/if}
			</form>

			<div class="my-6 flex items-center">
				<div class="flex-grow border-t border-gray-300"></div>
				<span class="mx-4 text-gray-500">ATAU</span>
				<div class="flex-grow border-t border-gray-300"></div>
			</div>

			<div class="space-y-4">
				<h2 class="mb-2 text-xl font-bold text-gray-700">Login dengan File Kunci</h2>
				<input
					type="file"
					id="key-file-input"
					accept=".json"
					class="hidden"
					onchange={handleFileChange}
				/>
				<button
					type="button"
					class="flex w-full items-center justify-center rounded-lg bg-gray-600 py-2 text-white transition hover:bg-gray-700 disabled:opacity-50"
					onclick={triggerFileInput}
					disabled={loginLoading}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
					Unggah File Kunci
				</button>
				{#if fileName}
					<p class="text-sm text-gray-600">
						File terpilih: <span class="font-medium">{fileName}</span>
					</p>
					<button
						type="button"
						class="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
						onclick={handleLoginWithFile}
						disabled={loginLoading}
					>
						{#if loginLoading}Memproses Login...{:else}Login{/if}
					</button>
				{/if}
				{#if loginError}
					<p class="text-sm text-red-600">{loginError}</p>
				{/if}
			</div>
		</div>
	</div>

	{#if showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" transition:fade>
			<div class="w-[90%] max-w-lg rounded-xl bg-white p-6 shadow-lg" transition:scale>
				<h2 class="mb-4 text-lg font-semibold text-gray-800">Private Key Anda</h2>
				<p class="mb-2 text-sm text-gray-600">
					Simpan key ini secara aman. Anda hanya dapat mengunduhnya sekali.
				</p>
				<textarea class="h-40 w-full rounded border bg-gray-50 p-2 text-xs" readonly
					>{privateKeyText}</textarea
				>

				<div class="mt-4 flex justify-end space-x-3">
					<button
						onclick={downloadPrivateKey}
						class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					>
						Download
					</button>
					<button
						onclick={() => {
							goto('/');
						}}
						class="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<Toaster />
