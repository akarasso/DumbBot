import { inject, injectable } from "inversify"
import "reflect-metadata"
import { Logger } from 'winston'
import KeyboardHookService from "../services/keyboard-hook.service"
import LoggerService from "../services/logger.service"

@injectable()
export default class DebugShortcut {
    private logger: Logger

    constructor(
        @inject(LoggerService) private readonly loggerService: LoggerService,
        @inject(KeyboardHookService) private readonly keyboardHookService: KeyboardHookService,
    ) {
        this.logger = loggerService.get()
        this.keyboardHookService.registerAction('debug', [45], this.action)
    }

    private action() {

    }
}