# Laravel + React Integration Guide

This project combines a Laravel backend with a React/Next.js frontend to create a full-stack application.

## Project Structure

```
simbo/
├── app/                 # Laravel application code
├── client/              # React frontend application
│   ├── src/            # React source code
│   ├── package.json    # React dependencies
│   └── vite.config.ts  # React Vite configuration
├── routes/             # Laravel routes
│   ├── web.php         # Web routes (serves React app)
│   └── api.php         # API routes
├── resources/views/    # Blade templates
│   └── app.blade.php   # Main template for React app
└── vite.config.js      # Laravel Vite configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install Laravel dependencies
composer install

# Install React dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
```

### 3. Running the Application

#### Development Mode

Option 1: Run both frontend and backend together
```bash
composer run dev
```

Option 2: Run separately
```bash
# Terminal 1: Laravel backend
php artisan serve

# Terminal 2: React frontend
cd client
npm run dev
```

#### Production Build

```bash
# Build the React app
composer run build

# Or build manually:
cd client && npm run build && cd ..
npm run build:laravel
```

## API Integration

The React app is configured to communicate with the Laravel API:

- **Base URL**: Automatically detected from meta tag or `/api`
- **CSRF Protection**: Enabled with token from meta tag
- **CORS**: Configured for cross-origin requests

### Available API Endpoints

- `GET /api/health` - Health check
- `GET /api/products` - Get products list
- `POST /api/contact` - Submit contact form
- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item to cart

## How It Works

1. **Laravel Routes**: All non-API routes are directed to the `app.blade.php` view
2. **Blade Template**: Serves the React app with proper meta tags for API integration
3. **Vite Integration**: Laravel Vite plugin builds and serves the React app
4. **API Communication**: React app uses `api.ts` client to communicate with Laravel backend

## Development Notes

- The React app runs in development mode on port 3000
- Laravel runs on port 8000 (default)
- API requests are proxied through Laravel in production
- Hot module replacement works for both frontend and backend changes

## Testing the Integration

1. Start the development server
2. Visit `http://localhost:8000` in your browser
3. Check browser console for API connection status
4. Navigate through the React app to test functionality

## Troubleshooting

### Common Issues

1. **API Connection Failed**: Check that Laravel server is running
2. **CORS Errors**: Verify CORS configuration in `config/cors.php`
3. **Build Errors**: Ensure all dependencies are installed
4. **404 Errors**: Check that routes are properly configured

### Debug Mode

Enable debug mode in `.env`:
```env
APP_DEBUG=true
```

This will provide detailed error messages and stack traces.
