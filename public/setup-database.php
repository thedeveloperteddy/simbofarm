<?php
/**
 * Simbo Farm Database Setup Script
 * Run this to automatically create database, tables, and seed data
 * 
 * Usage: php setup-database.php
 * Or via web: http://your-domain.com/setup-database.php
 */

// Configuration
$config = [
    'db_host' => 'localhost',
    'db_port' => '3306',
    'db_user' => 'root',          // Change to your MySQL username
    'db_pass' => '',              // Change to your MySQL password
    'db_name' => 'simbo_farm',
    'charset' => 'utf8mb4'
];

// Check if running from CLI or web
$isCli = php_sapi_name() === 'cli';

function output($message, $type = 'info') {
    global $isCli;
    
    if ($isCli) {
        $colors = [
            'info' => "\033[36m",    // Cyan
            'success' => "\033[32m", // Green
            'error' => "\033[31m",   // Red
            'warning' => "\033[33m", // Yellow
            'reset' => "\033[0m"
        ];
        echo $colors[$type] . "[" . strtoupper($type) . "] " . $message . $colors['reset'] . "\n";
    } else {
        $colors = [
            'info' => '#2196F3',
            'success' => '#4CAF50',
            'error' => '#f44336',
            'warning' => '#FF9800'
        ];
        echo "<div style='color: {$colors[$type]}; padding: 8px; margin: 4px 0; border-left: 4px solid {$colors[$type]}; background: #f5f5f5;'>";
        echo "<strong>" . strtoupper($type) . ":</strong> " . htmlspecialchars($message);
        echo "</div>";
    }
}

