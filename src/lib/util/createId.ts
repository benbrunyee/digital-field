export function createId(prefix = '') {
	// If prefix doesn't start with a letter, add a letter
	if (!/^[a-z]/i.test(prefix)) {
		prefix = 'a' + prefix;
	}

	return `${prefix}-${Math.random().toString(36).substring(7)}`;
}
