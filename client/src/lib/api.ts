// API configuration for Laravel backend

const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Use proxy in development
  : (import.meta.env.VITE_API_URL || 
     document.querySelector('meta[name="api-url"]')?.getAttribute('content') || 
     '/api');

// API client with proper error handling
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Only add CSRF token in production (not needed for dev proxy)
    const csrfToken = !import.meta.env.DEV && document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Products
  async getProducts() {
    return this.request('/products');
  }

  // Contact
  async submitContact(data: { name: string; email: string; message: string }) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Cart operations
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId: number, quantity: number) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }
}

export const api = new ApiClient();
export default api;
