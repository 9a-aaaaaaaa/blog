# syntax=docker/dockerfile:1
FROM node:latest
ENV NODE_ENV=production
WORKDIR /app
# 说这个可以利用缓存的docker层
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . .
CMD [ "node", "server.js" ]