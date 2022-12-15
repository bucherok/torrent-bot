import { log } from "./log"

const shell = require('shelljs')

export class TorrentCli {

    static strToValues(string: string): (string | number)[] {
        return string.split('  ').filter(Boolean).map(v => {
            let val = parseInt(v)
            if (isNaN(val)) {
                val = parseInt(v.split('MB')[0])
                if (isNaN(val)) {
                    return v.toLowerCase().trim()
                }
            }
            return val

        })
    }

    static getTorrents() {
        const stdout = this.command('transmission-remote -l')

        const [header, ...torrents] = stdout.split('\n')

        const keys = this.strToValues(header) as string[]

        return torrents.map(torrentStr => {
            return this.strToValues(torrentStr).reduce((acc, val, keyIndex) => {
                const key = keys[keyIndex]
                acc[key] = val
                return acc
            }, {} as Record<string, any>)
        }).slice(0, torrents.length - 2)

    }


    static command(command: string, opts = { fatal: true, silent: true }): string {
        log(`CLI > ${command}`)

        const { stderr, stdout } = shell.exec(command, opts)
        if (stderr) {
            throw new Error(stderr)
        }

        return stdout

    }
}