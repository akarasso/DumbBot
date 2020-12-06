import { Container } from "inversify";
import { IDENTIFIER } from "../identifiers";
import { KeyboardHookService } from "../services/keyboard-hook.service";
import { DebugShortcut } from "../shortcuts/debug.shortcut";

export const container = new Container()

container.bind<KeyboardHookService>(IDENTIFIER.SERVICES.KEYBOARD_HOOK_SERVICE).to(KeyboardHookService)
container.bind<DebugShortcut>(IDENTIFIER.SHORTCUTS.DEBUG).to(DebugShortcut)
