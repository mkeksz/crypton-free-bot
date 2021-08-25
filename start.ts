import Bot from './index'
import config from './config'

const bot = new Bot(config.TOKEN_BOT)

bot.start().then(() => console.info('The bot is running!'))
