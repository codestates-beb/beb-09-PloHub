FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install

ENV NODE_ENV=docker

EXPOSE 8080

CMD ["node", "index.js"]