const cluster = (import.meta.env.VITE_RPC_API_URL as string) || 'https://api.devnet.solana.com';
export const walletContextkey = { name: 'walletContext' };

export const solana = {
	cluster
};
