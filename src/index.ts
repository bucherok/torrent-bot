const dotenv = require('dotenv')
const BotFather = require('botfather')
const env = dotenv.config({ path: `${__dirname}/.env` })

import { TorrentCli } from "./cli"
class MyBot extends BotFather {

  /**
   * @constructor
   * @param {string} token 
   * @see https://core.telegram.org/bots#6-botfather
   */
  constructor(token: string) {
    super(token)
    this.getUpdates()
  }

  /**
   * @param {Object} parameters 
   * @see https://core.telegram.org/bots/api#getupdates
   */
  getUpdates(parameters = { limit: 100, timeout: 60 * 2, offset: 0 }) {
    this.api('getUpdates', parameters)
      .then((json: { ok: any; result: any; description: any }) => {
        if (json.ok) {
          return json.result
        }
        console.error(json.description)
        setTimeout(() => this.getUpdates(parameters), 5000)
      })
      .then((updates: any[]) => {
        for (let update of updates) {
          this.onReceiveUpdate(update)
        }
        // offset = update_id of last processed update + 1
        if (updates.length > 0) {
          const identifiers = updates.map((update: { update_id: any }) => update.update_id)
          parameters.offset = Math.max.apply(Math, identifiers) + 1
        }
        this.getUpdates(parameters)
      })
      .catch((exception: { stack: any }) => {
        console.error(exception.stack)
        setTimeout(() => this.getUpdates(parameters), 5000)
      })
  }

  /**
   * @param {Object} update 
   * @see https://core.telegram.org/bots/api#update
   */
  onReceiveUpdate(update: any) {
    console.log(update)
  }

  addTorrent({ magnet, file }: { magnet?: string; file?: string }) {

  }
  // callCommand(command: string) {
  //   const { stdout, stderr } = exec('command')
  //   console.log(stdout)
  //   console.log(stderr)
  // }

}

debugger

// new MyBot(process.env.BOT_TOKEN!)

console.log(TorrentCli.getTorrents())