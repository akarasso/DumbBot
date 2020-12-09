import { Container } from "inversify";
import KeyboardHookService from "../services/keyboard-hook.service";
import LoggerService from "../services/logger.service";
import DebugShortcut from "../shortcuts/debug.shortcut";

export const container = new Container()

container.bind<KeyboardHookService>(KeyboardHookService).to(KeyboardHookService)
container.bind<LoggerService>(LoggerService).to(LoggerService)
container.bind<DebugShortcut>(DebugShortcut).to(DebugShortcut)
