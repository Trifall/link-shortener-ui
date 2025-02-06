import type { Settings } from '@/types/settings';

const SETTINGS_KEY = 'link-shortener-settings';
const KEY_COOKIE_NAME = 'link-shortener-key';

// Settings localStorage utilities
export const saveSettings = (settings: Settings): void => {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadSettings = (): Settings => {
	const data = localStorage.getItem(SETTINGS_KEY);
	return data ? JSON.parse(data) : { saveKey: false };
};

// Key cookie utilities
export const saveKeyCookie = (key: string): void => {
	const cookieOptions = [
		`${KEY_COOKIE_NAME}=${key}`,
		'path=/',
		`max-age=${60 * 60 * 24 * 365}`, // 1 year
		'SameSite=None', // Ensure the cookie is sent in third-party contexts
		'Secure' // Required when SameSite=None
	].join('; ');

	document.cookie = cookieOptions;
};

// deletes the key_cookie that would be stored in the saveKeyCookie function
export const deleteKeyCookie = (): void => {
	document.cookie = `${KEY_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const loadKeyCookie = (): string | null => {
	if (document && document.cookie) {
		const cookie = document.cookie.split('; ').find((row) => row.startsWith(KEY_COOKIE_NAME));

		return cookie ? cookie.split('=')[1] : null;
	}
	return null;
};
