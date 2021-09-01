import { browser } from '$app/env';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const writableStorage = <Value = string>(
	key: string
): Writable<Value> => {
	if (browser) {
		const data: Value = JSON.parse(localStorage.getItem(key)) || null;
		const store = writable(data);

		store.subscribe((val: Value) =>
			[null, undefined].includes(val)
				? localStorage.removeItem(key)
				: localStorage.setItem(key, JSON.stringify(val))
		);

		return store;
	}
};

export const p_autoConnect = writableStorage<boolean>('_auto_connect');
export const p_walletName = writableStorage('_wallet_name');
export const p_publicKey = writableStorage('_publicKey');
