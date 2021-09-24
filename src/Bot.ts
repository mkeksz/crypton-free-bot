import LocalSession from 'telegraf-session-local'
import {Scenes, Telegraf} from 'telegraf'
import {BotContext, WebhookCallback} from '@/src/types/telegraf'
import {loadScenes} from '@/src/util/scenesLoader'
import {errorHandler} from '@/src/middlewares/errorHandler'

export default class Bot {
  private telegraf

  public constructor(tokenBot: string) {
    this.telegraf = new Telegraf<BotContext>(tokenBot)
  }

  public async launch(webhookURL?: string): Promise<void> {
    await this.startHandlingEvents()

    if (webhookURL) await this.telegraf.telegram.setWebhook(webhookURL)
    else {
      await this.telegraf.telegram.deleteWebhook()
      await this.telegraf.launch()
    }
  }

  private async startHandlingEvents(): Promise<void> {
    const scenes = await loadScenes()
    const stage = new Scenes.Stage(scenes)
    const localSession = new LocalSession({database: 'sessions_db.json'})

    this.telegraf.use(localSession.middleware())
    this.telegraf.use(stage.middleware())
    this.telegraf.use(errorHandler())
    this.telegraf.command('start', async ctx => {
      await ctx.scene.enter('start')
    })
    this.telegraf.command('saveme', async ctx => {
      await ctx.scene.reset()
      // TODO возврат в главное меню
      await ctx.reply('Сброс')
    })
  }

  public webhookCallback(path: string): WebhookCallback {
    return this.telegraf.webhookCallback(path)
  }

  public stop(reason?: string): void {
    this.telegraf.stop(reason)
  }
}
