#!/bin/sh
set -e

echo "🚀 [ExploreBharat API] Starting container entrypoint..."

# Determine schema based on DATABASE_URL
if echo "$DATABASE_URL" | grep -q "postgres"; then
  echo "📦 [ExploreBharat API] Detected PostgreSQL database..."
  SCHEMA_PATH="packages/database/prisma/schema.postgresql.prisma"
else
  echo "📦 [ExploreBharat API] Detected SQLite/default database..."
  SCHEMA_PATH="packages/database/prisma/schema.prisma"
fi

# Run database synchronization/migration
echo "🔄 [ExploreBharat API] Syncing database schema (${SCHEMA_PATH})..."
npx prisma db push --schema="${SCHEMA_PATH}" --skip-generate || true

# Seed database if requested or if SEED_ON_STARTUP=true
if [ "$SEED_ON_STARTUP" = "true" ]; then
  echo "🌱 [ExploreBharat API] Seeding authentic catalog and demo users..."
  npm run seed --workspace=@bharatyatra/database || true
fi

echo "✅ [ExploreBharat API] Database ready. Starting server on port ${PORT:-4000}..."
exec node apps/api/dist/server.js
