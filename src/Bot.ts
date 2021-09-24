import LocalSession from 'telegraf-session-local'
import {Scenes, Telegraf} from 'telegraf'
import {BotContext, WebhookCallback} from '@/src/types/telegraf'
import {loadScenes} from '@/src/util/scenesLoader'
import {errorHandler} from '@/src/middlewares/errorHandler'
import {getMainKeyboard} from '@/src/util/keyboards'

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
    // TODO middleware на фильтр групповых чатов, каналов и т.д. Только личные сообщения от людей.
    this.telegraf.command('start', ctx => {
      ctx.reply('Главное меню', getMainKeyboard())
      // ctx.scene.enter('start')
    })
    this.telegraf.help(async ctx => {
      ctx.reply('❓ Нажми на иконку в правом нижнем углу чтобы открыть Telegram-клавиатуру и выбери раздел, в который ты хочешь попасть.')
      // TODO возврат в главное меню
    })
    this.telegraf.command('saveme',  ctx => {
      ctx.scene.reset()
      // TODO возврат в главное меню
      ctx.reply('Сброс')
    })
  }

  public webhookCallback(path: string): WebhookCallback {
    return this.telegraf.webhookCallback(path)
  }

  public stop(reason?: string): void {
    this.telegraf.stop(reason)
  }
}
