<?php

use Illuminate\Support\Facades\Route;

// API routes
Route::prefix('api')->group(function () {
    // Add your API endpoints here
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'message' => 'API is working']);
    });
});

// Only serve static assets with CORS headers in production
// In development, React dev server handles its own assets
if (app()->environment('production')) {
    // Serve manifest.json with CORS headers
    Route::get('/build/manifest.json', function () {
        $path = public_path("build/manifest.json");
        
        if (!file_exists($path)) {
            abort(404);
        }
        
        $response = response()->file($path);
        
        // Add CORS headers
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-TOKEN');
        
        return $response;
    })->middleware('cors');

    // Serve static assets with CORS headers
    Route::get('/build/assets/{file}', function ($file) {
        $path = public_path("build/assets_new/{$file}");
        
        if (!file_exists($path)) {
            abort(404);
        }
        
        $response = response()->file($path);
        
        // Add CORS headers
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-TOKEN');
        
        return $response;
    })->where('file', '.*')->middleware('cors');

    // Serve React SPA - catch all routes except API and build assets
    Route::get('/{any?}', function () {
        return view('app');
    })->where('any', '^(?!api|build).*');
} else {
    // In development, just return a simple message for root route
    Route::get('/', function () {
        return response()->json([
            'message' => 'Laravel API Server running',
            'frontend' => 'http://localhost:3000',
            'api_health' => 'http://127.0.0.1:8000/api/health'
        ]);
    });
}
