import { browser } from '$app/env';

export function initSolana() {
	return import('@solana/web3.js').then((web3) => web3);
}