function createHeader() {
    global $isCli;
    if (!$isCli) {
        echo "<!DOCTYPE html>
<html>
<head>
    <title>Simbo Farm - Database Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 15px; }
        h2 { color: #666; margin-top: 30px; }
        .step { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
        pre { background: #263238; color: #aed581; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .success-box { background: #e8f5e9; border: 1px solid #4CAF50; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .error-box { background: #ffebee; border: 1px solid #f44336; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>Simbo Farm Database Setup</h1>";
    } else {
        echo "========================================\n";
        echo "  Simbo Farm Database Setup Script\n";
        echo "========================================\n\n";
    }
}

function createFooter() {
    global $isCli;
    if (!$isCli) {
        echo "    </div>
</body>
</html>";
    }
}

// Main setup process
try {
    createHeader();
    
    output("Starting database setup...", 'info');
    
    // Step 1: Connect to MySQL server (without database)
    output("Connecting to MySQL server...", 'info');
    $pdo = new PDO(
        "mysql:host={$config['db_host']};port={$config['db_port']};charset={$config['charset']}",
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    output("Connected to MySQL server successfully", 'success');
    
    // Step 2: Create database
    output("Creating database '{$config['db_name']}'...", 'info');
    $pdo->exec("CREATE DATABASE IF NOT EXISTS {$config['db_name']} 
                CHARACTER SET utf8mb4 
                COLLATE utf8mb4_unicode_ci");
    output("Database created/verified", 'success');
    
    // Step 3: Select database
    $pdo->exec("USE {$config['db_name']}");
    output("Database selected", 'success');
    
    // Step 4: Create tables
    output("Creating tables...", 'info');
    
    // Users table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NULL,
        phone VARCHAR(20) UNIQUE NULL,
        password VARCHAR(255) NULL,
        role ENUM('admin', 'staff', 'customer') DEFAULT 'customer',
        is_active BOOLEAN DEFAULT TRUE,
        email_verified_at TIMESTAMP NULL,
        phone_verified_at TIMESTAMP NULL,
        remember_token VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_phone (phone),
        INDEX idx_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    output("Users table created", 'success');
    
    // Products table
    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        p_name VARCHAR(255) NOT NULL,
        p_description TEXT,
        p_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        p_stock INT UNSIGNED DEFAULT 0,
        p_type ENUM('eggs', 'broilers', 'feed', 'chicks', 'layers', 'ducks', 'turkeys', 'other') DEFAULT 'eggs',
        p_rating DECIMAL(2, 1) DEFAULT 5.0,
        p_image VARCHAR(500) NULL,
        p_unit VARCHAR(50) DEFAULT 'piece',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type_active (p_type, is_active),
        INDEX idx_price (p_price),
        INDEX idx_name (p_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    output("Products table created", 'success');
    
    // Orders table
    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        customer_id BIGINT UNSIGNED NULL,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_status (status),
        INDEX idx_customer (customer_id),
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    output("Orders table created", 'success');
    
    // Order items table
    $pdo->exec("CREATE TABLE IF NOT EXISTS order_items (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT UNSIGNED NOT NULL,
        product_id BIGINT UNSIGNED NOT NULL,
        quantity INT UNSIGNED NOT NULL DEFAULT 1,
        unit_price DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
        INDEX idx_order (order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    output("Order items table created", 'success');
    
    // Chat messages table
    $pdo->exec("CREATE TABLE IF NOT EXISTS chat_messages (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        sender_id BIGINT UNSIGNED NOT NULL,
        sender_type ENUM('admin', 'customer', 'system') NOT NULL,
        receiver_id BIGINT UNSIGNED NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        attachment_url VARCHAR(500) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_sender (sender_id),
        INDEX idx_receiver (receiver_id),
        INDEX idx_created (created_at),
        INDEX idx_is_read (is_read)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    output("Chat messages table created", 'success');
    
    // Categories table
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_am VARCHAR(255) NULL,
        name_or VARCHAR(255) NULL,
        description TEXT NULL,
        image VARCHAR(500) NULL,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT UNSIGNED DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_active_order (is_active, display_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    output("Categories table created", 'success');
    
    // Settings table
    $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `key` VARCHAR(255) NOT NULL UNIQUE,
        `value` TEXT NULL,
        type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (`key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    output("Settings table created", 'success');
    
    // Step 5: Seed default data
    output("Seeding default data...", 'info');
    
    // Check if data already exists
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $userCount = $stmt->fetchColumn();
    
    if ($userCount == 0) {
        // Default admin (password: admin123)
        $adminPass = password_hash('admin123', PASSWORD_BCRYPT);
        $pdo->prepare("INSERT INTO users (name, email, phone, password, role, is_active, phone_verified_at, email_verified_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())")
            ->execute(['System Admin', 'admin@simbofarm.com', '+251911000000', $adminPass, 'admin', TRUE]);
        output("Default admin user created", 'success');
        
        // Test customer (password: customer123)
        $customerPass = password_hash('customer123', PASSWORD_BCRYPT);
        $pdo->prepare("INSERT INTO users (name, email, phone, password, role, is_active, phone_verified_at, email_verified_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NULL)")
            ->execute(['Test Customer', 'customer@test.com', '+251922000000', $customerPass, 'customer', TRUE]);
        output("Test customer created", 'success');
        
        // Categories with translations
        $categories = [
            ['Eggs', 'እንቁላል', 'Maqaa', 'Fresh farm eggs collected daily', 1],
            ['Broilers', 'የስጋ ዶሮ', 'Horo nyaataa', 'Meat chickens ready for market', 2],
            ['Layers', 'እንቁላል የሚሰጥ ዶሮ', 'Horo qehee', 'Egg-laying hens', 3],
            ['Chicks', 'የዶሮ ጫጩቶች', 'Gogaa horoo', 'Day-old and week-old chicks', 4],
            ['Feed', 'መኖ', 'Nyaataa horoo', 'Quality poultry feed and supplements', 5],
            ['Ducks', 'የዶሮ አይነት', 'Bataalaa', 'Farm raised ducks', 6],
        ];
        
        $catStmt = $pdo->prepare("INSERT INTO categories (name, name_am, name_or, description, display_order) VALUES (?, ?, ?, ?, ?)");
        foreach ($categories as $cat) {
            $catStmt->execute($cat);
        }
        output("Categories seeded", 'success');
        
        // Sample products
        $products = [
            ['Fresh White Eggs', 'Farm fresh white eggs, collected daily from free-range hens', 8.50, 500, 'eggs', 4.8, 'tray'],
            ['Brown Organic Eggs', 'Organic brown eggs from pasture-raised chickens', 12.00, 300, 'eggs', 4.9, 'tray'],
            ['Broiler Chicken', 'Whole dressed broiler chicken, ready to cook', 350.00, 50, 'broilers', 4.7, 'kg'],
            ['Chicken Breast', 'Fresh chicken breast, boneless and skinless', 280.00, 80, 'broilers', 4.6, 'kg'],
            ['Starter Feed', 'High protein starter feed for chicks (0-8 weeks)', 45.00, 200, 'feed', 4.5, 'kg'],
            ['Grower Feed', 'Balanced grower feed for young chickens', 40.00, 150, 'feed', 4.6, 'kg'],
            ['Layer Feed', 'Calcium-rich feed for laying hens', 42.00, 180, 'feed', 4.7, 'kg'],
            ['Day-Old Chicks', 'Healthy day-old broiler chicks', 45.00, 1000, 'chicks', 4.8, 'piece'],
            ['Week-Old Layers', 'One week old layer chicks, vaccinated', 55.00, 800, 'chicks', 4.7, 'piece'],
            ['Duck Meat', 'Fresh farm duck, whole dressed', 400.00, 30, 'ducks', 4.6, 'kg'],
        ];
        
        $prodStmt = $pdo->prepare("INSERT INTO products (p_name, p_description, p_price, p_stock, p_type, p_rating, p_unit) VALUES (?, ?, ?, ?, ?, ?, ?)");
        foreach ($products as $prod) {
            $prodStmt->execute($prod);
        }
        output("Sample products seeded", 'success');
        
        // Settings
        $settings = [
            ['site_name', 'Simbo Farm', 'string'],
            ['site_currency', 'ETB', 'string'],
            ['contact_phone', '+251911000000', 'string'],
            ['contact_email', 'info@simbofarm.com', 'string'],
            ['delivery_fee', '50.00', 'string'],
            ['min_order_amount', '100.00', 'string'],
            ['enable_chat', 'true', 'boolean'],
            ['enable_reviews', 'true', 'boolean'],
            ['maintenance_mode', 'false', 'boolean'],
        ];
        
        $setStmt = $pdo->prepare("INSERT INTO settings (`key`, `value`, `type`) VALUES (?, ?, ?)");
        foreach ($settings as $setting) {
            $setStmt->execute($setting);
        }
        output("Settings seeded", 'success');
        
    } else {
        output("Data already exists, skipping seeding", 'warning');
    }
    
    // Step 6: Create .env configuration info
    output("", 'info');
    output("========================================", 'info');
    output("DATABASE SETUP COMPLETE", 'success');
    output("========================================", 'info');
    output("", 'info');
    
    $envContent = <<<ENV
# Add these lines to your .env file:

DB_CONNECTION=mysql
DB_HOST={$config['db_host']}
DB_PORT={$config['db_port']}
DB_DATABASE={$config['db_name']}
DB_USERNAME={$config['db_user']}
DB_PASSWORD={$config['db_pass']}

# CORS settings (read by config/cors.php)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8082,http://127.0.0.1:8000
CORS_SUPPORTS_CREDENTIALS=true

# API settings
API_BASE_URL=http://127.0.0.1:8000/api/v1
ADMIN_PHONE=+251911000000
ADMIN_CODE=admin123
ENV;
    
    output("Update your .env file with:", 'info');
    
    if (!$isCli) {
        echo "<pre>" . htmlspecialchars($envContent) . "</pre>";
    } else {
        echo "\n" . $envContent . "\n";
    }
    
    output("", 'info');
    output("Default login credentials:", 'info');
    output("Admin: admin@simbofarm.com / admin123", 'info');
    output("Customer: customer@test.com / customer123", 'info');
    output("", 'info');
    output("Setup complete! You can now use the application.", 'success');
    
} catch (PDOException $e) {
    output("Database error: " . $e->getMessage(), 'error');
    if (strpos($e->getMessage(), 'Access denied') !== false) {
        output("Please check your MySQL username and password in the configuration", 'warning');
    }
    if (strpos($e->getMessage(), 'Connection refused') !== false) {
        output("Please make sure MySQL server is running", 'warning');
    }
} catch (Exception $e) {
    output("Error: " . $e->getMessage(), 'error');
}

createFooter();
