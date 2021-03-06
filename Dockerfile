FROM node:16

WORKDIR /app
COPY package.json .

RUN npm i --production

COPY . .

RUN npm run prisma-generate
RUN npm run build
RUN npm run prisma-migrate-deploy

VOLUME ["/app/session_db.json"]

ENV PORT 3000
EXPOSE $PORT
CMD ["npm", "run", "start"]

# docker build -t freebot .
# docker run -d -p 80:3000 -v freebot_sessions:/app/sessions_db.json --name freebot freebot
