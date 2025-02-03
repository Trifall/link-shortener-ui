import type { Settings } from '@/types/settings';

const SETTINGS_KEY = 'link-shortener-settings';
const KEY_COOKIE_NAME = 'link-shortener-key';

// Settings localStorage utilities
export const saveSettings = (settings: Settings): void => {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadSettings = (): Settings => {
	const data = localStorage.getItem(SETTINGS_KEY);
	return data ? JSON.parse(data) : { saveKey: true };
};

// Key cookie utilities
export const saveKeyCookie = (key: string): void => {
	console.log(`Saving key cookie: ${key}`);
	document.cookie = `${KEY_COOKIE_NAME}=${key}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
};

// deletes the key_cookie that would be stored in the saveKeyCookie function
export const deleteKeyCookie = (): void => {
	console.log(`Deleting key cookie`);
	document.cookie = `${KEY_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const loadKeyCookie = (): string | null => {
	const cookie = document.cookie.split('; ').find((row) => row.startsWith(KEY_COOKIE_NAME));

	console.log(`loading key cookie: ${cookie?.split('=')?.[1] ?? null}`);
	return cookie ? cookie.split('=')[1] : null;
};
