-- Quick Setup Script for Simbo Farm Database
-- Run this in MySQL command line or phpMyAdmin

-- 1. Create database
CREATE DATABASE IF NOT EXISTS simbo_farm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE simbo_farm;

-- 2. Run the complete schema (copy and paste from simbo_farm_complete_schema.sql)
-- The complete schema includes tables, indexes, and demo data

-- 3. Verify setup
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_orders FROM orders;

-- Optional: Create a backup user for the application
-- GRANT ALL PRIVILEGES ON simbo_farm.* TO 'simbo_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- FLUSH PRIVILEGES;