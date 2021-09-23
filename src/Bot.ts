import LocalSession from 'telegraf-session-local'
import {Scenes, Telegraf} from 'telegraf'
import {WebhookCallback} from '@/src/types/telegraf'
import {loadScenes} from '@/src/util/scenesLoader'

export default class Bot {
  private telegraf

  public constructor(tokenBot: string) {
    this.telegraf = new Telegraf<Scenes.SceneContext>(tokenBot)
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
    this.telegraf.use((new LocalSession({database: 'sessions_db.json'})).middleware())
    this.telegraf.use(stage.middleware())
    this.telegraf.command('start', ctx => ctx.scene.enter('start'))
  }

  public webhookCallback(path: string): WebhookCallback {
    return this.telegraf.webhookCallback(path)
  }

  public stop(reason?: string): void {
    this.telegraf.stop(reason)
  }
}
