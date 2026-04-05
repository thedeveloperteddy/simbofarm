# Quick Verification Commands

## Web App
Visit: http://localhost:3000

## API Tests
```bash
# Health check
curl http://127.0.0.1:8000/api/v1/client/health

# Get products
curl http://127.0.0.1:8000/api/v1/client/products

# Search products
curl "http://127.0.0.1:8000/api/v1/client/search?q=eggs"

# Get categories
curl http://127.0.0.1:8000/api/v1/client/categories
```

## Database Check
```bash
php artisan tinker --execute="App\Models\Product::count()"
```

## React Native Setup
1. Copy API_DOCUMENTATION.md
2. Copy REACT_NATIVE_API_CLIENT.js
3. Copy REACT_NATIVE_EXAMPLE.js
4. Install AsyncStorage: npm install @react-native-async-storage/async-storage
