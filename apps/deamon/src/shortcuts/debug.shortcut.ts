import { inject, injectable } from "inversify"
import "reflect-metadata"
import { IDENTIFIER } from "../identifiers"
import { KeyboardHookService } from "../services/keyboard-hook.service"

@injectable()
export class DebugShortcut {
    name = 'DebugShortcut'
    constructor(
        @inject(IDENTIFIER.SERVICES.KEYBOARD_HOOK_SERVICE) keyboardHookService: KeyboardHookService,
    ) {
        console.log(keyboardHookService)
    }

    public debug() {
        console.log(this.name)
    }
}