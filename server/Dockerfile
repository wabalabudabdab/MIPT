FROM node:18-alpine

WORKDIR /app

# Install required packages for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma/

# Copy source code
COPY src ./src/

# Generate Prisma client
RUN pnpm run prisma:generate

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start:prod"]
