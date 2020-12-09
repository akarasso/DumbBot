import { inject, injectable } from "inversify"
import "reflect-metadata"
import iohook from "iohook"
import LoggerService from "./logger.service"
import { Logger } from "winston"

@injectable()
export default class KeyboardHookService {
    private logger: Logger

    constructor(
        @inject(LoggerService) loggerService: LoggerService,
    ) {
        this.logger = loggerService.get()
        iohook.start()
    }

    public registerAction(
        name: string,
        keys: (string | number)[],
        callback: Function,
        releaseCallback?: Function | undefined,
    ) {
        this.logger.info(`Register action ${ name }`)
        iohook.registerShortcut(
            keys,
            callback,
            releaseCallback,
        )
    }
}