type ToastOptions = {
	text?: string;
	duration?: number;
	type?: 'success' | 'error' | 'info' | 'warning';
};

export const toastState = $state({
	show: false,
	text: '',
	duration: 5000,
	type: 'success'
});

let toastTimeout = $state<number | undefined>();

export function showToast(textOrOptions: string | ToastOptions) {
	console.log(`showing`);
	const options = typeof textOrOptions === 'string' ? { text: textOrOptions } : textOrOptions;

	toastState.text = options.text ?? '';
	toastState.duration = options.duration ?? 5000;
	toastState.type = options.type ?? 'success';
	toastState.show = true;

	if (toastTimeout) clearTimeout(toastTimeout);
	toastTimeout = setTimeout(() => {
		toastTimeout = undefined;
		toastState.show = false;
	}, toastState.duration);
}
