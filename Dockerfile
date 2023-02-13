FROM node:lts-alpine

WORKDIR /app

COPY ./src ./src
COPY ./package.json .
COPY ./yarn.lock .
COPY ./tsconfig.json .
COPY ./.env .

RUN yarn
RUN yarn build
CMD yarn start
