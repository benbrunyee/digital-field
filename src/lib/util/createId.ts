export function createId(prefix = '') {
	return `${prefix}-${Math.random().toString(36).substring(7)}`;
}
