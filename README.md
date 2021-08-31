# Бесплатный бот Crypton Academy

***

## Подготовка к запуску

**Требуется Node.js версия 16.6.0 или новее.**

**Установка зависимостей**

`npm install`

**Сборка проекта**

`npm run build`

**Миграция базы данных**

`npm run prisma-migrate-deploy`

**Запуск бота**

`npm run start`

Пропишите требуемые переменные среды для настройки бота. Или просто измените название файла `.env.example` на `.env` и пропишите там требуемые значения. Глобальные переменные будут иметь приоритет перед переменными в `.env`

****

### Переменные .env

`TOKEN_BOT` - Токен вашего Telegram бота.

`DATABASE_URL` - URL базы данных MySQL (примеры можно найти [здесь](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference/#specify-a-mysql-data-source))

***
