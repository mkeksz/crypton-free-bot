import {config as dotenvConfig} from 'dotenv'

dotenvConfig()

const config = {
  TOKEN_BOT: String(process.env['TOKEN_BOT'])
}

export default config
