export const capitalizeFirstLetter = (str: string | undefined, isError?: boolean): string => {
	if (!str) return '';

	if (!isError) return str.charAt(0).toUpperCase() + str.slice(1);

	// For error messages, only modify if there's a ': ' pattern
	if (!str.includes(': ')) return str;

	const [prefix, ...rest] = str.split(': ');
	const remainingText = rest.join(': '); // Handle multiple colons
	return `${prefix}: ${remainingText.charAt(0).toUpperCase()}${remainingText.slice(1)}`;
};
