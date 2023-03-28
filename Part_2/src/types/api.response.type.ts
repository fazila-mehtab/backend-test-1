export class ApiResponse<T> {
	data?: T
	errored: boolean
	error_message?: string
	errors?: Array<string>

	constructor(errored: boolean, data?: T, errorMessage?: string, errors?: Array<string>) {
		this.errored = errored
		this.data = data
		this.error_message = errorMessage
		this.errors = errors
	}
}
