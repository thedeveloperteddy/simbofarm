<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\ClientController;
use App\Http\Controllers\Api\v1\AdminController;
use App\Http\Controllers\Api\v1\RealtimeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Simple health check endpoint (always available)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is working',
        'timestamp' => now()->toISOString()
    ]);
});

// Version 1 API
Route::prefix('v1')->group(function () {
    // Client-facing endpoints (used by the web / client app)
    Route::prefix('client')->group(function () {
        Route::get('/health', [ClientController::class, 'health']);
        Route::get('/products', [ClientController::class, 'products']);
        Route::get('/products/{id}', [ClientController::class, 'product']);
        Route::get('/search', [ClientController::class, 'searchProducts']);
        Route::get('/categories', [ClientController::class, 'categories']);
        Route::post('/orders', [ClientController::class, 'createOrder']);
        Route::get('/orders/{id}', [ClientController::class, 'getOrder']);
        Route::post('/contact', [ClientController::class, 'contact']);
    });

    // Admin endpoints (used by the dashboard)
    Route::prefix('admin')->group(function () {
        Route::post('/check-phone', [AdminController::class, 'checkPhone']);
        Route::post('/login', [AdminController::class, 'login']);
        Route::post('/logout', [AdminController::class, 'logout']);
        Route::get('/profile', [AdminController::class, 'profile']);

        Route::get('/products', [AdminController::class, 'getProducts']);
        Route::post('/products', [AdminController::class, 'createProduct']);
        Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);

        Route::get('/orders', [AdminController::class, 'getOrders']);
        Route::get('/orders/{id}', [AdminController::class, 'getOrder']);
        Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);

        Route::get('/customers', [AdminController::class, 'getCustomers']);
        Route::get('/stats', [AdminController::class, 'getStats']);
    });

    // Realtime endpoints (optional)
    Route::prefix('realtime')->group(function () {
        Route::post('/messages', [RealtimeController::class, 'sendMessage']);
        Route::get('/messages', [RealtimeController::class, 'getMessages']);
        Route::post('/messages/read', [RealtimeController::class, 'markAsRead']);
        Route::get('/messages/unread/{userId}', [RealtimeController::class, 'getUnreadCount']);
        Route::get('/conversations', [RealtimeController::class, 'getConversations']);

        Route::get('/products', [RealtimeController::class, 'getProducts']);
        Route::get('/product-updates', [RealtimeController::class, 'getProductUpdates']);
        Route::get('/stats', [RealtimeController::class, 'getRealtimeStats']);
    });
});
