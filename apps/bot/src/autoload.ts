import { readdirSync, Stats, statSync } from 'fs'
import { join } from 'path'
import { container } from './container'

const walk = (
    rootDir: string,
    path: string,
    callback: (filePath: string, fileStats: Stats) => void,
) => {
    const files = readdirSync(join(rootDir, path))
    files.forEach((file) => {
        const filePath = join(rootDir, path, file)
        const stats = statSync(join(rootDir, path, file))
        callback(filePath, stats)
    })
}

const rootDir = __dirname
const reMatchExtensionJS = /(.*)(\.js)/
const reMatchAbstract = /abstract/

walk(rootDir, 'actions', (filePath, stats) => {
    if (stats.isDirectory()) {
        return
    }
    if (filePath.match(reMatchAbstract) !== null) {
        return
    }
    if (stats.isFile()) {
        const reResult = filePath.match(reMatchExtensionJS)
        if (reResult !== null) {
            const requirePath = reResult[1]
            const shortcut = require(requirePath)
            container.get(shortcut.default)
        }
    }
})
