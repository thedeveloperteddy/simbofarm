<?php
/**
 * Database Viewer - Query and display SQLite database contents
 * Place this in your Laravel public folder and access via browser
 */

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

header('Content-Type: text/html; charset=utf-8');

echo "<!DOCTYPE html>
<html>
<head>
    <title>Simbo Farm Database Viewer</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
        h2 { color: #666; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0; }
        th { background: #4CAF50; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:hover { background: #f9f9f9; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .badge-success { background: #4CAF50; color: white; }
        .badge-warning { background: #FF9800; color: white; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-value { font-size: 32px; font-weight: bold; color: #4CAF50; }
        .stat-label { color: #666; margin-top: 5px; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>🐔 Simbo Farm Database Viewer</h1>
";

try {
    // Get counts
    $userCount = DB::table('users')->count();
    $productCount = DB::table('products')->count();
    $orderCount = DB::table('orders')->count();
    
    echo "
        <div class='stats'>
            <div class='stat-card'>
                <div class='stat-value'>{$userCount}</div>
                <div class='stat-label'>Registered Users</div>
            </div>
            <div class='stat-card'>
                <div class='stat-value'>{$productCount}</div>
                <div class='stat-label'>Products</div>
            </div>
            <div class='stat-card'>
                <div class='stat-value'>{$orderCount}</div>
                <div class='stat-label'>Orders</div>
            </div>
        </div>
    ";
    
    // Users
    echo "<h2>👥 Users</h2>";
    $users = DB::table('users')->get();
    if ($users->count() > 0) {
        echo "<table>";
        echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Created At</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>{$user->id}</td>";
            echo "<td>{$user->name}</td>";
            echo "<td>{$user->email}</td>";
            echo "<td>{$user->created_at}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No users found.</p>";
    }
    
    // Products
    echo "<h2>📦 Products</h2>";
    $products = DB::table('products')->get();
    if ($products->count() > 0) {
        echo "<table>";
        echo "<tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Active</th></tr>";
        foreach ($products as $product) {
            $status = $product->is_active ? 
                '<span class=\"badge badge-success\">Active</span>' : 
                '<span class=\"badge badge-warning\">Inactive</span>';
            echo "<tr>";
            echo "<td>{$product->id}</td>";
            echo "<td>{$product->p_name}</td>";
            echo "<td>\${$product->p_price}</td>";
            echo "<td>{$product->p_number_of_sallary}</td>";
            echo "<td>{$product->p_type}</td>";
            echo "<td>{$status}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No products found. Add products to see them here.</p>";
    }
    
    // Orders
    echo "<h2>🛒 Orders</h2>";
    $orders = DB::table('orders')->get();
    if ($orders->count() > 0) {
        echo "<table>";
        echo "<tr><th>ID</th><th>Customer</th><th>Email</th><th>Total</th><th>Status</th><th>Date</th></tr>";
        foreach ($orders as $order) {
            $statusBadge = match($order->status) {
                'pending' => '<span class=\"badge badge-warning\">Pending</span>',
                'confirmed' => '<span class=\"badge badge-success\">Confirmed</span>',
                'delivered' => '<span class=\"badge badge-success\">Delivered</span>',
                default => '<span class=\"badge\">' . $order->status . '</span>'
            };
            echo "<tr>";
            echo "<td>{$order->id}</td>";
            echo "<td>{$order->customer_name}</td>";
            echo "<td>{$order->email}</td>";
            echo "<td>\${$order->total_amount}</td>";
            echo "<td>{$statusBadge}</td>";
            echo "<td>{$order->created_at}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p>No orders found.</p>";
    }
    
    echo "
        <div style='margin-top: 40px; padding: 20px; background: #e8f5e9; border-radius: 8px;'>
            <h3>📝 Database Location</h3>
            <p><strong>Path:</strong> " . config('database.connections.sqlite.database') . "</p>
            <p><strong>Size:</strong> " . number_format(filesize(config('database.connections.sqlite.database')) / 1024, 2) . " KB</p>
        </div>
    ";
    
} catch (Exception $e) {
    echo "<div style='color: red; padding: 20px; background: #ffebee; border-radius: 8px;'>
        <h3>Error</h3>
        <p>" . $e->getMessage() . "</p>
    </div>";
}

echo "
    </div>
</body>
</html>";
