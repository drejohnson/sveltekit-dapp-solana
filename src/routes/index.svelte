<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import { useMachine } from '@xstate/svelte';
	import { fade } from 'svelte/transition';
	import {
		p_autoConnect,
		p_publicKey,
		p_walletName
	} from '$lib/stores/localStorage';
	import { walletMachine } from '$lib/wallet.machine';
	import Switch from '$lib/Switch.svelte';
	import type { WalletName } from '$lib/solana/providers';
	import { getProviders, shortenAddress } from '$lib/solana/wallet';

	let loaded = false;
	let checked = $p_autoConnect === true;

	const persistedMachine = walletMachine.withConfig({
		actions: {
			persist: (state) => {
				try {
					$p_autoConnect = state.autoConnect;
					$p_walletName = state.walletName;
					$p_publicKey = state.publicKey.toBase58();
				} catch (e) {
					console.error(e);
				}
			}
		}
	});

	onMount(() => {
		loaded = true;
	});

	const { state, send } = useMachine(persistedMachine, { devTools: true });

	$: disconnected = $state.matches('disconnected');
	$: connected = $state.matches('connected');
	$: connecting = $state.matches('connecting');
	$: ({ wallet, walletName, publicKey, balance, autoConnect } = $state.context);

	$: console.log('connecting', connecting);
	$: console.log('connected', connected);
	$: console.log('disconnected', disconnected);

	const handleConnect = async (name: WalletName | string) => {
		const _name = $p_autoConnect === true ? walletName : name;
		console.log('_name', _name);
		send('CONNECT', { value: _name });
	};
	const handleDisconnect = async () => {
		send('DISCONNECT');
		checked = false;
	};
</script>

<div class="flex flex-col container">
	<div class="py-10 px-12">
		<h1>Welcome to SvelteKit</h1>
		<p>
			Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
		</p>
	</div>

	<div class="flex flex-col gap-4 w-96 my-0 mx-auto">
		{#if connecting}
			<h1>Connecting...</h1>
		{/if}
		{#if connected}
			<h1>PublicKey: {shortenAddress(publicKey?.toBase58())}</h1>
			<p>Balance: {balance?.toFixed(2)}</p>
		{/if}
		{#if loaded && !connected}
			<h1 class={connecting ? 'hidden' : 'block'}>Connect wallet</h1>
		{/if}

		{#await getProviders()}
			loading...
		{:then wallets}
			{#if wallets}
				<h2>Wallets</h2>
				{#each wallets as provider}
					<button
						transition:fade
						class="flex items-center gap-4 bg-transparent text-gray-600 border border-gray-700 py-2 px-4"
						on:click|preventDefault={() => handleConnect(provider.name)}
					>
						<img class="w-6 h-6" alt={`${provider.name}`} src={provider.icon} />
						{provider.name}</button
					>
				{/each}
				<div class="flex gap-4 items-center justify-center">
					<span>Auto Connect:</span>
					<Switch
						bind:checked
						on="On"
						off="Off"
						on:change={() =>
							send('TOGGLE_AUTO_CONNECT', { value: (checked = !checked) })}
						disabled={!connected}
					/>
				</div>
				<div>
					<button
						on:click={handleDisconnect}
						class="flex items-center bg-black gap-4 px-4 py-2 text-white"
					>
						<span> Disconnect </span>
					</button>
				</div>
			{/if}
		{/await}
	</div>
</div>
