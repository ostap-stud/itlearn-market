import { initialProducts } from '../data/products.js';
import { demoUsers } from '../data/users.js';

const PRODUCTS_KEY = 'itlearn-products-local';
const ORDERS_KEY = 'itlearn-orders-local';
const PATHS_KEY = 'itlearn-paths-local';

function read(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage can be unavailable in private mode or preview environments
  }
}

export function getLocalProducts() {
  const products = read(PRODUCTS_KEY, null);
  if (Array.isArray(products) && products.length > 0) return products;
  write(PRODUCTS_KEY, initialProducts);
  return initialProducts;
}

export function saveLocalProducts(products) {
  write(PRODUCTS_KEY, products);
}

export function getLocalOrders() {
  return read(ORDERS_KEY, []);
}

export function saveLocalOrders(orders) {
  write(ORDERS_KEY, orders);
}

export function getLocalPaths() {
  return read(PATHS_KEY, []);
}

export function saveLocalPaths(paths) {
  write(PATHS_KEY, paths);
}

export function findLocalUser(username, password) {
  return demoUsers.find((user) => user.username === username && user.password === password) || null;
}

export function getLocalUserByToken(token) {
  if (!token) return null;
  try {
    const decoded = window.atob(token);
    const [username] = decoded.split(':');
    return demoUsers.find((user) => user.username === username) || null;
  } catch {
    return null;
  }
}

export function createLocalOrder(productIds, token) {
  const user = getLocalUserByToken(token) || demoUsers[0];
  const products = getLocalProducts();
  const selectedProducts = productIds
    .map((id) => products.find((product) => Number(product.id) === Number(id)))
    .filter(Boolean);
  const total = selectedProducts.reduce((sum, product) => sum + Number(product.price || 0), 0);
  const orders = getLocalOrders();
  const order = {
    id: orders.length ? Math.max(...orders.map((item) => Number(item.id))) + 1 : 1,
    username: user.username,
    total,
    status: 'PAID',
    productIds: selectedProducts.map((product) => Number(product.id)),
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  saveLocalOrders([order, ...orders]);
  return order;
}

export function getLocalLibrary(token) {
  const user = getLocalUserByToken(token) || demoUsers[0];
  const productIds = new Set(
    getLocalOrders()
      .filter((order) => order.username === user.username)
      .flatMap((order) => order.productIds || [])
      .map(Number)
  );
  return getLocalProducts().filter((product) => productIds.has(Number(product.id)));
}

export function getLocalAnalytics() {
  const products = getLocalProducts();
  const orders = getLocalOrders();
  const purchasedItems = orders.reduce((sum, order) => sum + (order.productIds?.length || 0), 0);
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const categoryMap = new Map();

  products.forEach((product) => {
    const key = product.direction || product.category || 'Інше';
    const current = categoryMap.get(key) || { direction: key, products: 0, reviews: 0, ratingSum: 0 };
    current.products += 1;
    current.reviews += Number(product.reviews || 0);
    current.ratingSum += Number(product.rating || 0);
    categoryMap.set(key, current);
  });

  const popularDirections = [...categoryMap.values()]
    .map((item) => ({
      ...item,
      avgRating: item.products ? item.ratingSum / item.products : 0
    }))
    .sort((a, b) => b.reviews - a.reviews);

  return {
    productCount: products.length,
    orderCount: orders.length,
    purchasedItems,
    totalRevenue,
    averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
    popularDirections,
    generatedPaths: getLocalPaths().length
  };
}

export function recordLocalPath(path) {
  const paths = getLocalPaths();
  saveLocalPaths([
    {
      id: paths.length ? Math.max(...paths.map((item) => Number(item.id))) + 1 : 1,
      createdAt: new Date().toISOString(),
      ...path
    },
    ...paths
  ]);
}
