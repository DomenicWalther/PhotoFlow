#!/bin/bash
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting the application..."
exec node build