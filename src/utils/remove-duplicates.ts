export function removeDuplicates(arr: any[]): any[] {
	return arr.filter((value, index) => arr.indexOf(value) === index)
}
