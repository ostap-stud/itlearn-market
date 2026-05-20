import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import LoadingBlock from './components/LoadingBlock.jsx';
import ErrorBlock from './components/ErrorBlock.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import LearningPathPage from './pages/LearningPathPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { api, ApiError } from './api/client.js';
import { loadAuth, saveAuth, clearAuth } from './utils/authStorage.js';
import { loadFromStorage, saveToStorage } from './utils/storage.js';
import { initAnalytics, trackEvent, trackPageView } from './utils/analytics.js';

function getErrorMessage(error) {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Потрібно увійти в систему або перевірити логін і пароль.';
    if (error.status === 403) return 'Недостатньо прав для виконання цієї дії.';
    return error.message;
  }
  return 'Не вдалося виконати запит. Перевір підключення або повтори дію пізніше.';
}

export default function App() {
  const [page, setPage] = useState('home');
  const [auth, setAuth] = useState(() => loadAuth());
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => loadFromStorage('itlearn-cart', []));
  const [library, setLibrary] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notice, setNotice] = useState('');
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [libraryState, setLibraryState] = useState({ loading: false, error: '' });
  const [analyticsState, setAnalyticsState] = useState({ loading: false, error: '', data: null, orders: [] });

  const user = auth?.user || null;
  const token = auth?.token || null;
  const isAdmin = user?.role === 'ADMIN';

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  }

  async function loadProducts() {
    setProductsLoading(true);
    setProductsError('');
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setProductsError(getErrorMessage(error));
    } finally {
      setProductsLoading(false);
    }
  }

  async function loadLibrary(currentToken = token) {
    if (!currentToken) return;
    setLibraryState({ loading: true, error: '' });
    try {
      const data = await api.getLibrary(currentToken);
      setLibrary(Array.isArray(data) ? data : []);
      setLibraryState({ loading: false, error: '' });
    } catch (error) {
      setLibraryState({ loading: false, error: getErrorMessage(error) });
    }
  }

  async function loadAnalytics() {
    if (!token || !isAdmin) return;
    setAnalyticsState((state) => ({ ...state, loading: true, error: '' }));
    try {
      const [data, orders] = await Promise.all([
        api.getAnalytics(token),
        api.getAdminOrders(token)
      ]);
      setAnalyticsState({ loading: false, error: '', data, orders: Array.isArray(orders) ? orders : [] });
    } catch (error) {
      setAnalyticsState({ loading: false, error: getErrorMessage(error), data: null, orders: [] });
    }
  }

  useEffect(() => {
    initAnalytics();
    loadProducts();
  }, []);

  useEffect(() => {
    trackPageView(page);
  }, [page]);

  useEffect(() => {
    if (auth) {
      loadLibrary(auth.token);
    } else {
      setLibrary([]);
    }
  }, [auth]);

  useEffect(() => {
    if (page === 'analytics') {
      loadAnalytics();
    }
  }, [page, auth]);

  function openDetails(product) {
    setSelectedProduct(product);
    setPage('details');
    trackEvent('view_item', {
      item_id: product.id,
      item_name: product.title,
      item_category: product.category,
      value: Number(product.price || 0)
    });
  }

  function addToCart(product) {
    if (cart.includes(product.id)) {
      showNotice('Цей матеріал уже є в кошику.');
      return;
    }
    const next = [...cart, product.id];
    setCart(next);
    saveToStorage('itlearn-cart', next);
    trackEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.title,
      item_category: product.category,
      value: Number(product.price || 0)
    });
    showNotice('Матеріал додано до кошика.');
  }

  function addManyToCart(selectedProducts) {
    const ids = selectedProducts.map((product) => product.id);
    const next = Array.from(new Set([...cart, ...ids]));
    setCart(next);
    saveToStorage('itlearn-cart', next);
    showNotice('Навчальну траєкторію додано до кошика.');
  }

  function removeFromCart(id) {
    const next = cart.filter((item) => item !== id);
    setCart(next);
    saveToStorage('itlearn-cart', next);
    trackEvent('remove_from_cart', { item_id: id });
  }

  async function login(username, password) {
    setAuthLoading(true);
    try {
      const nextAuth = await api.login(username, password);
      setAuth(nextAuth);
      saveAuth(nextAuth);
      setPage('catalog');
      trackEvent('login', { method: 'basic', role: nextAuth.user.role });
      showNotice(`Вхід виконано: ${nextAuth.user.displayName}.`);
    } catch (error) {
      showNotice(getErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    setAuth(null);
    clearAuth();
    setPage('home');
    trackEvent('logout');
    showNotice('Вихід виконано.');
  }

  function goCheckout() {
    if (!user) {
      setPage('login');
      showNotice('Для оформлення замовлення потрібно увійти.');
      return;
    }
    trackEvent('begin_checkout', { items: cart.length });
    setPage('checkout');
  }

  async function confirmCheckout() {
    if (!token) {
      setPage('login');
      return;
    }

    const productIds = cart
      .map((id) => Number(id))
      .filter((id) => products.some((product) => Number(product.id) === Number(id)));

    if (productIds.length === 0) {
      showNotice('Кошик порожній.');
      return;
    }

    setCheckoutLoading(true);
    try {
      const order = await api.createOrder(productIds, token);
      trackEvent('purchase', {
        transaction_id: order?.id || Date.now(),
        value: Number(order?.total || 0),
        items: productIds.length
      });
      setCart([]);
      saveToStorage('itlearn-cart', []);
      await loadLibrary(token);
      setPage('library');
      showNotice('Замовлення створено. Матеріали додано до кабінету.');
    } catch (error) {
      showNotice(getErrorMessage(error));
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function createProduct(product) {
    if (!token || !isAdmin) return;
    setAdminLoading(true);
    try {
      const created = await api.createProduct(product, token);
      setProducts((current) => [created, ...current]);
      trackEvent('admin_create_product', { item_name: created.title, item_category: created.category });
      showNotice('Продукт додано до каталогу.');
    } catch (error) {
      showNotice(getErrorMessage(error));
    } finally {
      setAdminLoading(false);
    }
  }

  async function deleteProduct(id) {
    if (!token || !isAdmin) return;
    const confirmed = window.confirm('Видалити цей продукт з каталогу?');
    if (!confirmed) return;

    try {
      await api.deleteProduct(id, token);
      setProducts((current) => current.filter((product) => Number(product.id) !== Number(id)));
      setCart((current) => {
        const next = current.filter((item) => Number(item) !== Number(id));
        saveToStorage('itlearn-cart', next);
        return next;
      });
      trackEvent('admin_delete_product', { item_id: id });
      showNotice('Продукт видалено.');
    } catch (error) {
      showNotice(getErrorMessage(error));
    }
  }

  function renderProductsPage(children) {
    if (productsLoading) return <LoadingBlock message="Завантаження каталогу..." />;
    if (productsError) return <ErrorBlock title="Не вдалося завантажити каталог" message={productsError} onRetry={loadProducts} />;
    return children;
  }

  function renderProtected(children, adminOnly = false) {
    if (!user) {
      return <LoginPage onLogin={login} loading={authLoading} />;
    }
    if (adminOnly && !isAdmin) {
      return <ErrorBlock title="Доступ заборонено" message="Ця сторінка доступна лише адміністратору." />;
    }
    return children;
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <Header page={page} setPage={setPage} cartCount={cart.length} user={user} onLogout={logout} />
      <Toast message={notice} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        {page === 'home' && renderProductsPage(
          <HomePage
            products={products}
            onOpenCatalog={() => setPage('catalog')}
            onOpenPath={() => setPage('learningPath')}
            onDetails={openDetails}
            onAdd={addToCart}
          />
        )}
        {page === 'catalog' && renderProductsPage(<CatalogPage products={products} onDetails={openDetails} onAdd={addToCart} />)}
        {page === 'learningPath' && renderProductsPage(
          <LearningPathPage products={products} onDetails={openDetails} onAdd={addToCart} onAddMany={addManyToCart} />
        )}
        {page === 'details' && <ProductDetailsPage product={selectedProduct} onBack={() => setPage('catalog')} onAdd={addToCart} />}
        {page === 'cart' && renderProductsPage(<CartPage cart={cart} products={products} onRemove={removeFromCart} onCheckout={goCheckout} />)}
        {page === 'checkout' && renderProductsPage(renderProtected(
          <CheckoutPage cart={cart} products={products} user={user} onConfirm={confirmCheckout} loading={checkoutLoading} />
        ))}
        {page === 'library' && renderProtected(
          <LibraryPage products={library} loading={libraryState.loading} error={libraryState.error} onRetry={() => loadLibrary()} />
        )}
        {page === 'login' && <LoginPage onLogin={login} loading={authLoading} />}
        {page === 'admin' && renderProtected(
          renderProductsPage(<AdminPage products={products} onCreateProduct={createProduct} onDeleteProduct={deleteProduct} loading={adminLoading} />),
          true
        )}
        {page === 'analytics' && renderProtected(
          <AnalyticsPage
            analytics={analyticsState.data}
            orders={analyticsState.orders}
            products={products}
            loading={analyticsState.loading}
            error={analyticsState.error}
            onRetry={loadAnalytics}
          />,
          true
        )}
      </main>

      <Footer />
    </div>
  );
}
