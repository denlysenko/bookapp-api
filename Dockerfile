FROM node:8.9.1-alpine
LABEL author="denlysenko"
WORKDIR /var/www/bookapp-api
EXPOSE 3001
ENTRYPOINT npm run start:dev
