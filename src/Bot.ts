import LocalSession from 'telegraf-session-local'
import {Scenes, Telegraf} from 'telegraf'
import {BotContext, WebhookCallback} from '@/src/types/telegraf'
import {errorHandler} from '@/src/middlewares/errorHandler'
import {onlyPrivate} from '@/src/middlewares/onlyPrivate'
import {loadScenes} from '@/src/util/scenesLoader'
import {goToMainMenu} from '@/src/util/mainMenu'
import locales from './locales/ru.json'

export default class Bot {
  private telegraf

  public constructor(tokenBot: string) {
    this.telegraf = new Telegraf<BotContext>(tokenBot)
  }

  public async start(webhookURL?: string): Promise<void> {
    await this.startHandlingEvents()
    await this.launch(webhookURL)
  }

  private async startHandlingEvents(): Promise<void> {
    await this.useMiddlewares()
    this.telegraf.command('start', async ctx => {
      await ctx.reply(locales.other.start)
      await goToMainMenu(ctx)
    })
    this.telegraf.command('saveme',  async ctx => {
      ctx.scene.reset()
      await goToMainMenu(ctx)
    })
    this.telegraf.help(async ctx => {
      await ctx.reply(locales.other.help)
      await goToMainMenu(ctx)
    })
    this.telegraf.command('test', ctx => {
      ctx.scene.enter('start')
    })
  }

  private async useMiddlewares(): Promise<void> {
    const scenes = await loadScenes()
    const stage = new Scenes.Stage(scenes)
    const localSession = new LocalSession({database: 'sessions_db.json'})
    this.telegraf.use(localSession.middleware())
    this.telegraf.use(stage.middleware())
    this.telegraf.use(errorHandler())
    this.telegraf.use(onlyPrivate())
  }

  private async launch(webhookURL?: string): Promise<void> {
    if (webhookURL) await this.telegraf.telegram.setWebhook(webhookURL)
    else {
      await this.telegraf.telegram.deleteWebhook()
      await this.telegraf.launch()
    }
  }

  public webhookCallback(path: string): WebhookCallback {
    return this.telegraf.webhookCallback(path)
  }

  public stop(reason?: string): void {
    this.telegraf.stop(reason)
  }
}
