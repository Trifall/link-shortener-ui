import { GlobalKeyState } from '../state.svelte';
import type { KeyObject } from '../types/key';

export const IsValidKeyState = () => {
	return (
		GlobalKeyState.is_active &&
		GlobalKeyState.key !== '' &&
		GlobalKeyState.name !== '' &&
		GlobalKeyState.created_at !== ''
	);
};

export const UpdateKeyState = (key: KeyObject) => {
	GlobalKeyState.key = key.key;
	GlobalKeyState.name = key.name;
	GlobalKeyState.is_active = key.is_active;
	GlobalKeyState.is_admin = key.is_admin;
	GlobalKeyState.created_at = key.created_at;
	GlobalKeyState.updated_at = key.updated_at;
};
