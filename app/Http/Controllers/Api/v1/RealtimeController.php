<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

/**
 * RealtimeController - Handles instant/real-time data fetching
 * Uses database polling for chat and products with minimal delay
 */
class RealtimeController extends Controller
{
    /**
     * Send message and store in database for instant retrieval
     */
    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:5000',
            'sender_id' => 'required|integer',
            'sender_type' => 'required|in:admin,customer,system',
            'receiver_id' => 'nullable|integer',
            'sender_name' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid message format',
                'errors' => $validator->errors()
            ], 400);
        }

        // Store message in database
        $messageId = DB::table('chat_messages')->insertGetId([
            'sender_id' => $request->input('sender_id'),
            'sender_type' => $request->input('sender_type'),
            'receiver_id' => $request->input('receiver_id'),
            'message' => $request->input('message'),
            'is_read' => false,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $timestamp = now()->toDateTimeString();

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => [
                'id' => $messageId,
                'message' => $request->input('message'),
                'sender_id' => $request->input('sender_id'),
                'sender_name' => $request->input('sender_name'),
                'sender_type' => $request->input('sender_type'),
                'timestamp' => $timestamp
            ]
        ]);
    }

    /**
     * Get latest messages for real-time updates
     */
    public function getMessages(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'since' => 'nullable|date',
            'user_id' => 'nullable|integer',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        $query = DB::table('chat_messages')
            ->join('users', 'chat_messages.sender_id', '=', 'users.id')
            ->select(
                'chat_messages.id',
                'chat_messages.sender_id',
                'chat_messages.sender_type',
                'chat_messages.receiver_id',
                'chat_messages.message',
                'chat_messages.is_read',
                'chat_messages.created_at',
                'users.name as sender_name'
            );

        if ($request->has('user_id')) {
            $userId = $request->input('user_id');
            $query->where(function ($q) use ($userId) {
                $q->where('chat_messages.sender_id', $userId)
                  ->orWhere('chat_messages.receiver_id', $userId);
            });
        }

        if ($request->has('since')) {
            $query->where('chat_messages.created_at', '>', $request->input('since'));
        }

        $messages = $query
            ->orderBy('chat_messages.created_at', 'desc')
            ->limit($request->input('limit', 50))
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
            'count' => $messages->count(),
            'timestamp' => now()->toDateTimeString()
        ]);
    }

    /**
     * Mark messages as read
     */
    public function markAsRead(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message_ids' => 'required|array',
            'message_ids.*' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        $updated = DB::table('chat_messages')
            ->whereIn('id', $request->input('message_ids'))
            ->update(['is_read' => true, 'updated_at' => now()]);

        return response()->json([
            'success' => true,
            'updated_count' => $updated
        ]);
    }

    /**
     * Get unread message count
     */
    public function getUnreadCount(Request $request, $userId)
    {
        $count = DB::table('chat_messages')
            ->where('receiver_id', $userId)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'unread_count' => $count
        ]);
    }

    /**
     * Get conversations list for admin
     */
    public function getConversations(Request $request)
    {
        $conversations = DB::table('chat_messages as cm')
            ->join('users as u', 'cm.sender_id', '=', 'u.id')
            ->select(
                'u.id as user_id',
                'u.name as user_name',
                'u.phone as user_phone',
                DB::raw('COUNT(CASE WHEN cm.is_read = false AND cm.sender_type = "customer" THEN 1 END) as unread_count'),
                DB::raw('MAX(cm.created_at) as last_message_at')
            )
            ->where('u.role', '!=', 'admin')
            ->groupBy('u.id', 'u.name', 'u.phone')
            ->orderBy('last_message_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $conversations,
            'count' => $conversations->count()
        ]);
    }

    /**
     * Handle product upload with instant database storage
     */
    public function uploadProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'p_name' => 'required|string|max:255',
            'p_description' => 'required|string|max:1000',
            'p_price' => 'required|numeric|min:0',
            'p_stock' => 'required|integer|min:0',
            'p_type' => 'required|in:eggs,broilers,feed,chicks,layers,ducks,turkeys,other',
            'p_rating' => 'nullable|numeric|min:0|max:5',
            'p_image' => 'nullable|string|max:500',
            'p_unit' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid product data',
                'errors' => $validator->errors()
            ], 400);
        }

        // Create product in database
        $productId = DB::table('products')->insertGetId([
            'p_name' => $request->input('p_name'),
            'p_description' => $request->input('p_description'),
            'p_price' => $request->input('p_price'),
            'p_stock' => $request->input('p_stock'),
            'p_type' => $request->input('p_type'),
            'p_rating' => $request->input('p_rating', 5.0),
            'p_image' => $request->input('p_image', 'https://via.placeholder.com/150'),
            'p_unit' => $request->input('p_unit', 'piece'),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $product = DB::table('products')->where('id', $productId)->first();

        return response()->json([
            'success' => true,
            'message' => 'Product uploaded successfully',
            'data' => $product
        ]);
    }

    /**
     * Get latest products with instant updates
     */
    public function getProducts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'since' => 'nullable|date',
            'category' => 'nullable|string',
            'updated_only' => 'nullable|boolean',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        $query = DB::table('products')
            ->where('is_active', true);

        if ($request->has('since') && $request->boolean('updated_only')) {
            $query->where('updated_at', '>', $request->input('since'));
        }

        if ($request->has('category')) {
            $query->where('p_type', $request->input('category'));
        }

        $products = $query
            ->orderBy('updated_at', 'desc')
            ->limit($request->input('limit', 50))
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
            'count' => $products->count(),
            'timestamp' => now()->toDateTimeString()
        ]);
    }

    /**
     * Get product updates for real-time tracking
     */
    public function getProductUpdates(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'integer',
            'since' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        $query = DB::table('products')
            ->where('updated_at', '>', $request->input('since'));

        if ($request->has('product_ids')) {
            $query->whereIn('id', $request->input('product_ids'));
        }

        $updates = $query->get();

        return response()->json([
            'success' => true,
            'data' => $updates,
            'count' => $updates->count(),
            'timestamp' => now()->toDateTimeString()
        ]);
    }

    /**
     * Get real-time statistics for dashboard
     */
    public function getRealtimeStats()
    {
        $stats = [
            'total_products' => DB::table('products')->where('is_active', true)->count(),
            'low_stock_products' => DB::table('products')->where('is_active', true)->where('p_stock', '<', 20)->count(),
            'pending_orders' => DB::table('orders')->where('status', 'pending')->count(),
            'today_orders' => DB::table('orders')->whereDate('created_at', today())->count(),
            'unread_messages' => DB::table('chat_messages')->where('is_read', false)->count(),
            'total_customers' => DB::table('users')->where('role', 'customer')->count(),
            'today_revenue' => DB::table('orders')
                ->whereDate('created_at', today())
                ->where('payment_status', 'paid')
                ->sum('total_amount'),
            'timestamp' => now()->toDateTimeString()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
