// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { validateKey } from '@/lib/ValidateKey';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('validateKey', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		vi.clearAllMocks();
		// Reset fetch mock
		global.fetch = vi.fn();
	});

	it('should return error for empty passkey', async () => {
		const result = await validateKey('  ');
		expect(result).toEqual({
			success: false,
			error: 'Passkey is required'
		});
	});

	it('should return error for SQL injection attempts', async () => {
		const result = await validateKey("'; DROP TABLE users; --");
		expect(result).toEqual({
			success: false,
			error: 'Invalid characters detected'
		});
	});

	it('should handle successful validation', async () => {
		const mockResponse = {
			key: {
				key: 'valid-key',
				name: 'Test Key',
				is_active: true,
				is_admin: false,
				created_at: '2024-01-29',
				updated_at: '2024-01-29'
			}
		};

		global.fetch = vi.fn().mockImplementationOnce(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			})
		);

		const result = await validateKey('valid-key');
		expect(result).toEqual({
			success: true,
			data: mockResponse
		});
	});

	it('should handle API error with custom message', async () => {
		const errorMessage = 'Invalid key format';
		global.fetch = vi.fn().mockImplementationOnce(() =>
			Promise.resolve({
				ok: false,
				json: () => Promise.resolve({ message: errorMessage })
			})
		);

		const result = await validateKey('invalid-key');
		expect(result).toEqual({
			success: false,
			error: 'Invalid key format'
		});
	});

	it('should handle network errors', async () => {
		global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

		const result = await validateKey('valid-key');
		expect(result).toEqual({
			success: false,
			error: 'Network error'
		});
	});
});
