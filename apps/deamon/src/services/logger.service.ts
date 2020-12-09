import { injectable } from "inversify"
import winston, { createLogger, Logger } from 'winston'

@injectable()
export default class LoggerService {

    private logger: Logger

    constructor() {
        const loggers = []
        const format = winston.format.combine(
            winston.format.json(),
            winston.format.prettyPrint(),
        )
        loggers.push(new winston.transports.Console({ format }))
        this.logger = createLogger({
            defaultMeta: {
                service: 'Bot discord client deamon',
            },
            transports: loggers,
        })
    }

    public get() {
        return this.logger
    }

}
