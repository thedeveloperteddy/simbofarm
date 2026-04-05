-- Simbo Farm Database Schema
-- MySQL/MariaDB Compatible
-- Run this in phpMyAdmin to create the complete database

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

-- Product reviews/ratings
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_review (product_id, user_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table (for organizing products)
CREATE TABLE IF NOT EXISTS categories (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings table (for system configuration)
CREATE TABLE IF NOT EXISTS settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(255) NOT NULL UNIQUE,
    `value` TEXT NULL,
    type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity log (for tracking admin actions)
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NULL,
    entity_id BIGINT UNSIGNED NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions table (for authentication)
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload LONGTEXT NOT NULL,
    last_activity INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_last_activity (last_activity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
INSERT INTO users (name, email, phone, password, role, is_active, phone_verified_at, email_verified_at) VALUES
('System Admin', 'admin@simbofarm.com', '+251911000000', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE, NOW(), NOW()),
('Test Customer', 'customer@test.com', '+251922000000', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', TRUE, NOW(), NULL);

-- Insert sample categories with Amharic and Oromiffa translations
INSERT INTO categories (name, name_am, name_or, description, is_active, display_order) VALUES
('Eggs', 'እንቁላል', 'Maqaa', 'Fresh farm eggs collected daily', TRUE, 1),
('Broilers', 'የስጋ ዶሮ', 'Horo nyaataa', 'Meat chickens ready for market', TRUE, 2),
('Layers', 'እንቁላል የሚሰጥ ዶሮ', 'Horo qehee', 'Egg-laying hens', TRUE, 3),
('Chicks', 'የዶሮ ጫጩቶች', 'Gogaa horoo', 'Day-old and week-old chicks', TRUE, 4),
('Feed', 'መኖ', 'Nyaataa horoo', 'Quality poultry feed and supplements', TRUE, 5),
('Ducks', 'የዶሮ አይነት', 'Bataalaa', 'Farm raised ducks', TRUE, 6);

-- Insert sample products
INSERT INTO products (p_name, p_description, p_price, p_stock, p_type, p_rating, p_unit, is_active) VALUES
('Fresh White Eggs', 'Farm fresh white eggs, collected daily from free-range hens', 8.50, 500, 'eggs', 4.8, 'tray', TRUE),
('Brown Organic Eggs', 'Organic brown eggs from pasture-raised chickens', 12.00, 300, 'eggs', 4.9, 'tray', TRUE),
('Broiler Chicken', 'Whole dressed broiler chicken, ready to cook', 350.00, 50, 'broilers', 4.7, 'kg', TRUE),
('Chicken Parts - Breast', 'Fresh chicken breast, boneless and skinless', 280.00, 80, 'broilers', 4.6, 'kg', TRUE),
('Starter Feed', 'High protein starter feed for chicks (0-8 weeks)', 45.00, 200, 'feed', 4.5, 'kg', TRUE),
('Grower Feed', 'Balanced grower feed for young chickens', 40.00, 150, 'feed', 4.6, 'kg', TRUE),
('Layer Feed', 'Calcium-rich feed for laying hens', 42.00, 180, 'feed', 4.7, 'kg', TRUE),
('Day-Old Chicks', 'Healthy day-old broiler chicks', 45.00, 1000, 'chicks', 4.8, 'piece', TRUE),
('Week-Old Layers', 'One week old layer chicks, vaccinated', 55.00, 800, 'chicks', 4.7, 'piece', TRUE),
('Duck Meat', 'Fresh farm duck, whole dressed', 400.00, 30, 'ducks', 4.6, 'kg', TRUE);

-- Insert system settings
INSERT INTO settings (`key`, `value`, `type`) VALUES
('site_name', 'Simbo Farm', 'string'),
('site_currency', 'ETB', 'string'),
('contact_phone', '+251911000000', 'string'),
('contact_email', 'info@simbofarm.com', 'string'),
('delivery_fee', '50.00', 'string'),
('min_order_amount', '100.00', 'string'),
('enable_chat', 'true', 'boolean'),
('enable_reviews', 'true', 'boolean'),
('maintenance_mode', 'false', 'boolean');

-- Insert sample orders for testing
INSERT INTO orders (customer_id, customer_name, email, phone, address, total_amount, status, payment_status, notes, created_at) VALUES
(2, 'Abebe Kebede', 'abebe@email.com', '+251911111111', 'Addis Ababa, Bole Subcity', 245.00, 'delivered', 'paid', 'Please deliver in the morning', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(2, 'Abebe Kebede', 'abebe@email.com', '+251911111111', 'Addis Ababa, Bole Subcity', 120.50, 'confirmed', 'paid', NULL, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(NULL, 'Tigist Haile', 'tigist@email.com', '+251922222222', 'Addis Ababa, Arada Subcity', 450.00, 'pending', 'pending', 'First time customer', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(NULL, 'Dawit Mekonnen', 'dawit@email.com', '+251933333333', 'Hawassa, Ethiopia', 890.00, 'processing', 'paid', 'Bulk order for restaurant', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 10, 8.50, 85.00),
(1, 2, 5, 12.00, 60.00),
(1, 5, 2, 45.00, 90.00),
(1, 9, 2, 55.00, 110.00),
(2, 1, 10, 8.50, 85.00),
(2, 6, 1, 40.00, 40.00),
(3, 3, 1, 350.00, 350.00),
(3, 4, 1, 280.00, 280.00),
(4, 2, 20, 12.00, 240.00),
(4, 8, 10, 45.00, 450.00),
(4, 9, 5, 55.00, 275.00);

-- Insert sample chat messages
INSERT INTO chat_messages (sender_id, sender_type, receiver_id, message, is_read, created_at) VALUES
(2, 'customer', 1, 'Hello, I want to order eggs. Do you have them in stock?', TRUE, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 'admin', 2, 'Yes, we have plenty of fresh eggs available. How many trays do you need?', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR 55 MINUTE)),
(2, 'customer', 1, 'I need 10 trays of white eggs and 5 trays of brown eggs.', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR 30 MINUTE)),
(1, 'admin', 2, 'Perfect! That will be 85 ETB per tray for white and 120 ETB for brown. Total 1370 ETB. We can deliver tomorrow morning.', FALSE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, 'customer', 1, 'Great, please deliver to my address in Bole.', FALSE, DATE_SUB(NOW(), INTERVAL 45 MINUTE));

-- Create events for automatic tasks (MySQL 5.7+)
-- This will automatically update product ratings based on reviews
DELIMITER //

CREATE TRIGGER IF NOT EXISTS update_product_rating_after_insert 
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    DECLARE avg_rating DECIMAL(2,1);
    SELECT AVG(rating) INTO avg_rating FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE;
    UPDATE products SET p_rating = avg_rating WHERE id = NEW.product_id;
END//

CREATE TRIGGER IF NOT EXISTS update_product_rating_after_update 
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    DECLARE avg_rating DECIMAL(2,1);
    SELECT AVG(rating) INTO avg_rating FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE;
    UPDATE products SET p_rating = avg_rating WHERE id = NEW.product_id;
END//

DELIMITER ;

-- Create views for common queries
CREATE OR REPLACE VIEW order_summary AS
SELECT 
    o.id,
    o.customer_name,
    o.phone,
    o.total_amount,
    o.status,
    o.payment_status,
    o.created_at,
    COUNT(oi.id) as item_count,
    SUM(oi.quantity) as total_quantity
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

CREATE OR REPLACE VIEW product_inventory AS
SELECT 
    p.id,
    p.p_name,
    p.p_type,
    p.p_price,
    p.p_stock,
    p.is_active,
    COALESCE(SUM(oi.quantity), 0) as total_sold,
    p.p_stock - COALESCE(SUM(oi.quantity), 0) as available_stock
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
GROUP BY p.id;

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON simbo_farm.* TO 'simbouser'@'localhost' IDENTIFIED BY 'your_secure_password';
-- FLUSH PRIVILEGES;
