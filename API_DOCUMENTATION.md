# Simbo Farm API Documentation

## Overview

This API provides endpoints for the Simbo Farm poultry management system, supporting both web and mobile applications.

**Base URL**: `http://your-domain.com/api/v1/client`

## Authentication

Most endpoints are public, but some require authentication using Bearer tokens:

```http
Authorization: Bearer {token}
```

## Endpoints

### Health Check

**GET** `/health`

Check API status.

**Response**:
```json
{
  "status": "ok",
  "message": "API is working",
  "timestamp": "2026-03-06T10:12:11.592824Z",
  "version": "1.0.0"
}
```

### Products

#### Get All Products

**GET** `/products`

Retrieve all active products.

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "p_name": "Fresh Organic Eggs",
      "p_discription": "Premium quality organic eggs from free-range chickens.",
      "p_price": "2.50",
      "p_number_of_sallary": 100,
      "p_type": "eggs",
      "p_rating": "4.5",
      "p_midea": "https://images.unsplash.com/photo-1518569656558-1f25e69393e7?w=400",
      "p_date": 1772791787,
      "is_active": true
    }
  ],
  "message": "Products retrieved successfully"
}
```

#### Get Single Product

**GET** `/products/{id}`

Retrieve a specific product by ID.

**Parameters**:
- `id` (integer): Product ID

**Response**:
```json
{
  "data": {
    "id": 1,
    "p_name": "Fresh Organic Eggs",
    "p_discription": "Premium quality organic eggs from free-range chickens.",
    "p_price": "2.50",
    "p_number_of_sallary": 100,
    "p_type": "eggs",
    "p_rating": "4.5",
    "p_midea": "https://images.unsplash.com/photo-1518569656558-1f25e69393e7?w=400",
    "p_date": 1772791787,
    "is_active": true
  }
}
```

#### Search Products

**GET** `/search`

Search products by name and/or category.

**Parameters**:
- `q` (string, optional): Search query
- `category` (string, optional): Category filter (`eggs`, `broilers`, `feed`, `chicks`)

**Example**:
```
GET /search?q=organic&category=eggs
```

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "p_name": "Fresh Organic Eggs",
      "p_discription": "Premium quality organic eggs from free-range chickens.",
      "p_price": "2.50",
      "p_number_of_sallary": 100,
      "p_type": "eggs",
      "p_rating": "4.5",
      "p_midea": "https://images.unsplash.com/photo-1518569656558-1f25e69393e7?w=400",
      "p_date": 1772791787
    }
  ],
  "message": "Search results"
}
```

#### Get Categories

**GET** `/categories`

Get all available product categories.

**Response**:
```json
{
  "data": [
    {
      "key": "eggs",
      "label": "Eggs"
    },
    {
      "key": "broilers",
      "label": "Broilers"
    },
    {
      "key": "chicks",
      "label": "Chicks"
    },
    {
      "key": "feed",
      "label": "Feed"
    }
  ],
  "message": "Categories retrieved successfully"
}
```

### Orders

#### Create Order

**POST** `/orders`

Create a new order.

**Request Body**:
```json
{
  "customer_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Farm Road, City, Country",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ],
  "notes": "Deliver after 5 PM"
}
```

**Response**:
```json
{
  "data": {
    "id": 123,
    "customer_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Farm Road, City, Country",
    "total_amount": 20.00,
    "status": "pending",
    "order_items": [
      {
        "product_id": 1,
        "product_name": "Fresh Organic Eggs",
        "quantity": 2,
        "price": "2.50",
        "total": 5.00
      }
    ],
    "created_at": "2026-03-06T10:15:30.000000Z"
  },
  "message": "Order created successfully"
}
```

#### Get Order

**GET** `/orders/{id}`

Retrieve a specific order by ID.

**Parameters**:
- `id` (integer): Order ID

**Response**:
```json
{
  "data": {
    "id": 123,
    "customer_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Farm Road, City, Country",
    "total_amount": 20.00,
    "status": "pending",
    "order_items": [...],
    "notes": "Deliver after 5 PM",
    "created_at": "2026-03-06T10:15:30.000000Z"
  }
}
```

#### Get User Orders (Authenticated)

**GET** `/user/orders`

Get orders for the authenticated user.

**Headers**:
```
Authorization: Bearer {token}
```

**Response**:
```json
{
  "data": [
    {
      "id": 123,
      "customer_name": "John Doe",
      "total_amount": 20.00,
      "status": "pending",
      "created_at": "2026-03-06T10:15:30.000000Z"
    }
  ],
  "message": "Orders retrieved successfully"
}
```

### Contact

#### Submit Contact Form

**POST** `/contact`

Submit a contact form message.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I would like to inquire about bulk orders."
}
```

**Response**:
```json
{
  "message": "Contact form submitted successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "I would like to inquire about bulk orders."
  }
}
```

## Data Models

### Product

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier |
| p_name | string | Product name |
| p_discription | text | Product description |
| p_price | decimal | Product price |
| p_number_of_sallary | integer | Stock quantity |
| p_type | string | Category (eggs, broilers, feed, chicks) |
| p_rating | decimal | Product rating (0-5) |
| p_midea | string | Image URL |
| p_date | integer | Creation timestamp |
| is_active | boolean | Active status |

### Order

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique identifier |
| customer_name | string | Customer name |
| email | string | Customer email |
| phone | string | Customer phone |
| address | string | Delivery address |
| total_amount | decimal | Order total |
| status | enum | Order status (pending, confirmed, delivered, cancelled) |
| order_items | array | Order items |
| notes | text | Order notes (optional) |
| created_at | datetime | Creation timestamp |

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

**400 Bad Request**:
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

**404 Not Found**:
```json
{
  "message": "Product not found"
}
```

**401 Unauthorized**:
```json
{
  "message": "Unauthorized"
}
```

**500 Internal Server Error**:
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## CORS

The API supports CORS for cross-origin requests from web and mobile applications.

## React Native Integration

### Example API Client

```javascript
// api.js
const API_BASE = 'http://your-domain.com/api/v1/client';

const apiCall = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('access_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const api = {
  get: (endpoint) => apiCall(endpoint),
  post: (endpoint, data) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Usage examples
export const getProducts = () => api.get('/products');
export const createOrder = (orderData) => api.post('/orders', orderData);
export const submitContact = (contactData) => api.post('/contact', contactData);
```

### React Native Component Example

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getProducts } from './api';

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Text>{item.p_name}</Text>
            <Text>${item.p_price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ProductsScreen;
```

## Testing

### curl Examples

```bash
# Health check
curl http://localhost:8000/api/v1/client/health

# Get products
curl http://localhost:8000/api/v1/client/products

# Create order
curl -X POST http://localhost:8000/api/v1/client/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Farm Road",
    "items": [{"product_id": 1, "quantity": 2}]
  }'
```

## Support

For API support and questions, contact the development team or check the application logs for detailed error information.
