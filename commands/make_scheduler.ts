import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeScheduler extends BaseCommand {
  static commandName = 'make:scheduler'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "MakeScheduler"')
  }
}