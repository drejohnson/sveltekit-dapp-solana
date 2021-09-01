<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id = 'toggle';
	export let text = '';
	export let on: string = undefined;
	export let off: string = undefined;
	export let checked = false;
	export let disabled = false;

	const dispatch = createEventDispatcher();

	$: dispatch('toggle', checked);
</script>

<div class="flex items-center justify-center">
	<label for={id} class="flex items-center cursor-pointer">
		<!-- toggle -->
		<div class="relative">
			<!-- input -->
			<input
				{id}
				name={id}
				type="checkbox"
				class="sr-only"
				{disabled}
				bind:checked
				on:change
				on:change={() => (checked = !checked)}
			/>
			<!-- line -->
			<div class="block bg-gray-600 w-10 h-6 rounded-3xl" />
			<!-- dot -->
			<div
				class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"
			/>
		</div>
		<!-- label -->
		<div class="ml-3 text-gray-700 font-medium">
			{#if on && off}
				<span>{checked ? on : off}</span>
			{:else}
				{text}
			{/if}
		</div>
	</label>
</div>

<style lang="postcss">
	input:checked ~ .dot {
		transform: translateX(100%);
		background-color: #48bb78;
	}
</style>
