import { useMachine } from '@xstate/svelte';
import { walletMachine } from '$lib/wallet.machine';
import {
	p_autoConnect,
	p_publicKey,
	p_walletName
} from '$lib/stores/localStorage';

const persistedMachine = walletMachine.withConfig({
	actions: {
		persist: (state) => {
			try {
				p_autoConnect.set(state.autoConnect);
				p_walletName.set(state.walletName);
				p_publicKey.set(state.publicKey.toBase58());
			} catch (e) {
				console.error(e);
			}
		}
	}
});

const { state, send } = useMachine(persistedMachine);

export { state, send };
