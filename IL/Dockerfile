FROM node:20.5.1

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY  . .

CMD ["yarn", "dev"]
