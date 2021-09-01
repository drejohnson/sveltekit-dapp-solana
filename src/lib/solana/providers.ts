import { browser } from '$app/env';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import type { PhantomWalletAdapterConfig } from '@solana/wallet-adapter-phantom';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import type { SolletWalletAdapterConfig } from '@solana/wallet-adapter-sollet';
import { MathWalletWalletAdapter } from '@solana/wallet-adapter-mathwallet';
import type { MathWalletWalletAdapterConfig } from '@solana/wallet-adapter-mathwallet';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import type { SolflareWalletAdapterConfig } from '@solana/wallet-adapter-solflare';
import { SolongWalletAdapter } from '@solana/wallet-adapter-solong';
import type { SolongWalletAdapterConfig } from '@solana/wallet-adapter-solong';

export enum WalletName {
	Phantom = 'Phantom',
	Sollet = 'Sollet',
	Solflare = 'Solflare',
	SolflareWeb = 'Solflare',
	MathWallet = 'MathWallet',
	Solong = 'Solong'
}

export interface Wallet {
	name: WalletName;
	url: string;
	icon: string;
	adapter: () => WalletAdapter;
}

const ICONS_URL =
	'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons';

const getSolletWallet = (config?: SolletWalletAdapterConfig): Wallet => ({
	name: WalletName.Sollet,
	url: 'https://www.sollet.io',
	icon: `${ICONS_URL}/sollet.svg`,
	adapter: () => new SolletWalletAdapter(config)
});

const getPhantomWallet = (config?: PhantomWalletAdapterConfig): Wallet => ({
	name: WalletName.Phantom,
	url: 'https://www.phantom.app',
	icon: `${ICONS_URL}/phantom.svg`,
	adapter: () => new PhantomWalletAdapter(config)
});

const getSolflareWallet = (config?: SolflareWalletAdapterConfig): Wallet => ({
	name: WalletName.Solflare,
	url: 'https://solflare.com',
	icon: `${ICONS_URL}/solflare.svg`,
	adapter: () => new SolflareWalletAdapter(config)
});

const getSolflareWebWallet = (config?: SolletWalletAdapterConfig): Wallet => ({
	name: WalletName.SolflareWeb,
	url: 'https://solflare.com',
	icon: `${ICONS_URL}/solflare.svg`,
	adapter: () =>
		new SolletWalletAdapter({
			...config,
			provider: config?.provider || 'https://solflare.com/access-wallet'
		})
});

const getSolongWallet = (config?: SolongWalletAdapterConfig): Wallet => ({
	name: WalletName.Solong,
	url: 'https://solongwallet.com',
	icon: `${ICONS_URL}/solong.png`,
	adapter: () => new SolongWalletAdapter(config)
});

const getMathWallet = (config?: MathWalletWalletAdapterConfig): Wallet => ({
	name: WalletName.MathWallet,
	url: 'https://mathwallet.org',
	icon: `${ICONS_URL}/mathwallet.svg`,
	adapter: () => new MathWalletWalletAdapter(config)
});

export const providers: Wallet[] = [
	getPhantomWallet(),
	getSolletWallet(),
	getSolflareWebWallet(),
	getSolongWallet(),
	getMathWallet()
];
