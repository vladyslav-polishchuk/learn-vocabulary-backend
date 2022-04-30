FROM node:12-slim

WORKDIR /usr/src/app

COPY dist ./
COPY package*.json ./

CMD [ "cd", "dist" ]
RUN npm i

EXPOSE 8080

CMD [ "node", "index.js" ]