<script>
	import { onMount } from 'svelte';

	onMount(() => {
		import('buffer').then((Buffer) => {
			global.Buffer = Buffer.Buffer;
		});
	});
</script>

<svelte:head>
	<script>
		global = globalThis; // for solana web3 repo
	</script>
</svelte:head>

<slot />

<style lang="postcss" global>
	@import '../app.postcss';
</style>
