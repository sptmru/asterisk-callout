#!/bin/bash

# Copy .env
echo "Creating .env"
cp .env.example build/.env
cp .env.example .env

# Run DB migrations
echo "Running DB migrations"
npm run migrations:run

# Start service
echo "Starting callout"
cd build && node app.js