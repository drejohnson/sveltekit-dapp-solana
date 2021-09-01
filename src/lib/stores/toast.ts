import { browser } from '$app/env';
import { writable } from 'svelte/store';
import type { Toast } from '$lib/types';

function createToast() {
	const { subscribe, update } = writable<Toast[]>([]);

	const dismiss = (id: number) => {
		update((all) => all.filter((t) => t.id !== id));
	};

	const add = (toast: Toast) => {
		// Create a unique ID so we can easily find/remove it
		// if it is dismissible/has a timeout.
		const id = Math.floor(Math.random() * 10000);

		// Setup some sensible defaults for a toast.
		const defaults: Partial<Toast> = {
			id,
			type: 'default',
			dismissible: true,
			duration: 3000
		};

		// Push the toast to the top of the list of toasts
		update((all) => [{ ...defaults, ...toast }, ...all]);

		// If toast is dismissible, dismiss it after "duration" amount of time.
		if (toast?.duration || defaults.duration)
			setTimeout(
				() => dismiss(id),
				toast?.duration ? toast?.duration : defaults.duration
			);
	};

	return {
		subscribe,
		add,
		dismiss
	};
}

export const toasts = createToast();
