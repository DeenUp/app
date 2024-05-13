export function removeDuplicates<T>(array: T[]): T[] {
	return array.filter(
		(v, i, a) =>
			a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i,
	)
}
