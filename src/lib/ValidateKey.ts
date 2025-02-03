import { PUBLIC_API_URL as API_URL } from '$env/static/public';
import type { ValidateKeyResponse } from '@/types/key';
import { capitalizeFirstLetter } from '@/util/strings';

export interface ValidationResult {
	success: boolean;
	error?: string;
	data?: ValidateKeyResponse;
}

export const validateKey = async (inputKey: string): Promise<ValidationResult> => {
	const cleanedKey = inputKey.trim();

	// Input validation
	if (!cleanedKey) {
		return {
			success: false,
			error: 'Passkey is required'
		};
	}

	// SQL injection check
	const sqlInjectionPattern = /(['";\\]+|--|\.\.)/;
	if (sqlInjectionPattern.test(cleanedKey)) {
		return {
			success: false,
			error: 'Invalid characters detected'
		};
	}

	try {
		const response = await fetch(`${API_URL}/api/v1/keys/validate`, {
			method: 'POST',
			headers: {
				Authorization: cleanedKey
			}
		});

		const responseData: ValidateKeyResponse = await response.json();

		if (!response.ok) {
			const errorMessage =
				responseData?.message && responseData?.message?.length > 0
					? capitalizeFirstLetter(responseData.message, true)
					: 'Invalid passkey';

			return {
				success: false,
				error: errorMessage
			};
		}

		if (!responseData.key || responseData.key?.key?.length === 0) {
			return {
				success: false,
				error: 'Validation failed'
			};
		}

		return {
			success: true,
			data: responseData
		};
	} catch (err) {
		return {
			success: false,
			error:
				capitalizeFirstLetter((err as Error).message, true) ||
				'Failed to validate passkey. Please try again.'
		};
	}
};
