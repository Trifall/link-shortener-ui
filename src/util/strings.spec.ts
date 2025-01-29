import { describe, expect, it } from 'vitest';
import { capitalizeFirstLetter } from './strings';

describe('capitalizeFirstLetter', () => {
	it('should return an empty string if the input is undefined', () => {
		expect(capitalizeFirstLetter(undefined)).toBe('');
	});

	it('should return an empty string if the input is an empty string', () => {
		expect(capitalizeFirstLetter('')).toBe('');
	});

	it('should capitalize the first letter of a simple string', () => {
		expect(capitalizeFirstLetter('hello')).toBe('Hello');
	});

	it('should capitalize the first letter of a string when isError is false', () => {
		expect(capitalizeFirstLetter('hello', false)).toBe('Hello');
	});

	it('should capitalize the first letter after ": " when isError is true', () => {
		expect(capitalizeFirstLetter('error: something went wrong', true)).toBe(
			'error: Something went wrong'
		);
	});

	it('should handle strings without a colon when isError is true', () => {
		expect(capitalizeFirstLetter('something went wrong', true)).toBe('something went wrong');
	});

	it('should handle strings with multiple colons when isError is true', () => {
		expect(capitalizeFirstLetter('error: something: went wrong', true)).toBe(
			'error: Something: went wrong'
		);
	});
});
