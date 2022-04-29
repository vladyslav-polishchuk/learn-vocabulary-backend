FROM node:12

WORKDIR /usr/src/app

COPY dist ./
COPY package*.json ./

CMD [ "cd", "dist" ]
RUN npm i

EXPOSE 8080

CMD [ "node", "index.js" ]