<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function __construct()
    {
        // Protect all admin endpoints except login/check-phone
        $this->middleware(function ($request, $next) {
            $action = $request->route()?->getActionMethod();
            if (in_array($action, ['checkPhone', 'login'], true)) {
                return $next($request);
            }

            $authorization = $request->header('Authorization', '');
            if (!str_starts_with($authorization, 'Bearer ')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $token = substr($authorization, 7);
            if (!str_starts_with($token, 'admin_token_')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid token',
                ], 401);
            }

            return $next($request);
        });
    }

    /**
     * Check if phone number is registered as admin
     */
    public function checkPhone(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid phone number format',
                'errors' => $validator->errors()
            ], 400);
        }

        $phoneNumber = $request->input('phone_number');

        // For demo purposes, use a fixed list of admin phone numbers.
        // In a real system, this should check the database for registered admin users.
        $validPhones = [
            '+1234567890', // Admin 1
            '+0987654321', // Admin 2
            '+1122334455', // Admin 3
        ];

        $exists = in_array($phoneNumber, $validPhones, true);

        return response()->json([
            'success' => true,
            'exists' => $exists,
            'message' => $exists
                ? 'Phone number found in system'
                : 'Phone number not registered'
        ]);
    }

    /**
     * Authenticate admin with phone number and verification code
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string|max:20',
            'verification_code' => 'required|string|size:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid input format',
                'errors' => $validator->errors()
            ], 400);
        }

        $phoneNumber = $request->input('phone_number');
        $verificationCode = $request->input('verification_code');

        // For demo purposes we use a fixed list of admin accounts.
        // In production, replace this with a proper authentication flow (e.g. Laravel Sanctum).
        $validAdmins = [
            '+1234567890' => [
                'id' => 1,
                'name' => 'Admin User',
                'email' => 'admin@simbofarm.com',
                'role' => 'admin',
            ],
            '+0987654321' => [
                'id' => 2,
                'name' => 'Admin Two',
                'email' => 'admin2@simbofarm.com',
                'role' => 'admin',
            ],
            '+1122334455' => [
                'id' => 3,
                'name' => 'Admin Three',
                'email' => 'admin3@simbofarm.com',
                'role' => 'admin',
            ],
        ];

        if (isset($validAdmins[$phoneNumber]) && $verificationCode === '1234') {
            $admin = $validAdmins[$phoneNumber];
            $token = 'admin_token_' . time() . '_' . rand(1000, 9999);

            return response()->json([
                'success' => true,
                'message' => 'Authentication successful',
                'token' => $token,
                'user' => array_merge($admin, ['phone_number' => $phoneNumber])
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid phone number or verification code'
        ], 401);
    }

    /**
     * Logout admin
     */
    public function logout(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get admin profile
     */
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => [
                'id' => 1,
                'name' => 'Admin User',
                'email' => 'admin@simbofarm.com',
                'role' => 'admin'
            ]
        ]);
    }

    /**
     * Get all products
     */
    public function getProducts()
    {
        $products = DB::table('products')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
            'count' => $products->count()
        ]);
    }

    /**
     * Create new product
     */
    public function createProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'p_name' => 'required|string|max:255',
            'p_discription' => 'required|string|max:1000',
            'p_price' => 'required|numeric|min:0',
            'p_number_of_sallary' => 'required|integer|min:0',
            'p_type' => 'required|in:eggs,broilers,feed,chicks,layers,ducks,turkeys,other',
            'p_rating' => 'nullable|numeric|min:0|max:5',
            'p_midea' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        $productId = DB::table('products')->insertGetId([
            'p_name' => $request->input('p_name'),
            'p_discription' => $request->input('p_discription'),
            'p_price' => $request->input('p_price'),
            'p_number_of_sallary' => $request->input('p_number_of_sallary'),
            'p_type' => $request->input('p_type'),
            'p_rating' => $request->input('p_rating', 5.0),
            'p_midea' => $request->input('p_midea', 'https://via.placeholder.com/150'),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $product = DB::table('products')->where('id', $productId)->first();

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    /**
     * Update product
     */
    public function updateProduct(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'p_name' => 'nullable|string|max:255',
            'p_discription' => 'nullable|string|max:1000',
            'p_price' => 'nullable|numeric|min:0',
            'p_number_of_sallary' => 'nullable|integer|min:0',
            'p_type' => 'nullable|in:eggs,broilers,feed,chicks,layers,ducks,turkeys,other',
            'p_rating' => 'nullable|numeric|min:0|max:5',
            'p_midea' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        $updateData = array_filter([
            'p_name' => $request->input('p_name'),
            'p_discription' => $request->input('p_discription'),
            'p_price' => $request->input('p_price'),
            'p_number_of_sallary' => $request->input('p_number_of_sallary'),
            'p_type' => $request->input('p_type'),
            'p_rating' => $request->input('p_rating'),
            'p_midea' => $request->input('p_midea'),
            'is_active' => $request->input('is_active'),
            'updated_at' => now()
        ], function ($value) {
            return $value !== null;
        });

        DB::table('products')->where('id', $id)->update($updateData);

        $product = DB::table('products')->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    /**
     * Delete product
     */
    public function deleteProduct($id)
    {
        DB::table('products')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Get all orders
     */
    public function getOrders()
    {
        $orders = DB::table('orders')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
            'count' => $orders->count()
        ]);
    }

    /**
     * Get single order
     */
    public function getOrder($id)
    {
        $order = DB::table('orders')->where('id', $id)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Get order items
        $items = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('order_items.order_id', $id)
            ->select('order_items.*', 'products.p_name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order,
                'items' => $items
            ]
        ]);
    }

    /**
     * Update order status
     */
    public function updateOrderStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        DB::table('orders')->where('id', $id)->update([
            'status' => $request->input('status'),
            'updated_at' => now()
        ]);

        $order = DB::table('orders')->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'message' => 'Order status updated',
            'data' => $order
        ]);
    }

    /**
     * Get all customers (derived from orders)
     */
    public function getCustomers()
    {
        // Derive customers from orders (simpler for demo without a dedicated users table)
        $orders = DB::table('orders')->get();

        $customers = $orders->groupBy('email')->map(function ($orders, $email) {
            $first = $orders->first();

            return [
                'id' => crc32($email),
                'name' => $first->customer_name,
                'email' => $email,
                'phone' => $first->phone,
                'address' => $first->address,
                'totalOrders' => $orders->count(),
                'totalSpent' => $orders->sum('total_amount'),
                'joinedAt' => $first->created_at,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => $customers,
            'count' => $customers->count()
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function getStats()
    {
        $stats = [
            'total_products' => DB::table('products')->where('is_active', true)->count(),
            'total_orders' => DB::table('orders')->count(),
            'pending_orders' => DB::table('orders')->where('status', 'pending')->count(),
            // Derive customer count from unique order emails
            'total_customers' => DB::table('orders')->distinct('email')->count('email'),
            'today_revenue' => DB::table('orders')
                ->whereDate('created_at', today())
                ->where('payment_status', 'paid')
                ->sum('total_amount'),
            'low_stock_products' => DB::table('products')
                ->where('is_active', true)
                ->where('p_number_of_sallary', '<', 20)
                ->count()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
