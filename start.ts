import Bot from './index'
import config from './config'
import express from 'express'

const bot = new Bot(config.TOKEN_BOT, config.WEBHOOK_URL)

bot.start().then((isWebhook) => {
  console.info('The bot is running!')
  if (isWebhook) console.info('Webhook is launch!')
  process.once('SIGINT', () => bot.stop())
  process.once('SIGTERM', () => bot.stop())
})

if (config.WEBHOOK_URL) {
  const webhookURL = new URL(config.WEBHOOK_URL)
  const app = express()
  app.use(bot.webhookCallback(webhookURL.pathname))
  app.listen(config.PORT, () => console.info(`Webhook is running on ${config.PORT} port!`))
}
