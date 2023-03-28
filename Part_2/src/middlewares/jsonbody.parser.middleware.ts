import bodyParser from 'body-parser'
import { ApiResponse } from '../types'
import { logger, VALIDATION_ERR_MSGS } from '../utils'
import { NextFunction, Request, Response } from 'express'

// This limit is intended to protect our container from OOM errors in the event a customer attempts
const _bodyParser = bodyParser.json({ limit: '10mb' })

export const jsonBodyParser = (req: Request, res: Response, next: NextFunction) => {
	// Ensure no errors generated when parsing JSON body.
	_bodyParser(req, res, (err) => {
		if (err) {
			// Technically this will intercept any error encountered by bodyParser, so the request
			// size limit configured above will be reported as a HTTP 400 instead of HTTP 413.
			// The log generated here will disambiguate.
			logger.error('malformed request received: ' + err)

			res
				.status(400)
				.json(new ApiResponse<any>(true, undefined, VALIDATION_ERR_MSGS.bodyMustBeWellFormedJSON))
			return
		}

		next()
	})
}
