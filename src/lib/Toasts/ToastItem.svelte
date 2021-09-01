<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import type { ToastTypes } from '$lib/types';

	const dispatch = createEventDispatcher();

	export let type: ToastTypes = 'default';
	export let dismissible = true;
</script>

<div
	class="flex items-center bg-gray-800/75 backdrop-filter backdrop-blur-xl w-80 py-4 px-6 rounded-lg"
	role="alert"
	transition:fade
>
	{#if type === 'success'}
		<Icon icon="clarity:success-standard-line" />
	{:else if type === 'error'}
		<Icon icon="ic:outline-error-outline" />
	{:else if type === 'info'}
		<Icon icon="mdi:information-outline" />
	{:else}
		<div />
	{/if}

	<div class="text flex-1">
		<slot />
	</div>

	{#if dismissible}
		<button class="close" on:click={() => dispatch('dismiss')}>
			<Icon icon="ic:outline-close" />
		</button>
	{/if}
</div>
