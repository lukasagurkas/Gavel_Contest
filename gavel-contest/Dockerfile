# build stage
FROM node:lts-alpine as build-stage
WORKDIR /usr/src/app/gavel-contest
COPY package*.json ./
RUN npm install && npm install @vue/cli-service --save &&\
         npm install vue-template-compiler --save
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /usr/src/app/gavel-contest/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]