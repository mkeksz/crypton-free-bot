import Bot from '@/src/Bot'
import config from './config'
import express from 'express'

const bot = new Bot(config.TOKEN_BOT)

bot.start(config.WEBHOOK_URL).then(() => console.info('The bot is running!'))

if (config.WEBHOOK_URL) {
  const webhookURL = new URL(config.WEBHOOK_URL)
  const app = express()
  app.use(bot.webhookCallback(webhookURL.pathname))
  app.listen(config.PORT, () => console.info(`Webhook server is running on ${config.PORT} port!`))
}

process.once('SIGINT', stopProcess)
process.once('SIGTERM', stopProcess)

function stopProcess() {
  bot.stop()
  process.exit()
}
