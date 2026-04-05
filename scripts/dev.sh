#!/bin/bash

# Development script for Laravel + React integration

echo "🚀 Starting Development Environment..."

# Start Laravel backend
echo "📦 Starting Laravel server..."
php artisan serve --host=0.0.0.0 &

# Start React frontend in development mode
echo "⚛️ Starting React development server..."
cd client && npm run dev &

echo "✅ Development servers started!"
echo "🌐 Laravel: http://127.0.0.1:8000"
echo "⚛️ React Dev: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for all background processes
wait
