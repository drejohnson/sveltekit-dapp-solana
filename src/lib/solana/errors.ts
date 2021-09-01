import { WalletError } from '@solana/wallet-adapter-base';

export class WalletNotSelectedError extends WalletError {}

export const onError = (error: WalletError) => {
	console.log(error.message ? `${error.name}: ${error.message}` : error.name);
	console.error(error);
};
