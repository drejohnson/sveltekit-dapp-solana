<script lang="ts">
	import { onMount } from 'svelte';
	import { state } from '$lib/connect';

	import ConnectBadge from './ConnectBadge.svelte';
	import ConnectWallet from './ConnectWallet.svelte';
	import Link from './Link.svelte';

	export let path: string;
	let loaded = false;

	onMount(() => {
		loaded = true;
	});

	$: connected = $state.matches('connected');
	$: connecting = $state.matches('connecting');
	$: ({ wallet, walletName, publicKey, balance, autoConnect } = $state.context);
</script>

<header
	class="sticky top-0 bg-black/[0.75] backdrop-filter backdrop-blur-xl w-full z-50"
>
	<div class="grid grid-cols-auto-1fr-auto items-center container py-4 mx-auto">
		<Link href="/" styles="hover:no-underline">
			<span class="font-bold text-white text-2xl lg:w-auto py-4 mb-5 md:mb-0">
				uNFiT
			</span>
		</Link>
		<nav
			class="navigation flex gap-4 text-gray-500 mb-5 md:mb-0 md:pl-8 md:ml-4 md:border-l md:border-gray-600"
		>
			<Link
				styles="nav-link"
				href="/explore"
				activeClass={path === 'explore' ? 'underline' : ''}
			>
				Explore
			</Link>
			<Link
				styles="nav-link"
				href="/about"
				activeClass={path === 'about' ? 'underline' : ''}
			>
				About
			</Link>
		</nav>
		{#if connecting}
			loading...
		{/if}
		{#if connected}
			<ConnectBadge />
		{/if}
		{#if loaded && !connecting && !connected}
			<ConnectWallet />
		{/if}
	</div>
</header>
