import { injectable } from 'inversify'
import { stringify } from 'querystring'
import winston, { createLogger, Logger } from 'winston'

@injectable()
export default class LoggerService {
	public logger: Logger

	constructor() {
		const loggers = []
		const format = winston.format.combine(winston.format.json())
		loggers.push(new winston.transports.Console({ format }))
		const urlQuery = stringify({
			ddsource: 'nodejs',
			service: 'DumbBot',
			hostname: process.env.ENV === 'dev' ? process.env.USER : 'prod',
		})
		loggers.push(
			new winston.transports.Http({
				host: 'http-intake.logs.datadoghq.eu',
				path: `/v1/input/935a1a49f47e556e80bde044b0e378bf?${urlQuery}`,
				ssl: true,
			}),
		)
		loggers.push(new winston.transports.File({ filename: './logs/datadog.log' }))
		const level = process.env.ENV === 'dev' ? 'debug' : 'error'
		this.logger = createLogger({
			level,
			exitOnError: false,
			format: winston.format.json(),
			transports: loggers,
		})
	}

	public get() {
		return this.logger
	}
}
