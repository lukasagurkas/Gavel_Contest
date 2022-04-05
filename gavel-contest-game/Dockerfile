FROM node:lts-alpine
WORKDIR /usr/src/app/gavel-contest-game
COPY test.html /usr/src/app/gavel-contest-game
RUN npm install formidable --save
RUN npm install mime-types --save
COPY . .
EXPOSE 8000
CMD [ "node", "server.js" ]
