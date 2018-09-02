FROM node:8.11.4-alpine
LABEL author="denlysenko"
WORKDIR /var/www/bookapp-api
COPY package.json .
COPY package-lock.json .
RUN npm install --production
COPY .env.production ./.env
COPY bookapp-cd051-firebase-adminsdk-5khci-fe7cf2f3b5.json .
COPY ./dist ./dist
ENV NODE_ENV production
EXPOSE 3001 3002
CMD ["node", "dist/main.js"]
