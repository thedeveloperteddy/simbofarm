const API_BASE = import.meta.env.DEV 
  ? '/api/v1/client'  // Use proxy in development
  : '/api/v1/client'; // Production URL

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('access_token');
};

// Generic API call function with authentication
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include', // Important for cookies
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Specific API methods
export const api = {
  get: (endpoint: string) => apiCall(endpoint),
  post: (endpoint: string, data: any) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint: string, data: any) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint: string) => apiCall(endpoint, {
    method: 'DELETE',
  }),
};

// Public API calls (no authentication required)
export const publicApi = {
  post: (endpoint: string, data: any) => {
    return fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    }).then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    });
  },
};

// Legacy API fallback (for backward compatibility)
export const legacyApi = {
  get: (endpoint: string) => {
    return fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() && { 'Authorization': `Bearer ${getToken()}` }),
      },
      credentials: 'include',
    }).then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    });
  },
};
