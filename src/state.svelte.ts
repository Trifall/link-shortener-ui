import type { KeyObject } from './types/key';

export const GlobalKeyState = $state<KeyObject>({
	key: '',
	name: '',
	is_active: false,
	is_admin: false,
	created_at: '',
	updated_at: ''
} as KeyObject);

export const ResetKeyState = () => {
	// reset the values of the global state
	GlobalKeyState.key = '';
	GlobalKeyState.name = '';
	GlobalKeyState.is_active = false;
	GlobalKeyState.is_admin = false;
	GlobalKeyState.created_at = '';
	GlobalKeyState.updated_at = '';
};
