#!/bin/bash

# Build script for production deployment

echo "🔨 Building Production Assets..."

# Build React frontend
echo "⚛️ Building React app..."
cd client
npm run build

# Copy React build to Laravel public directory
echo "📦 Copying assets to Laravel..."
cp -r dist/* ../public/build/

# Build Laravel assets
echo "🐧 Building Laravel assets..."
cd ..
npm run build

echo "✅ Build complete!"
echo "📁 Assets ready in public/build/"
echo ""
echo "To deploy:"
echo "1. Upload entire project to server"
echo "2. Run 'composer install --no-dev --optimize-autoloader'"
echo "3. Run 'php artisan config:cache'"
echo "4. Run 'php artisan route:cache'"
echo "5. Set APP_ENV=production in .env"
