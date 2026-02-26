FROM node:20-bookworm-slim AS base

# Install dependencies for Prisma, PostgreSQL and networking tools
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

FROM base AS builder
WORKDIR /app

# Copy dependencies and prisma from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/prisma ./prisma
COPY . .

# Build the application
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/docker-entrypoint.sh /docker-entrypoint.sh

# Make entrypoint executable
RUN chmod +x /docker-entrypoint.sh

# Expose the application port
EXPOSE 3000

ENV PORT=3000

# Use the entrypoint script to handle migrations and startup
ENTRYPOINT ["/docker-entrypoint.sh"]
