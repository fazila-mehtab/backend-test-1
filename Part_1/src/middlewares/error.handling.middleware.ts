import { Request, Response, NextFunction } from 'express'
import { ApiError, ApiResponse } from '../types'
import { DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_STATUS_CODE } from '../utils'
import { logger } from '../utils'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	var statusCode: number = DEFAULT_ERROR_STATUS_CODE
	var errorMessage: string = DEFAULT_ERROR_MESSAGE
	var errors: Array<any> = []

	if (err instanceof ApiError) {
		const apiError = err as ApiError

		statusCode = apiError.statusCode
		errorMessage = apiError.message
		errors = apiError.errors
	}

	logger.error('Error handler received error', { error: err })

	const errorResponse = new ApiResponse<any>(true, null, errorMessage, errors)

	res.status(statusCode).json(errorResponse)

	return
}
