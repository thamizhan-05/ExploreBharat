FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configuration and workspaces
COPY package*.json ./
COPY packages/types/package*.json ./packages/types/
COPY packages/database/package*.json ./packages/database/
COPY apps/api/package*.json ./apps/api/

RUN npm ci

# Copy source files
COPY packages/types ./packages/types
COPY packages/database ./packages/database
COPY apps/api ./apps/api

# Build types, prisma client, and api
RUN npm run build --workspace=@bharatyatra/types
RUN cd packages/database && npx prisma generate --schema=prisma/schema.postgresql.prisma
RUN npm run build --workspace=@bharatyatra/api

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/packages/types/package.json ./packages/types/package.json
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
