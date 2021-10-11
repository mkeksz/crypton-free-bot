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

`TG_ADMIN_ID` - ID главных админов (могут добавлять других админов). Указывать в виде массива, пример: [1033924450, 4556774, 1223456765] 

(Узнать ID пользователя можно через TG бота @getmyid_bot)
***

# Инструкция по администрированию

### Команды

`/admin` - Открывает админ-панель, где можно изменять все элементы обучения. (Доступно только админам)

`/add_admin <user_id>` - Добавляет пользователя в админы. (Доступно только главным админам)

`/remove_admin <user_id>` - Убирает пользователя из админов. (Доступно только главным админам)

`/admins` - Список всех админов кроме главных. (Доступно только главным админам)
