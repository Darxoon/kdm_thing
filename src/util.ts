export function assert(condition: boolean, message?: string) {
	if (condition)
		return
	
	if (message) {
		throw new Error("Assertion failed: " + message)
	} else {
		throw new Error("Assertion failed.")
	}
}
