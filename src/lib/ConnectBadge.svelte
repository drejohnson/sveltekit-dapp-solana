<script>
	import { scale } from 'svelte/transition';
	import { displayAddress, shortenAddress } from '$lib/solana/wallet';
	import Jazzicon from '$lib/Jazzicon/Jazzicon.svelte';
	import Icon from '@iconify/svelte';
	import { state, send } from '$lib/connect';
	import { toasts } from '$lib/stores/toast';
	import { p_autoConnect } from '$lib/stores/localStorage';
	import Switch from '$lib/Switch.svelte';

	export let show = false; // menu state
	let menu = null; // menu wrapper DOM reference
	let checked = $p_autoConnect === true;

	$: ({ publicKey, balance } = $state.context);

	const handleDisconnect = async () => {
		send('DISCONNECT');
		show = false;
		checked = false;
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(publicKey?.toBase58() || '').then(() => {
			toasts.add({
				message: `Address ${shortenAddress(publicKey?.toBase58())} Copied!`
			});
		});
	};

	const handleOutsideClick = (event) => {
		if (show && !menu.contains(event.target)) {
			show = false;
		}
	};

	const handleEscape = (event) => {
		if (show && event.key === 'Escape') {
			show = false;
		}
	};

	$: connected = $state.matches('connected');
</script>

<div class="relative" bind:this={menu}>
	<div>
		<button
			class="flex items-center gap-4 bg-gray-900/[0.75] backdrop-filter backdrop-blur-xl text-gray-600 py-4 px-5 rounded-lg transition"
			on:click={() => (show = !show)}
		>
			<div class="w-full h-full">
				<Jazzicon class="w-6 h-6" address={publicKey?.toBase58()} />
			</div>
			{shortenAddress(publicKey?.toBase58())}</button
		>

		{#if show}
			<div
				in:scale={{ duration: 100, start: 0.95 }}
				out:scale={{ duration: 75, start: 0.95 }}
				class="origin-top-right absolute right-0 w-48 py-6 mt-1 bg-black/[0.65] backdrop-filter backdrop-blur-xl rounded shadow-md"
			>
				<div
					class="absolute -top-2 right-4 text-gray-600 w-4 h-4 bg-transparent border-l-8 border-r-8 border-b-8 border-black/[0.65] border-solid transform rotate-45 shadow-sm"
				/>
				<div class="flex items-center gap-4 px-4 py-2 text-gray-600">
					<span>Balance:</span>
					<span>{balance?.toFixed(2)} SOL</span>
				</div>
				<button
					on:click={handleCopy}
					class="flex items-center gap-4 px-4 py-2 text-gray-600"
				>
					<!-- <SvgIcon name="content_copy" size={4} /> -->
					<Icon icon="ic:round-content-copy" width={24} height={24} />
					<span class="text-sm"> Copy PublicKey </span>
				</button>
				<div class="flex gap-4 items-center justify-center py-2">
					<span class="text-sm text-gray-600">Auto Connect:</span>
					<Switch
						bind:checked
						on:change={() =>
							send('TOGGLE_AUTO_CONNECT', { value: (checked = !checked) })}
						disabled={!connected}
					/>
				</div>
				<button
					on:click={handleDisconnect}
					class="flex items-center gap-4 px-4 py-2 text-gray-600"
				>
					<!-- <SvgIcon name="exit" size={4} /> -->
					<Icon icon="ic:outline-exit-to-app" width={24} height={24} />
					<span class="text-sm"> Disconnect </span>
				</button>
			</div>
		{/if}
	</div>
</div>

<svelte:window on:click={handleOutsideClick} on:keyup={handleEscape} />
