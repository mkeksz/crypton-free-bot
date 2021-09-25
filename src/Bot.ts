import LocalSession from 'telegraf-session-local'
import {Scenes, Telegraf} from 'telegraf'
import {BotContext, WebhookCallback} from '@/src/types/telegraf'
import {onlyPrivate} from '@/src/middlewares/onlyPrivate'
import {loadScenes} from '@/src/util/scenesLoader'
import {goToMainMenu} from '@/src/util/mainMenu'
import locales from './locales/ru.json'
import {getDiscordInlineKeyboard} from '@/src/util/inlineKeyboards'
import {addStorageToContext} from '@/src/middlewares/addStorageToContext'
import {updateUserOfStorage} from '@/src/middlewares/updateUserOfStorage'
import Storage from '@/src/Storage/Storage'

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
    this.telegraf.start(async ctx => {
      await ctx.reply(locales.other.start)
      await goToMainMenu(ctx)
    })
    this.telegraf.help(async ctx => {
      await ctx.reply(locales.other.help)
      await goToMainMenu(ctx)
    })
    this.telegraf.command('saveme',  ctx => {
      ctx.scene.reset()
      goToMainMenu(ctx)
    })
    this.telegraf.hears(locales.keyboards.main_keyboard.discord, ctx => {
      ctx.reply(locales.other.discord, getDiscordInlineKeyboard())
    })
    this.telegraf.hears(locales.keyboards.main_keyboard.ecosystem, ctx => {
      ctx.reply(locales.other.ecosystem_html, {parse_mode: 'HTML'})
    })
    this.telegraf.hears(locales.keyboards.main_keyboard.calendar, ctx => {
      ctx.reply(locales.other.calendar_html, {parse_mode: 'HTML'})
    })
    this.telegraf.hears(locales.keyboards.main_keyboard.support, ctx => {
      ctx.reply(locales.other.support_html, {parse_mode: 'HTML'})
    })
    this.telegraf.hears(locales.keyboards.main_keyboard.chat, ctx => {
      ctx.reply(locales.other.chat_html, {parse_mode: 'HTML'})
    })
    this.telegraf.hears(locales.keyboards.main_keyboard.nft, ctx => {
      ctx.reply(locales.other.nft_html, {parse_mode: 'HTML'})
    })
    this.telegraf.hears(locales.keyboards.main_keyboard.training, ctx => {
      ctx.scene.enter('trainingSections')
    })
    this.telegraf.on('text', async ctx => {
      await ctx.reply(locales.shared.unknown_command)
      await goToMainMenu(ctx)
    })
    this.telegraf.action(/^.*/, ctx => {
      ctx.answerCbQuery(locales.shared.old_button, {show_alert: true})
    })
    this.telegraf.catch((error, ctx) => {
      console.error(ctx, error)
      ctx.reply(locales.shared.something_went_wrong)
    })
  }

  private async useMiddlewares(): Promise<void> {
    const localSession = new LocalSession({database: 'sessions_db.json'})
    this.telegraf.use(localSession.middleware())
    const scenes = await loadScenes()
    const stage = new Scenes.Stage(scenes)
    this.telegraf.use(stage.middleware())
    this.telegraf.use(onlyPrivate())
    const storage = new Storage()
    this.telegraf.use(addStorageToContext(storage))
    this.telegraf.use(updateUserOfStorage())
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
