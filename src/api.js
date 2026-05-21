// ============================================
// MotoPeças Pro - API Helper Module
// ============================================

const BASE_URL = '/api';

// --- Token Management ---
export function getToken() {
  return localStorage.getItem('motopecas_token');
}

export function setToken(token) {
  localStorage.setItem('motopecas_token', token);
}

export function removeToken() {
  localStorage.removeItem('motopecas_token');
}

// --- Core Fetch ---
async function fetchAPI(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    let errorMessage = 'Erro ao processar a requisição';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Couldn't parse error response
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// --- Auth ---
export const auth = {
  login: (email, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  getMe: () => fetchAPI('/auth/me'),
};

// --- Dashboard ---
export const dashboard = {
  getStats: () => fetchAPI('/dashboard/stats'),

  getTopProducts: (limit = 10) =>
    fetchAPI(`/dashboard/top-products?limit=${limit}`),

  getSalesChart: (days = 7) =>
    fetchAPI(`/dashboard/sales-chart?days=${days}`),

  getRevenueChart: (days = 7) =>
    fetchAPI(`/dashboard/revenue-chart?days=${days}`),

  getStockAlerts: () => fetchAPI('/dashboard/stock-alerts'),

  getSellerPerformance: () => fetchAPI('/dashboard/seller-performance'),

  getAiInsights: () => fetchAPI('/dashboard/ai-insights'),
};

// --- Customers ---
export const customers = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/customers${query ? `?${query}` : ''}`);
  },

  get: (id) => fetchAPI(`/customers/${id}`),

  create: (data) =>
    fetchAPI('/customers', {
      method: 'POST',
      body: data,
    }),

  update: (id, data) =>
    fetchAPI(`/customers/${id}`, {
      method: 'PUT',
      body: data,
    }),

  delete: (id) =>
    fetchAPI(`/customers/${id}`, {
      method: 'DELETE',
    }),

  addVehicle: (customerId, data) =>
    fetchAPI(`/customers/${customerId}/vehicles`, {
      method: 'POST',
      body: data,
    }),

  removeVehicle: (customerId, vehicleId) =>
    fetchAPI(`/customers/${customerId}/vehicles/${vehicleId}`, {
      method: 'DELETE',
    }),

  getHistory: (id) => fetchAPI(`/customers/${id}/history`),
};

// --- Products ---
export const products = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/products${query ? `?${query}` : ''}`);
  },

  get: (id) => fetchAPI(`/products/${id}`),

  create: (data) =>
    fetchAPI('/products', {
      method: 'POST',
      body: data,
    }),

  update: (id, data) =>
    fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: data,
    }),

  delete: (id) =>
    fetchAPI(`/products/${id}`, {
      method: 'DELETE',
    }),

  search: (query) =>
    fetchAPI(`/products/search?q=${encodeURIComponent(query)}`),

  getLowStock: () => fetchAPI('/products/low-stock'),

  getStagnant: () => fetchAPI('/products/stagnant'),
};

// --- Sales ---
export const sales = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/sales${query ? `?${query}` : ''}`);
  },

  get: (id) => fetchAPI(`/sales/${id}`),

  create: (data) =>
    fetchAPI('/sales', {
      method: 'POST',
      body: data,
    }),

  getToday: () => fetchAPI('/sales/today'),

  getBySeller: (sellerId) => fetchAPI(`/sales/seller/${sellerId}`),
};

// --- Inventory ---
export const inventory = {
  getMovements: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/inventory/movements${query ? `?${query}` : ''}`);
  },

  createEntry: (data) =>
    fetchAPI('/inventory/entry', {
      method: 'POST',
      body: data,
    }),

  getForecast: () => fetchAPI('/inventory/forecast'),

  getTurnover: () => fetchAPI('/inventory/turnover'),
};

export default fetchAPI;
