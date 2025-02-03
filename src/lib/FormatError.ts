export const FormatError = (err: string): string => {
	if (!err || typeof err !== 'string') {
		throw new Error('Input must be a non-empty string');
	}

	const [first, ...rest] = err.split(' ');

	if (!first) {
		return rest.join(' ');
	}

	let formattedFirst = first;

	if (formattedFirst.includes('_')) {
		// replace all underscores with spaces
		formattedFirst = formattedFirst.replace(/_/g, ' ');

		// capitalize the first letter of each word
		formattedFirst = formattedFirst
			.split(' ')
			.map((word) => {
				if (word.toLowerCase().includes('url')) {
					return word.toUpperCase();
				}
				return word.charAt(0).toUpperCase() + word.slice(1);
			})
			.join(' ');
	} else {
		// capitalize the first letter of the first word
		formattedFirst = formattedFirst.charAt(0).toUpperCase() + formattedFirst.slice(1);
	}

	return formattedFirst + (rest.length > 0 ? ' ' + rest.join(' ') : '');
};
