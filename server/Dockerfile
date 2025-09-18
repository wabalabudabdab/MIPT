# Multi-stage Dockerfile

# Development stage 
FROM node:18-alpine AS development

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/
COPY src ./src/

RUN pnpm run prisma:generate

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]

# Production stage 
FROM node:18-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

# Установка только production зависимостей
RUN pnpm install --prod --frozen-lockfile

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/
COPY src ./src/

RUN pnpm run prisma:generate
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
