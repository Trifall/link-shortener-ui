export const capitalizeFirstLetter = (str: string | undefined, isError?: boolean): string => {
	if (!str) return '';
	if (!isError) return str.charAt(0).toUpperCase() + str.slice(1);
	// split after ": ", then capitalize the first letter in the 2nd part
	const parts = str.split(': ');
	return parts[0] + ': ' + parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
};
