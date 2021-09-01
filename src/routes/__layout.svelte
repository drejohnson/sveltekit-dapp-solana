<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Toasts from '$lib/Toasts/Toasts.svelte';
	import Nav from '$lib/Nav.svelte';

	onMount(() => {
		import('buffer').then((Buffer) => {
			global.Buffer = Buffer.Buffer;
		});
	});

	$: path = $page.path.slice(1);
</script>

<svelte:head>
	<script>
		global = globalThis; // for solana web3 repo
	</script>
</svelte:head>

<div class="relative w-full bg-blurred bg-center">
	<div class="grid grid-flow-row auto-rows-max">
		<Nav {path} />
		<main
			class=" bg-black/[0.75] backdrop-filter backdrop-blur-xl min-h-screen"
		>
			<slot />
		</main>
	</div>
</div>

<div class="contents text-base font-semibold">
	<Toasts />
</div>

<style lang="postcss" global>
	@import '../app.postcss';
</style>
