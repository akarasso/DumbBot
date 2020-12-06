import { injectable } from "inversify"
import "reflect-metadata"
import iohook from "iohook"

@injectable()
export class KeyboardHookService {
    constructor() {
        iohook.start()
    }

    public registerAction(
        name: string,
        keys: (string | number)[],
        callback: Function,
        releaseCallback?: Function | undefined,
    ) {
        console.log('Register new action' + name)
        iohook.registerShortcut(
            keys,
            callback,
            releaseCallback,
        )
    }
}