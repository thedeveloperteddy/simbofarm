#!/bin/bash

# Production deployment script

echo "🚀 Deploying to Production..."

# Environment checks
if [ "$APP_ENV" != "production" ]; then
    echo "⚠️ Warning: APP_ENV is not set to production"
    echo "Set APP_ENV=production in your .env file"
fi

# Clear caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Optimize for production
echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
echo "🔐 Setting permissions..."
chmod -R 755 public/
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

echo "✅ Deployment complete!"
echo "🌐 Application is ready for production"
