# Build stage
FROM node:20 AS builder
WORKDIR /app

COPY ./package*.json  ./
COPY ./bun.lock ./

COPY . .

RUN npm install -g bun
RUN bun install


# Deploy stage
FROM node:20-alpine

LABEL maintainer="Hiro <laciferin@gmail.com>"

ENV NODE_ENV="production"

WORKDIR /app


COPY --from=builder /app ./


ENTRYPOINT ["npm", "run", ""]