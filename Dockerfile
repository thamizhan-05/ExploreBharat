FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for Prisma and native extensions
RUN apk add --no-cache openssl

# Copy root configuration and workspace package definitions
COPY package*.json ./
COPY packages/types/package*.json ./packages/types/
COPY packages/database/package*.json ./packages/database/
COPY apps/api/package*.json ./apps/api/

RUN npm ci

# Copy source code
COPY packages/types ./packages/types
COPY packages/database ./packages/database
COPY apps/api ./apps/api

# Build types, prisma client for PostgreSQL & SQLite, and API gateway
RUN npm run build --workspace=@bharatyatra/types
RUN cd packages/database && npx prisma generate --schema=prisma/schema.postgresql.prisma
RUN cd packages/database && npx prisma generate --schema=prisma/schema.prisma
RUN npm run build --workspace=@bharatyatra/api

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Install runtime dependencies for Prisma engine and health checks
RUN apk add --no-cache openssl wget

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/packages/types/package.json ./packages/types/package.json
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY apps/api/docker-entrypoint.sh /app/docker-entrypoint.sh

RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]
