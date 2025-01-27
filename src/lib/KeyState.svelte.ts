import type { KeyObject } from '../types/key';

export const GlobalKeyState = $state<KeyObject>({
	key: '',
	name: '',
	is_active: false,
	is_admin: false,
	created_at: '',
	updated_at: ''
} as KeyObject);

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

export const ResetKeyState = () => {
	// reset the values of the global state
	GlobalKeyState.key = '';
	GlobalKeyState.name = '';
	GlobalKeyState.is_active = false;
	GlobalKeyState.is_admin = false;
	GlobalKeyState.created_at = '';
	GlobalKeyState.updated_at = '';
};
