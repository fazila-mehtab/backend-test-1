import { Request, Response, NextFunction } from 'express'
import { RESPONSE_TIME_HEADER } from '../utils'

export const appendResponseTime = (req: Request, res: Response, next: NextFunction) => {
	var starTimeMs = Date.now()

	let oldSend = res.send

	res.send = function (data) {
		res.set(RESPONSE_TIME_HEADER, (Date.now() - starTimeMs).toString())

		res.send = oldSend

		return res.send(data)
	}

	next()
}
