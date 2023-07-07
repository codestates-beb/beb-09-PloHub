FROM node:20-alpine3.17

WORKDIR /app

COPY . .

RUN npm install

ENV NODE_ENV=docker

EXPOSE 8080

CMD ["node", "index.js"]