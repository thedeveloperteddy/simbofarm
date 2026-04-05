// React Native API Client for Simbo Farm
// Save this as src/api/SimboFarmAPI.js in your React Native project

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = __DEV__ 
  ? 'http://127.0.0.1:8000/api/v1/client'  // Development
  : 'https://your-domain.com/api/v1/client'; // Production

class SimboFarmAPI {
  constructor() {
    this.baseURL = API_BASE;
  }

  // Get authentication token
  async getToken() {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Save authentication token
  async saveToken(token) {
    try {
      await AsyncStorage.setItem('access_token', token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  // Remove authentication token
  async removeToken() {
    try {
      await AsyncStorage.removeItem('access_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const token = await this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.apiCall('/health');
  }

  // Products
  async getProducts() {
    return this.apiCall('/products');
  }

  async getProduct(id) {
    return this.apiCall(`/products/${id}`);
  }

  async searchProducts(query, category = 'all') {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category !== 'all') params.append('category', category);
    
    return this.apiCall(`/search?${params}`);
  }

  async getCategories() {
    return this.apiCall('/categories');
  }

  // Orders
  async createOrder(orderData) {
    return this.apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id) {
    return this.apiCall(`/orders/${id}`);
  }

  async getUserOrders() {
    return this.apiCall('/user/orders');
  }

  // Contact
  async submitContact(contactData) {
    return this.apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Authentication (if implemented)
  async login(credentials) {
    // Example login method - adjust based on your auth implementation
    try {
      const response = await this.apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        await this.saveToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await this.removeToken();
    // Optionally call logout endpoint
    // return this.apiCall('/auth/logout', { method: 'POST' });
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }
}

// Export singleton instance
export default new SimboFarmAPI();

// Export individual methods for convenience
export const {
  healthCheck,
  getProducts,
  getProduct,
  searchProducts,
  getCategories,
  createOrder,
  getOrder,
  getUserOrders,
  submitContact,
  login,
  logout,
  isAuthenticated,
} = new SimboFarmAPI();
