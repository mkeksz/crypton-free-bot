FROM node:16

WORKDIR /app
COPY package.json .

RUN npm i --production

COPY . .

RUN npm run prisma-generate
RUN npm run build
RUN npm run prisma-migrate-deploy

ENV PORT 3000
EXPOSE $PORT
CMD ["npm", "run", "start"]
