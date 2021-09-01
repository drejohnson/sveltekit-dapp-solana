<script lang="ts">
	import { fade } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import type { WalletName } from './solana/providers';
	import { getProviders } from '$lib/solana/wallet';
	import type { Wallet } from '$lib/solana/providers';
	import Icon from '@iconify/svelte';
	import { p_autoConnect } from '$lib/stores/localStorage';
	import { state, send } from '$lib/connect';

	let open = false;
	let toggleProviders = false;
	let providers: Wallet[];

	getProviders().then((_providers) => {
		providers = _providers;
	});

	$: ({ walletName } = $state.context);
	$: phantom = providers?.find((provider) => provider.name === 'Phantom');

	const handleConnect = async (name: WalletName | string) => {
		const _name = $p_autoConnect === true ? walletName : name;
		send('CONNECT', { value: _name });
	};

	$: if (!open) {
		toggleProviders = false;
	}
</script>

<button
	on:click|preventDefault={() => (open = true)}
	class="bg-transparent text-white py-2 px-4 transition"
>
	<i class="text-gray-500" title="Connect Wallet">
		<Icon icon="ph:wallet-bold" width={30} height={30} />
	</i>
</button>

<Modal bind:open on:open on:close>
	<div class="flex flex-col items-center gap-4 mt-8 mb-4">
		<h2 class="text-2xl">
			Welcome to <span
				class="font-bold text-white text-2xl lg:w-auto py-4 mb-5 md:mb-0"
			>
				uNFiT
			</span>
		</h2>
		<p class="text-gray-600 text-sm">
			You must sign in to create or bid on NFT
		</p>
	</div>
	{#if toggleProviders}
		{#await getProviders() then providers}
			<div class="flex flex-col gap-4">
				{#each providers as provider}
					<button
						transition:fade
						class="flex items-center gap-4 bg-transparent text-gray-600 border border-gray-700 py-2 px-4"
						on:click|preventDefault={() => {
							handleConnect(provider.name);
						}}
					>
						<img class="w-6 h-6" alt={`${provider.name}`} src={provider.icon} />
						{provider.name}</button
					>
				{/each}
			</div>
		{/await}
	{:else}
		<div class="flex flex-col items-center gap-4 mb-8">
			<button
				class="flex items-center gap-4 gradient-bg w-4/5 py-4 px-5 rounded-lg transition"
				on:click|preventDefault={() => {
					handleConnect(phantom.name);
				}}
			>
				<img class="w-6 h-6" alt={`${phantom.name}`} src={phantom.icon} />
				Sign in with {phantom.name}</button
			>
			<p
				class="text-gray-600 text-sm cursor-pointer"
				on:click={(_) => (toggleProviders = true)}
			>
				Select a different Solana wallet
			</p>
		</div>
	{/if}
</Modal>
