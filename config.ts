import {config as dotenvConfig} from 'dotenv'

dotenvConfig()

const config = {
  TOKEN_BOT: String(process.env['TOKEN_BOT']),
  WEBHOOK_URL: process.env['WEBHOOK_URL'],
  PORT: process.env['PORT'] ?? '3000',
  TG_ADMIN_ID: Number(process.env['TG_ADMIN_ID'])
}

export default config
