# Development Setup Guide

This project uses a **separated development environment** for optimal development experience with instant hot refresh.

## 🚀 Quick Start

### Development Mode (Recommended)
```bash
# Start both servers
scripts\dev-separate.bat
```

### Manual Start
```bash
# Terminal 1: Laravel API Server
php artisan serve --host=0.0.0.0

# Terminal 2: React Development Server
cd client && npm run dev
```

## 🌐 Development URLs

- **Frontend (React)**: `http://localhost:3000` ← **Use this for development**
- **Backend (Laravel API)**: `http://127.0.0.1:8000`
- **API Health Check**: `http://127.0.0.1:8000/api/health`

## ⚡ Development Features

### React Development Server (Port 3000)
- ✅ **Instant Hot Refresh** - Changes appear immediately
- ✅ **Fast HMR** - Component updates without page reload
- ✅ **TypeScript Checking** - Real-time type errors
- ✅ **API Proxy** - `/api/*` requests proxy to Laravel
- ✅ **Tailwind CSS** - Instant style updates

### Laravel API Server (Port 8000)
- ✅ **Pure API** - Only handles API requests in development
- ✅ **Hot Reload** - PHP changes auto-reload
- ✅ **Database Migrations** - Ready for development
- ✅ **API Testing** - Full API functionality

## 🔧 Configuration Details

### Vite Proxy Configuration
```javascript
// client/vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### API Client Configuration
```typescript
// client/src/lib/api.ts
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Use proxy in development
  : '/api'; // Production URL
```

### Laravel Routes
```php
// routes/web.php
if (app()->environment('production')) {
    // Serve React app in production
} else {
    // Development: API only
    Route::get('/', function () {
        return response()->json([
            'message' => 'Laravel API Server running',
            'frontend' => 'http://localhost:3000',
            'api_health' => 'http://127.0.0.1:8000/api/health'
        ]);
    });
}
```

## 🎨 Working with Styles

### Tailwind CSS Development
- **Instant Updates**: CSS changes appear immediately
- **Purging**: Only in production build
- **Dark Mode**: Toggle with browser dev tools
- **Responsive**: Test all screen sizes

### Adding New Styles
```css
/* client/src/index.css */
@import "tailwindcss";

/* Add custom styles here */
.my-custom-class {
  /* custom properties */
}
```

## 🔄 Development Workflow

### 1. Making Changes
```bash
# Frontend changes (React/TypeScript/CSS)
# Edit files in client/src/
# Changes appear instantly at http://localhost:3000

# Backend changes (PHP/API)
# Edit Laravel files
# API changes available immediately
```

### 2. Testing API
```bash
# Test API health
curl http://127.0.0.1:8000/api/health

# Test products API
curl http://127.0.0.1:8000/api/products
```

### 3. Debugging
- **Frontend**: Browser console at `http://localhost:3000`
- **Backend**: Laravel logs at `storage/logs/laravel.log`
- **Network**: Browser dev tools Network tab

## 🏗️ Building for Production

### Production Build
```bash
# Build for production
scripts\build-production.bat

# Or via composer
composer run build:production
```

### Production Features
- 🗜️ **Minified Assets** - Optimized CSS/JS
- 📦 **Single Bundle** - Combined React app
- 🔒 **CORS Headers** - Ready for deployment
- 🚀 **Static Serving** - Laravel serves React app

### Production Deployment
```bash
# Set production environment
APP_ENV=production

# Clear and cache configs
php artisan config:cache
php artisan route:cache

# Deploy to server
# Upload entire project
```

## 📱 Testing

### Development Testing
```bash
# Frontend: http://localhost:3000
# Full React app with API integration
```

### API Testing
```bash
# Backend: http://127.0.0.1:8000/api/*
# All API endpoints available
```

### Production Testing
```bash
# After build: http://your-domain.com
# Full Laravel + React integration
```

## 🛠️ Troubleshooting

### Common Issues

1. **React not updating**
   - Check if `npm run dev` is running
   - Look for HMR errors in console
   - Restart React dev server

2. **API not working**
   - Verify Laravel server is running
   - Check API endpoints: `curl http://127.0.0.1:8000/api/health`
   - Look for Laravel errors in logs

3. **Styles not updating**
   - Ensure Tailwind CSS is configured
   - Check PostCSS configuration
   - Verify CSS imports in React components

4. **Proxy errors**
   - Check Vite proxy configuration
   - Verify Laravel server is on port 8000
   - Look for CORS errors

### Debug Commands
```bash
# Check React server
curl http://localhost:3000

# Check Laravel API
curl http://127.0.0.1:8000/api/health

# Check build output
ls -la public/build/
```

## 🎯 Best Practices

### Development
- ✅ Use React dev server for frontend changes
- ✅ Test API endpoints frequently
- ✅ Check browser console for errors
- ✅ Use TypeScript for type safety
- ✅ Test responsive design

### Before Production
- ✅ Run `scripts\build-production.bat`
- ✅ Test production build locally
- ✅ Verify all API endpoints work
- ✅ Check for console errors
- ✅ Test on different browsers

## 📚 Resources

- [React Development](https://react.dev/)
- [Vite Development Server](https://vitejs.dev/)
- [Laravel API Development](https://laravel.com/docs/api)
- [Tailwind CSS Development](https://tailwindcss.com/)

---

**Happy Coding! 🚀**
