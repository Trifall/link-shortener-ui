/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';
import { FormatError } from './FormatError';

describe('FormatError', () => {
	it('should throw an error if input is not a string', () => {
		expect(() => FormatError(null as any)).toThrow('Input must be a non-empty string');
		expect(() => FormatError(undefined as any)).toThrow();
		expect(() => FormatError(123 as any)).toThrow();
		expect(() => FormatError({} as any)).toThrow();
	});

	it('should throw an error if input is an empty string', () => {
		expect(() => FormatError('')).toThrow('Input must be a non-empty string');
	});

	it('should return the remaining string if the first word is empty', () => {
		expect(FormatError('   test')).toBe('  test');
		expect(FormatError('   ')).toBe('  ');
	});

	it('should replace underscores with spaces and capitalize each word in the first part', () => {
		expect(FormatError('invalid_url')).toBe('Invalid URL');
		expect(FormatError('bad_request_error')).toBe('Bad Request Error');
		expect(FormatError('hello_there_world')).toBe('Hello There World');
	});

	it('should convert URL parts to uppercase in the first word', () => {
		expect(FormatError('check_url')).toBe('Check URL');
		expect(FormatError('url_error')).toBe('URL Error');
		expect(FormatError('get_url_from_here')).toBe('Get URL From Here');
	});

	it('should uppercase any occurrence of URL regardless of case in the first word', () => {
		expect(FormatError('check_Url')).toBe('Check URL');
		expect(FormatError('my_URL_is_broken')).toBe('My URL Is Broken');
	});

	it('should capitalize the first letter of the first word without underscores', () => {
		expect(FormatError('hello')).toBe('Hello');
		expect(FormatError('hello world')).toBe('Hello world');
		expect(FormatError('alreadyCapitalized')).toBe('AlreadyCapitalized');
	});

	it('should leave the rest of the string unchanged', () => {
		expect(FormatError('error_code some additional info')).toBe('Error Code some additional info');
		expect(FormatError('first_word has_underscore')).toBe('First Word has_underscore');
	});

	it('should handle multiple underscores in the first word', () => {
		expect(FormatError('hello__there')).toBe('Hello  There');
		expect(FormatError('__test__')).toBe('  Test  ');
	});
});
