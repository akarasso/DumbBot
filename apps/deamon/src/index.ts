import dotenv from 'dotenv'
import { Container } from 'inversify'
import { KeyboardHookService } from './services/keyboard-hook.service'
import { DebugShortcut } from './shortcuts/debug.shortcut'
import { container } from './container'
import { IDENTIFIER } from './identifiers'
dotenv.config()

const debugShortcut = container.get<DebugShortcut>(IDENTIFIER.SHORTCUTS.DEBUG)

// console.log(debugShortcut)
console.log('OK', debugShortcut)