export type ToastTypes = 'default' | 'info' | 'success' | 'error';

export interface Toast {
	id?: number;
	type?: ToastTypes;
	dismissible?: boolean;
	duration?: number;
	message: string;
}
