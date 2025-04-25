#!/bin/bash
set -e

echo "📦 Running init.sql..."
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /db/init.sql

if [ "$SEED_TEST_DATA" = "true" ]; then
  echo "🌱 Seeding test data..."
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /db/seed-test-data.sql
else
  echo "🚫 Skipping test data seeding"
fi
