-- Simbo Farm Database Schema with Demo Products Data
-- MySQL/MariaDB Compatible
-- Run this in phpMyAdmin or MySQL command line to create the complete database

-- Create database
CREATE DATABASE IF NOT EXISTS simbo_farm
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE simbo_farm;

-- Users table (for both customers and admins)
CREATE TABLE IF NOT EXISTS users (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE IF NOT EXISTS products (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat messages table (for real-time chat)
CREATE TABLE IF NOT EXISTS chat_messages (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert demo products data (corrected field names from seeder)
INSERT INTO products (p_name, p_description, p_price, p_stock, p_type, p_rating, p_image, p_unit, is_active, created_at) VALUES
('Fresh Organic Eggs', 'Premium quality organic eggs from free-range chickens. Perfect for healthy breakfast and baking.', 2.50, 100, 'eggs', 4.5, 'https://images.unsplash.com/photo-1518569656558-1f25e69393e7?w=400', 'dozen', TRUE, NOW()),
('Premium Broiler Chicken', 'High-quality broiler chicken, perfect for grilling, roasting, or frying. Farm-fresh and hormone-free.', 15.00, 50, 'broilers', 4.8, 'https://images.unsplash.com/photo-1528699342362-5e6c67b49420?w=400', 'kg', TRUE, NOW()),
('Day-Old Chicks', 'Healthy and active day-old chicks, vaccinated and ready for brooding. Ideal for poultry farming.', 1.20, 200, 'chicks', 4.2, 'https://images.unsplash.com/photo-1577596275866-10ad5c0e7c77?w=400', 'piece', TRUE, NOW()),
('Premium Chicken Feed', 'Nutritionally balanced chicken feed for optimal growth and health. Contains essential vitamins and minerals.', 25.00, 30, 'feed', 4.6, 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400', 'bag', TRUE, NOW()),
('Brown Eggs (Dozen)', 'Farm-fresh brown eggs from happy, free-range chickens. Rich in nutrients and perfect for any recipe.', 3.00, 80, 'eggs', 4.7, 'https://images.unsplash.com/photo-1505253716362-1aea1d5d94c2?w=400', 'dozen', TRUE, NOW()),
('Organic Broiler Chicken', 'Certified organic broiler chicken raised without antibiotics or hormones. Perfect for health-conscious consumers.', 18.50, 25, 'broilers', 4.9, 'https://images.unsplash.com/photo-1546869209-fbb3689530d2?w=400', 'kg', TRUE, NOW()),
('Layer Chicks', 'High-quality layer chicks bred for high egg production. Vaccinated and disease-free.', 1.50, 150, 'chicks', 4.3, 'https://images.unsplash.com/photo-1577596275866-10ad5c0e7c77?w=400', 'piece', TRUE, NOW()),
('Starter Feed', 'Specialized starter feed for young chicks (0-4 weeks). High protein content for optimal growth.', 22.00, 40, 'feed', 4.4, 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400', 'bag', TRUE, NOW()),

-- Additional demo products for better variety
('Free-Range Turkey', 'Premium free-range turkey, perfect for holiday meals or special occasions. Naturally raised.', 25.00, 15, 'turkeys', 4.6, 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400', 'kg', TRUE, NOW()),
('Duck Eggs (Half Dozen)', 'Rich and flavorful duck eggs, perfect for baking or breakfast. Higher in protein than chicken eggs.', 4.50, 60, 'eggs', 4.4, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'half-dozen', TRUE, NOW()),
('Pekin Ducks', 'Healthy Pekin ducklings, fast-growing and excellent for meat production. Easy to raise.', 3.00, 75, 'ducks', 4.1, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', 'piece', TRUE, NOW()),
('Layer Feed', 'Specialized feed for laying hens to maximize egg production. Calcium-enriched formula.', 28.00, 35, 'feed', 4.5, 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400', 'bag', TRUE, NOW()),
('Fertilized Eggs', 'Fertilized chicken eggs for hatching. Perfect for starting your own flock.', 1.00, 500, 'eggs', 4.0, 'https://images.unsplash.com/photo-1518569656558-1f25e69393e7?w=400', 'piece', TRUE, NOW()),
('Broiler Feed', 'High-protein feed specifically formulated for broiler chickens to maximize growth.', 26.00, 45, 'feed', 4.7, 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400', 'bag', TRUE, NOW());

-- Insert demo admin user
INSERT INTO users (name, email, phone, password, role, is_active, created_at) VALUES
('Admin User', 'admin@simbofarm.com', '+1234567890', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE, NOW()), -- password: password
('John Customer', 'john@example.com', '+1987654321', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', TRUE, NOW()); -- password: password

-- Insert demo order (optional - for testing)
INSERT INTO orders (customer_id, customer_name, email, phone, address, total_amount, status, payment_status, notes, created_at) VALUES
(2, 'John Customer', 'john@example.com', '+1987654321', '123 Farm Road, Rural Area, State 12345', 20.50, 'confirmed', 'paid', 'Please deliver in the morning', NOW());

-- Insert demo order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at) VALUES
(1, 1, 2, 2.50, 5.00, NOW()), -- 2 dozen Fresh Organic Eggs
(1, 5, 1, 3.00, 3.00, NOW()), -- 1 dozen Brown Eggs
(1, 2, 1, 15.00, 12.50, NOW()); -- 1 kg Premium Broiler Chicken

-- Insert demo chat messages (optional - for testing chat feature)
INSERT INTO chat_messages (sender_id, sender_type, receiver_id, message, is_read, created_at) VALUES
(1, 'admin', 2, 'Welcome to Simbo Farm! How can we help you today?', TRUE, NOW()),
(2, 'customer', 1, 'Hi! I would like to place an order for some eggs.', TRUE, NOW()),
(1, 'admin', 2, 'Great! We have fresh organic eggs available. How many dozen would you like?', FALSE, NOW());

COMMIT;