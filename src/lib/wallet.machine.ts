import { get } from 'svelte/store';
import type { PublicKey } from '@solana/web3.js';
import type { ContextFrom, EventFrom, ExtractEvent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import type { WalletAdapter } from '@solana/wallet-adapter-base';
import type { Wallet, WalletName } from '$lib/solana/providers';
import { getBalance, newWalletAdapter } from '$lib/solana/wallet';
import {
	p_walletName,
	p_autoConnect,
	p_publicKey
} from '$lib/stores/localStorage';
import type { WalletError } from '@solana/wallet-adapter-base';

export type WalletMachineContext = ContextFrom<typeof walletModel>;
export type WalletMachineEvent = EventFrom<typeof walletModel>;

const walletModel = createModel(
	// Initial context
	{
		walletName: null as WalletName | string,
		wallet: null as WalletAdapter,
		publicKey: null as PublicKey,
		balance: 0,
		autoConnect: false,
		error: null
	},
	{
		// Event creators
		events: {
			AUTO_CONNECT: () => ({}),
			TOGGLE_AUTO_CONNECT: (value: boolean) => ({ value }),
			SELECT_WALLET: (value: Wallet) => ({ value }),
			CONNECT: (value: WalletName | string) => ({ value }),
			SET_WALLET_INFO: (data: {
				wallet?: WalletAdapter;
				walletName?: WalletName;
				publicKey?: PublicKey;
				balance?: number;
				error?: WalletError;
			}) => ({ data }),
			DISCONNECT: () => ({})
		}
	}
);

const connectWallet = async (
	_: WalletMachineContext,
	event: ExtractEvent<WalletMachineEvent, 'CONNECT'>
) => {
	const walletName =
		get(p_autoConnect) === true ? get(p_walletName) : event.value;
	const wallet = await newWalletAdapter(walletName);

	await wallet.connect();
	const balance = await getBalance(wallet.publicKey);
	return { wallet, walletName, publicKey: wallet.publicKey, balance };
};

const disconnectWallet = async (context, _) => {
	await context.wallet?.disconnect();
	p_walletName.set(null);
	p_autoConnect.set(false);
	p_publicKey.set(null);
	return { wallet: null, walletName: null, publicKey: null, balance: 0 };
};

const toggleAutoConnect = walletModel.assign(
	{
		autoConnect: (_, event) => (event.value = !event.value)
	},
	'TOGGLE_AUTO_CONNECT'
);

const setWalletInfo = walletModel.assign(
	{
		walletName: (_, event) => event.data?.walletName,
		publicKey: (_, event) => event.data?.publicKey,
		balance: (_, event) => event.data?.balance,
		wallet: (_, event) => event.data?.wallet
	},
	'SET_WALLET_INFO'
);

const setWalletError = walletModel.assign(
	{
		error: (_, event) => event.data
	},
	'SET_WALLET_INFO'
);

export const walletMachine = walletModel.createMachine({
	id: 'wallet',
	initial: 'checkIfAutoConnect',
	context: walletModel.initialContext,
	on: {
		TOGGLE_AUTO_CONNECT: {
			actions: [toggleAutoConnect, 'persist']
		}
	},
	states: {
		checkIfAutoConnect: {
			always: [
				{
					target: 'connecting',
					cond: (context, _) => get(p_autoConnect) === true
				},
				{ target: 'disconnecting' }
			]
		},
		connecting: {
			invoke: {
				id: 'connect',
				src: connectWallet,
				onDone: {
					target: 'connected',
					actions: [setWalletInfo]
				},
				onError: {
					target: 'disconnected',
					actions: [
						setWalletError,
						(_, event) => console.log('onError', event.data)
					]
				}
			}
		},
		connected: {
			on: {
				DISCONNECT: {
					target: 'disconnecting'
				}
			}
		},
		disconnecting: {
			invoke: {
				src: disconnectWallet,
				id: 'disconnecting-wallet',
				onDone: {
					target: 'disconnected',
					actions: [setWalletInfo]
				},
				onError: {
					target: 'disconnected',
					actions: [() => console.log('onError')]
				}
			}
		},

		disconnected: {
			initial: 'ok',
			states: {
				ok: { type: 'final' },
				failed: {}
			},
			on: {
				CONNECT: {
					target: 'connecting'
				}
			}
		}
	}
});
