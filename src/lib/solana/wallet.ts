import { browser } from '$app/env';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import type { PublicKey } from '@solana/web3.js';
import { initSolana } from '$lib/solana';
import type { WalletName, Wallet } from '$lib/solana/providers';

export const getProviders = async () =>
	browser ? (await import('$lib/solana/providers')).providers : null;

export const getWalletByName = async (
	name: WalletName | string
): Promise<Wallet> => {
	const providers = await getProviders();

	const walletsByName = providers?.reduce((walletsByName, provider) => {
		walletsByName[provider.name] = provider;
		return walletsByName;
	}, {} as { [name in WalletName]: Wallet });

	return walletsByName[name];
};

export const newWalletAdapter = async (
	name: WalletName | string
): Promise<WalletAdapter> => {
	const provider = await getWalletByName(name);
	const wallet = provider.adapter();

	wallet.on('connect', () => {
		console.log(
			`Connected to ${shortenAddress(wallet?.publicKey?.toBase58())}`
		);
	});
	wallet.on('disconnect', () => {
		console.log('Disconnected');
	});
	return wallet;
};

export const getBalance = async (publicKey: PublicKey): Promise<number> => {
	const { Connection, clusterApiUrl } = await initSolana();
	const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

	const balance = await connection?.getBalance(publicKey);
	console.log('balance', balance);
	return balance * 0.000000001;
};

export function shortenAddress(address: string, chars = 4): string {
	return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function displayAddress(publicKey: PublicKey): string {
	return publicKey?.toBase58();
}
