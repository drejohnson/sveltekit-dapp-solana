<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import {
		p_autoConnect,
		p_publicKey,
		p_walletName
	} from '$lib/stores/localStorage';
	import Switch from '$lib/Switch.svelte';
	import type { WalletName } from '$lib/solana/providers';
	import { getProviders, shortenAddress } from '$lib/solana/wallet';
	import { state, send } from '$lib/connect';

	let loaded = false;
	let checked = $p_autoConnect === true;

	onMount(() => {
		loaded = true;
	});

	// const { state, send } = useMachine(persistedMachine, { devTools: true });

	$: disconnected = $state.matches('disconnected');
	$: connected = $state.matches('connected');
	$: connecting = $state.matches('connecting');
	$: ({ wallet, walletName, publicKey, balance, autoConnect } = $state.context);

	$: console.log('connecting', connecting);
	$: console.log('connected', connected);
	$: console.log('disconnected', disconnected);

	const handleConnect = async (name: WalletName | string) => {
		const _name = $p_autoConnect === true ? walletName : name;
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
</div>
