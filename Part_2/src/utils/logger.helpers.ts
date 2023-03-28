import winston from 'winston'
import { appConfig } from '../config'

export const logger: winston.Logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp(),
		...(appConfig.isDev
			? [winston.format.colorize(), winston.format.simple()]
			: [winston.format.json()])
	),
	transports: [new winston.transports.Console()],
})
