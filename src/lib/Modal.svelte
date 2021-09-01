<script lang="ts">
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	const dispatch = createEventDispatcher();

	export let open = false;
	export let preventCloseOnClickOutside = false;
	export let modalHeading = '';
	export let modalLabel = '';
	export let modalAriaLabel = '';
	export let iconDescription = 'Close the modal';
	export let ref: HTMLElement = null;

	let buttonRef: HTMLButtonElement = null;
	let innerModal: HTMLElement = null;
	let opened = false;
	let didClickInnerModal = false;
	let shouldSubmitOnEnter = true;

	$: ariaLabel = modalLabel || $$props['aria-label'] || modalAriaLabel || modalHeading;

	function focus(element?: HTMLElement) {
		const node = element || buttonRef;
		node.focus();
	}

	onMount(() => {
		return () => {
			document.body.classList.remove('modal-open');
		};
	});

	afterUpdate(() => {
		if (opened) {
			if (!open) {
				opened = false;
				dispatch('close');
				document.body.classList.remove('modal-open');
			}
		} else if (open) {
			opened = true;
			focus();
			dispatch('open');
			document.body.classList.add('modal-open');
		}
	});
</script>

{#if open}
	<div
		bind:this={ref}
		role="presentation"
		class="fixed top-0 left-0 flex justify-center items-center z-20 w-full h-screen bg-black bg-opacity-50"
		class:visible={open}
		on:keydown
		on:keydown={({ key }) => {
			if (open) {
				if (key === 'Escape') {
					open = false;
				} else if (shouldSubmitOnEnter && key === 'Enter') {
					dispatch('submit');
				}
			}
		}}
		on:click
		on:click={() => {
			if (!didClickInnerModal && !preventCloseOnClickOutside) open = false;
			didClickInnerModal = false;
		}}
		on:focus
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:transitionend={(e) => {
			if (e.propertyName === 'transform') {
				dispatch('transitionend', { open });
			}
		}}
		in:fade={{ duration: 200 }}
		out:fade={{ delay: 200, duration: 200 }}
		{...$$restProps}
	>
		<div
			bind:this={innerModal}
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-label={ariaLabel}
			class="relative w-400px h-auto bg-gray-900 overflow-hidden outline-none z-50  rounded-2xl"
			on:click={() => {
				didClickInnerModal = true;
			}}
			in:fly={{
				y: -10,
				delay: 200,
				duration: 200
			}}
			out:fly={{
				y: -10,
				duration: 200
			}}
		>
			<button
				bind:this={buttonRef}
				type="button"
				aria-label={iconDescription}
				title={iconDescription}
				class="absolute flex justify-center items-center top-0 right-0 w-12 h-12 p-3 overflow-hidden border-2 border-solid border-transparent focus:outline-none"
				on:click={() => {
					open = false;
				}}
			>
				<Icon icon="ic:outline-close" />
			</button>
			<div class="flex flex-col gap-4 text-white p-6">
				<slot />
			</div>
		</div>
	</div>
{/if}
