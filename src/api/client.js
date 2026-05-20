import {
  createLocalOrder,
  findLocalUser,
  getLocalAnalytics,
  getLocalLibrary,
  getLocalOrders,
  getLocalProducts,
  saveLocalProducts
} from './localStore.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_MODE = import.meta.env.VITE_API_MODE || 'auto';
const USE_LOCAL_FALLBACK = API_MODE !== 'api';

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function toBasicToken(username, password) {
  return window.btoa(`${username}:${password}`);
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    Accept: 'application/json'
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Basic ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const contentType = response.headers.get('content-type') || '';
  const hasJson = contentType.includes('application/json');
  const data = hasJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || data?.error || `HTTP ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

function shouldUseLocal() {
  return API_MODE === 'local';
}

async function withLocalFallback(remoteCall, fallbackCall) {
  if (shouldUseLocal()) return fallbackCall();
  try {
    return await remoteCall();
  } catch (error) {
    if (!USE_LOCAL_FALLBACK) throw error;
    return fallbackCall(error);
  }
}

export const api = {
  async login(username, password) {
    const token = toBasicToken(username, password);
    return withLocalFallback(
      async () => {
        const user = await request('/auth/me', { token });
        return { user, token };
      },
      () => {
        const user = findLocalUser(username, password);
        if (!user) {
          throw new ApiError('Неправильний логін або пароль.', 401);
        }
        const { password: _password, ...safeUser } = user;
        return { user: safeUser, token };
      }
    );
  },

  getProducts() {
    return withLocalFallback(
      () => request('/products'),
      () => getLocalProducts()
    );
  },

  getProduct(id) {
    return withLocalFallback(
      () => request(`/products/${id}`),
      () => getLocalProducts().find((product) => Number(product.id) === Number(id))
    );
  },

  createOrder(productIds, token) {
    return withLocalFallback(
      () => request('/orders', {
        method: 'POST',
        token,
        body: { productIds }
      }),
      () => createLocalOrder(productIds, token)
    );
  },

  getLibrary(token) {
    return withLocalFallback(
      () => request('/me/library', { token }),
      () => getLocalLibrary(token)
    );
  },

  getMyOrders(token) {
    return withLocalFallback(
      () => request('/me/orders', { token }),
      () => getLocalOrders()
    );
  },

  createProduct(product, token) {
    return withLocalFallback(
      () => request('/products', {
        method: 'POST',
        token,
        body: product
      }),
      () => {
        const products = getLocalProducts();
        const created = {
          ...product,
          id: products.length ? Math.max(...products.map((item) => Number(item.id))) + 1 : 1
        };
        saveLocalProducts([created, ...products]);
        return created;
      }
    );
  },

  updateProduct(id, product, token) {
    return withLocalFallback(
      () => request(`/products/${id}`, {
        method: 'PUT',
        token,
        body: product
      }),
      () => {
        const products = getLocalProducts();
        const updated = { ...product, id: Number(id) };
        saveLocalProducts(products.map((item) => (Number(item.id) === Number(id) ? updated : item)));
        return updated;
      }
    );
  },

  deleteProduct(id, token) {
    return withLocalFallback(
      () => request(`/products/${id}`, {
        method: 'DELETE',
        token
      }),
      () => {
        const products = getLocalProducts().filter((product) => Number(product.id) !== Number(id));
        saveLocalProducts(products);
        return null;
      }
    );
  },

  getAnalytics(token) {
    return withLocalFallback(
      () => request('/admin/analytics', { token }),
      () => getLocalAnalytics()
    );
  },

  getAdminOrders(token) {
    return withLocalFallback(
      () => request('/admin/orders', { token }),
      () => getLocalOrders()
    );
  }
};

export { API_BASE_URL, API_MODE };
