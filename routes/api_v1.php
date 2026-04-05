<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\ClientController;
use App\Http\Controllers\Api\v1\AdminController;
use App\Http\Controllers\Api\v1\RealtimeController;

/*
|--------------------------------------------------------------------------
| API v1 Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function () {
    // Public endpoints (no authentication required)
    Route::prefix('client')->group(function () {
        Route::get('/health', [ClientController::class, 'health']);
        Route::get('/products', [ClientController::class, 'products']);
        Route::get('/products/{id}', [ClientController::class, 'product']);
        Route::get('/search', [ClientController::class, 'searchProducts']);
        Route::get('/categories', [ClientController::class, 'categories']);
        Route::post('/contact', [ClientController::class, 'contact']);

        // Order endpoints
        Route::post('/orders', [ClientController::class, 'createOrder']);
        Route::get('/orders/{id}', [ClientController::class, 'getOrder']);

        // Protected endpoints (authentication required)
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/user/orders', [ClientController::class, 'getUserOrders']);
        });

        // Real-time endpoints for instant chat and product updates
        Route::prefix('realtime')->group(function () {
            // Chat endpoints
            Route::get('/messages', [RealtimeController::class, 'getMessages']);
            Route::post('/messages', [RealtimeController::class, 'sendMessage']);
            Route::post('/messages/read', [RealtimeController::class, 'markAsRead']);
            Route::get('/messages/unread/{userId}', [RealtimeController::class, 'getUnreadCount']);
            Route::get('/conversations', [RealtimeController::class, 'getConversations']);
            
            // Product endpoints
            Route::get('/products', [RealtimeController::class, 'getProducts']);
            Route::post('/products', [RealtimeController::class, 'uploadProduct']);
            Route::get('/products/updates', [RealtimeController::class, 'getProductUpdates']);
            
            // Stats endpoint
            Route::get('/stats', [RealtimeController::class, 'getRealtimeStats']);
        });
    });

    // Admin authentication endpoints (separate from client)
    Route::prefix('admin')->group(function () {
        Route::post('/check-phone', [AdminController::class, 'checkPhone']);
        Route::post('/login', [AdminController::class, 'login']);
        Route::post('/logout', [AdminController::class, 'logout']);
        Route::get('/profile', [AdminController::class, 'profile']);
        
        // Admin data endpoints
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
});
