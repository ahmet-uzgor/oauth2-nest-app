FROM node:14-alpine

WORKDIR /app

RUN apk add  --no-cache ffmpeg
RUN npm cache clean --force
RUN npm cache verify


ADD package.json package-lock.json /app/
ADD .development.env /app/
ADD nest-cli.json /app/

ENV NODE_ENV=development

RUN npm install

COPY . /app/

VOLUME [ "/app/src" ]

RUN npm run build
