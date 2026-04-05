# Simbo Farm - Poultry Management System

A comprehensive poultry farm management system with customer web application, admin dashboard, and Laravel backend API.

## Features

### Customer Portal
- Browse poultry products (eggs, broilers, feed, chicks)
- Shopping cart and checkout
- Real-time chat support
- Order tracking
- Multi-language support (English, Amharic, Oromiffa)

### Admin Dashboard
- Product inventory management
- Order management with status updates
- Customer management with analytics
- Real-time chat support interface
- Sales statistics and reporting
- Low stock alerts

### Backend API
- RESTful API with Laravel
- MySQL database
- Real-time chat functionality
- JWT authentication
- CORS support for multi-origin
- Admin and client role separation

## Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **MySQL** - Database
- **PHP 8.2+** - Server language

### Client (Customer Portal)
- **Next.js 15** - React Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

### Admin Dashboard
- **React Native** (Expo) - Cross-platform
- **TypeScript** - Type safety

## Installation

### Prerequisites
- PHP 8.2+
- MySQL 5.7+
- Node.js 18+
- Composer

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/simbo-farm.git
cd simbo-farm
```

### 2. Backend Setup
```bash
composer install
cp .env.example .env
php artisan key:generate
php public/setup-database.php
php artisan serve --port=8000
```

### 3. Client Setup
```bash
cd client
npm install
npm run dev
```

### 4. Dashboard Setup
```bash
cd dashboard
npm install
npx expo start --web
```

## Environment Configuration

Copy `.env.example` to `.env` and configure database and CORS settings.

## Database Setup

Visit `http://localhost:8000/setup-database.php` for automated setup.

### Add Admin User
```sql
INSERT INTO users (name, email, phone, password, role, created_at) 
VALUES ('Admin', 'admin@simbofarm.com', '+1234567890', 'pass', 'admin', NOW());
```

## Default Login
- **Phone**: +1234567890
- **Code**: 1234

## Security Notes

- Never commit `.env` file
- Change default credentials
- Use HTTPS in production
- Enable CORS only for trusted domains

## License

MIT License
