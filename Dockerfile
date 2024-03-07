FROM node:20.11.1-alpine3.18
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY ecosystem.config.js .
COPY .env.development .
COPY ./src ./src
COPY Dockerfile.dev .

RUN apk update && apk add bash
RUN apk add --no-cache ffmpeg
RUN apk add python3
RUN npm install pm2 -g
RUN npm install
RUN npm run build
EXPOSE 4000
CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "development"]