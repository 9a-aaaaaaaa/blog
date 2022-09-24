# syntax=docker/dockerfile:1
# 我自己的
FROM node:latest
ENV NODE_ENV=production
ADD . /code 
WORKDIR /code
RUN npm install 
CMD ["node","app.js"]


# 官方的
# FROM node:12.18.1
# ENV NODE_ENV=production
# EXPOSE 8081
# WORKDIR /app  
# # 说这个可以利用缓存的docker层
# COPY ["package.json", "package-lock.json*", "./"]
# RUN npm install --production
# COPY . .
# CMD [ "node", "server.js" ]