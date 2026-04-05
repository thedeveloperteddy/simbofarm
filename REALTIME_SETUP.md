# 🚀 Real-Time System Setup Guide

## ✅ **Current Status: Real-Time Ready**

Your React Native dashboard now has **real-time messaging and product upload** capabilities using WebSockets.

### 🔌 **WebSocket Implementation**

#### **Frontend Components:**
- ✅ `WebSocketService.ts` - Socket.IO client service
- ✅ `RealtimeChatScreen.tsx` - Real-time admin chat
- ✅ Navigation integration - Chat accessible from dashboard
- ✅ Event listeners for messages, products, and stats

#### **Backend Components:**
- ✅ `AdminController.php` - Phone authentication
- ✅ `RealtimeController.php` - Real-time endpoints
- ✅ `AdminMessageReceived.php` - Message broadcast event
- ✅ `ProductUploaded.php` - Product upload event
- ✅ API routes for real-time features

## 🛠️ **Setup Required**

### **Step 1: Install Laravel WebSocket Dependencies**
```bash
cd c:\xampp\htdocs\simbo
composer require pusher/pusher-php-server
npm install --save-dev laravel-echo pusher-js
```

### **Step 2: Configure Broadcasting**
```bash
php artisan broadcast:install
```

### **Step 3: Update Environment (.env)**
```env
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=mt1
```

### **Step 4: Start WebSocket Server**
```bash
# Option A: Laravel Echo Server
php artisan websockets:serve

# Option B: Pusher Channels (Recommended)
# Sign up at pusher.com and get credentials
```

### **Step 5: Test Real-Time Features**

#### **1. Start All Servers:**
```bash
# Laravel Backend
cd c:\xampp\htdocs\simbo
php artisan serve --host=0.0.0.0

# WebSocket Server
php artisan websockets:serve

# React Native Dashboard
cd D:\simbofarm\dashboard
npm start
```

#### **2. Test Real-Time Chat:**
1. Login with phone: `+1234567890` and code: `1234`
2. Tap chat button in dashboard header
3. Send message - should appear instantly to all admins
4. Open dashboard on another device - should see same messages

#### **3. Test Product Upload:**
1. Go to Products screen
2. Add new product
3. All connected admins should see notification instantly

## 📱 **Real-Time Features**

### **✅ Admin Chat System**
- **Live Messaging**: All admins see messages instantly
- **Connection Status**: Shows online/offline status
- **Message History**: Persistent chat history
- **User Indicators**: Shows who's online

### **✅ Product Upload Notifications**
- **Instant Alerts**: All admins notified when products added
- **Product Details**: Shows product info in real-time
- **User Attribution**: Shows who uploaded what

### **✅ Statistics Updates**
- **Live Stats**: Real-time dashboard updates
- **Order Status**: Instant order status changes
- **Inventory Updates**: Live stock level changes

## 🔧 **WebSocket Events**

### **Chat Events:**
```typescript
// Listen for messages
WebSocketService.on('message', (data: MessageEvent) => {
    console.log('New message:', data.message);
});

// Send message
WebSocketService.sendMessage('Hello admins!', 'Admin User');
```

### **Product Events:**
```typescript
// Listen for product uploads
WebSocketService.on('product', (data: ProductEvent) => {
    console.log('New product:', data.product);
});

// Upload product
WebSocketService.uploadProduct(productData, 'Admin User');
```

### **Connection Events:**
```typescript
// User joined
WebSocketService.on('user_joined', (data) => {
    console.log('Admin online:', data);
});

// User left
WebSocketService.on('user_left', (data) => {
    console.log('Admin offline:', data);
});
```

## 🌐 **API Endpoints**

### **Real-Time Endpoints:**
```
POST /api/v1/client/realtime/send-message
POST /api/v1/client/realtime/upload-product
GET  /api/v1/client/realtime/stats
```

### **Authentication Endpoints:**
```
POST /api/v1/client/admin/check-phone
POST /api/v1/client/admin/login
POST /api/v1/client/admin/logout
```

## 🎯 **Testing Checklist**

### **✅ WebSocket Connection:**
- [ ] WebSocket server running on port 6001
- [ ] React Native connects successfully
- [ ] Connection status shows "Connected"
- [ ] Reconnection works on disconnect

### **✅ Real-Time Chat:**
- [ ] Messages send instantly
- [ ] All admins receive messages
- [ ] Message history persists
- [ ] User status updates work

### **✅ Product Notifications:**
- [ ] Product uploads trigger notifications
- [ ] All admins see product updates
- [ ] Product details display correctly

### **✅ Dashboard Integration:**
- [ ] Chat button works from dashboard
- [ ] Navigation between screens works
- [ ] Real-time stats update
- [ ] Error handling works

## 🚨 **Troubleshooting**

### **WebSocket Connection Issues:**
```bash
# Check if port 6001 is free
netstat -an | findstr :6001

# Restart WebSocket server
php artisan websockets:restart
```

### **CORS Issues:**
```php
// config/cors.php
'paths' => ['api/*', 'app/*'],
'allowed_origins' => ['http://localhost:8081', 'exp://*'],
```

### **Authentication Issues:**
```bash
# Clear Laravel cache
php artisan config:cache
php artisan route:cache
```

## 🎉 **Production Deployment**

### **WebSocket Server:**
- Use Pusher Channels for production
- Configure SSL certificates
- Set up proper load balancing

### **React Native Build:**
```bash
cd D:\simbofarm\dashboard
expo build:android
expo build:ios
```

### **Laravel Deployment:**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📞 **Support**

**Real-time system is implemented and ready!**

1. **Install WebSocket dependencies** (Step 1-3)
2. **Start WebSocket server** (Step 4)
3. **Test real-time features** (Step 5)

**Your admin dashboard will have instant messaging and live updates!** 🚀
