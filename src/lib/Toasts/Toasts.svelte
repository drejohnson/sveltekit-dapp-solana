<script lang="ts">
	import ToastItem from '$lib/Toasts/ToastItem.svelte';

	import { toasts } from '$lib/stores/toast';
</script>

{#if $toasts}
	<div class="fixed bottom-8 left-8 flex flex-col justify-center gap-4 z-50">
		{#each $toasts as toast (toast.id)}
			<ToastItem
				type={toast.type}
				dismissible={toast.dismissible}
				on:dismiss={() => toasts.dismiss(toast.id)}>{toast.message}</ToastItem
			>
		{/each}
	</div>
{/if}
