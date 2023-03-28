export class ApiError extends Error {
	message: string
	statusCode: number
	errors: Array<any>

	constructor(message: string, statusCode?: number, errors?: Array<any>) {
		super(message)
		this.message = message
		this.statusCode = statusCode || 500
		this.errors = errors || []
	}
}
