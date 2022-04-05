FROM node:lts-alpine
WORKDIR /usr/src/app/gavel-contest-server
COPY package*.json ./
RUN npm install
RUN npm install sqlite3 --save
COPY . .
EXPOSE 7081
CMD [ "npm", "run", "server" ]
