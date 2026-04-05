<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    /**
     * Get all products
     */
    public function products()
    {
        $products = Product::active()->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'p_name' => $product->p_name,
                'p_discription' => $product->p_discription,
                'p_price' => $product->p_price,
                'p_number_of_sallary' => $product->p_number_of_sallary,
                'p_type' => $product->p_type,
                'p_rating' => $product->p_rating,
                'p_midea' => $product->p_midea,
                'p_date' => is_numeric($product->p_date) ? (int)$product->p_date : time(),
                'is_active' => $product->is_active,
            ];
        });

        return response()->json([
            'data' => $products,
            'message' => 'Products retrieved successfully'
        ]);
    }

    /**
     * Get single product
     */
    public function product($id)
    {
        $product = Product::active()->find($id);
        
        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $product->id,
                'p_name' => $product->p_name,
                'p_discription' => $product->p_discription,
                'p_price' => $product->p_price,
                'p_number_of_sallary' => $product->p_number_of_sallary,
                'p_type' => $product->p_type,
                'p_rating' => $product->p_rating,
                'p_midea' => $product->p_midea,
                'p_date' => $product->p_date ? $product->p_date->timestamp : time(),
                'is_active' => $product->is_active,
            ]
        ]);
    }

    /**
     * Search products
     */
    public function searchProducts(Request $request)
    {
        $query = $request->get('q', '');
        $category = $request->get('category', 'all');

        $products = Product::active()
            ->when($query, function ($q) use ($query) {
                return $q->where('p_name', 'like', "%{$query}%");
            })
            ->when($category !== 'all', function ($q) use ($category) {
                return $q->where('p_type', $category);
            })
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'p_name' => $product->p_name,
                    'p_discription' => $product->p_discription,
                    'p_price' => $product->p_price,
                    'p_number_of_sallary' => $product->p_number_of_sallary,
                    'p_type' => $product->p_type,
                    'p_rating' => $product->p_rating,
                    'p_midea' => $product->p_midea,
                    'p_date' => $product->p_date ? $product->p_date->timestamp : time(),
                ];
            });

        return response()->json([
            'data' => $products,
            'message' => 'Search results'
        ]);
    }

    /**
     * Create order
     */
    public function createOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Calculate total
        $total = 0;
        $orderItems = [];

        foreach ($request->items as $item) {
            $product = Product::active()->find($item['product_id']);
            if (!$product) {
                return response()->json([
                    'message' => "Product with ID {$item['product_id']} not found"
                ], 404);
            }

            if ($product->p_number_of_sallary < $item['quantity']) {
                return response()->json([
                    'message' => "Insufficient stock for {$product->p_name}"
                ], 422);
            }

            $itemTotal = $product->p_price * $item['quantity'];
            $total += $itemTotal;

            $orderItems[] = [
                'product_id' => $product->id,
                'product_name' => $product->p_name,
                'quantity' => $item['quantity'],
                'price' => $product->p_price,
                'total' => $itemTotal
            ];

            // Update stock
            $product->decrement('p_number_of_sallary', $item['quantity']);
        }

        $order = Order::create([
            'customer_name' => $request->customer_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'total_amount' => $total,
            'status' => 'pending',
            'order_items' => $orderItems,
            'notes' => $request->notes
        ]);

        return response()->json([
            'data' => [
                'id' => $order->id,
                'customer_name' => $order->customer_name,
                'email' => $order->email,
                'phone' => $order->phone,
                'address' => $order->address,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'order_items' => $order->order_items,
                'created_at' => $order->created_at->toISOString()
            ],
            'message' => 'Order created successfully'
        ], 201);
    }

    /**
     * Get order by ID
     */
    public function getOrder($id)
    {
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $order->id,
                'customer_name' => $order->customer_name,
                'email' => $order->email,
                'phone' => $order->phone,
                'address' => $order->address,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'order_items' => $order->order_items,
                'notes' => $order->notes,
                'created_at' => $order->created_at->toISOString()
            ]
        ]);
    }

    /**
     * Get user orders (if authenticated)
     */
    public function getUserOrders(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $orders = Order::where('email', Auth::user()->email)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer_name,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at->toISOString()
                ];
            });

        return response()->json([
            'data' => $orders,
            'message' => 'Orders retrieved successfully'
        ]);
    }

    /**
     * Contact form submission
     */
    public function contact(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Here you would typically:
        // 1. Save to database
        // 2. Send email notification
        // 3. Send to CRM

        return response()->json([
            'message' => 'Contact form submitted successfully',
            'data' => $request->all()
        ]);
    }

    /**
     * Health check
     */
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'API is working',
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0'
        ]);
    }

    /**
     * Get categories
     */
    public function categories()
    {
        $categories = Product::active()
            ->select('p_type')
            ->distinct()
            ->pluck('p_type')
            ->map(function ($category) {
                return [
                    'key' => $category,
                    'label' => ucfirst($category)
                ];
            });

        return response()->json([
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
    }
}
