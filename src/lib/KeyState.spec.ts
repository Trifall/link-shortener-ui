import type { KeyObject } from '@/types/key';
import { beforeEach, describe, expect, it } from 'vitest';
import { GlobalKeyState, IsValidKeyState, ResetKeyState, UpdateKeyState } from './KeyState.svelte';

describe('KeyState', () => {
	beforeEach(() => {
		// Reset state before each test
		ResetKeyState();
	});

	describe('GlobalKeyState', () => {
		it('should initialize with default empty values', () => {
			expect(GlobalKeyState).toEqual({
				key: '',
				name: '',
				is_active: false,
				is_admin: false,
				created_at: '',
				updated_at: ''
			});
		});
	});

	describe('IsValidKeyState', () => {
		it('should return false for default state', () => {
			expect(IsValidKeyState()).toBe(false);
		});

		it('should return false if only some fields are filled', () => {
			GlobalKeyState.key = 'test-key';
			GlobalKeyState.name = 'Test Key';
			expect(IsValidKeyState()).toBe(false);
		});

		it('should return false if is_active is false but other fields are valid', () => {
			GlobalKeyState.key = 'test-key';
			GlobalKeyState.name = 'Test Key';
			GlobalKeyState.created_at = '2024-01-29';
			GlobalKeyState.is_active = false;
			expect(IsValidKeyState()).toBe(false);
		});

		it('should return true when all required fields are filled and is_active is true', () => {
			GlobalKeyState.key = 'test-key';
			GlobalKeyState.name = 'Test Key';
			GlobalKeyState.created_at = '2024-01-29';
			GlobalKeyState.is_active = true;
			expect(IsValidKeyState()).toBe(true);
		});
	});

	describe('UpdateKeyState', () => {
		it('should update all fields with provided key object', () => {
			const testKey: KeyObject = {
				key: 'test-key',
				name: 'Test Key',
				is_active: true,
				is_admin: true,
				created_at: '2024-01-29',
				updated_at: '2024-01-29'
			};

			UpdateKeyState(testKey);

			expect(GlobalKeyState).toEqual(testKey);
		});

		it('should handle partial updates', () => {
			const partialKey = {
				key: 'test-key',
				name: 'Test Key',
				is_active: true,
				is_admin: false,
				created_at: '2024-01-29',
				updated_at: ''
			} as KeyObject;

			UpdateKeyState(partialKey);

			expect(GlobalKeyState).toEqual(partialKey);
		});
	});

	describe('ResetKeyState', () => {
		it('should reset all fields to default values', () => {
			// First set some values
			const testKey: KeyObject = {
				key: 'test-key',
				name: 'Test Key',
				is_active: true,
				is_admin: true,
				created_at: '2024-01-29',
				updated_at: '2024-01-29'
			};

			UpdateKeyState(testKey);

			// Then reset
			ResetKeyState();

			expect(GlobalKeyState).toEqual({
				key: '',
				name: '',
				is_active: false,
				is_admin: false,
				created_at: '',
				updated_at: ''
			});
		});
	});
});
