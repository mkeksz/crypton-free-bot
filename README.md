# Бесплатный бот Crypton Academy

***
## Подготовка к запуску

**Требуется Node.js версия 16.6.0 или новее.**

**Установка зависимостей**

`npm install`

**Генерация клиента для работы с БД**

`npm run prisma-generate`

**Сборка проекта**

`npm run build`

**Миграция базы данных**

`npm run prisma-migrate-deploy`

**Запуск бота**

`npm run start`

Пропишите требуемые переменные среды для настройки бота. Или просто измените название файла `.env.example` на `.env` и пропишите там требуемые значения.
****
### Переменные .env

Примеры заполнения переменных можно увидеть в `.env.example`

`TOKEN_BOT` - Токен вашего Telegram бота.

`DATABASE_URL` - URL базы данных MySQL (примеры можно найти [здесь](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference/#specify-a-mysql-data-source))

`WEBHOOK_URL` - URL адрес с SSL для подключения по webhook (если пустой, то бот будет работать на long polling)

`PORT` - Порт, который будет слушать наш webhook сервер (не требуется, если не указан `WEBHOOK_URL`)

`TG_ADMIN_ID` - ID главного админа в боте Telegram (сможет добавлять других админов)
***
