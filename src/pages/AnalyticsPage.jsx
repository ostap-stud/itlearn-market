import SectionTitle from '../components/SectionTitle.jsx';
import LoadingBlock from '../components/LoadingBlock.jsx';
import ErrorBlock from '../components/ErrorBlock.jsx';
import { formatPrice } from '../utils/format.js';
import { getTrackedEvents } from '../utils/analytics.js';

function buildDirections(products) {
  const map = new Map();
  products.forEach((product) => {
    const key = product.direction || product.category || 'Інше';
    const current = map.get(key) || { direction: key, products: 0, reviews: 0, ratingSum: 0 };
    current.products += 1;
    current.reviews += Number(product.reviews || 0);
    current.ratingSum += Number(product.rating || 0);
    map.set(key, current);
  });
  return [...map.values()]
    .map((item) => ({ ...item, avgRating: item.products ? item.ratingSum / item.products : 0 }))
    .sort((a, b) => b.reviews - a.reviews);
}

export default function AnalyticsPage({ analytics, orders, products = [], loading, error, onRetry }) {
  const directions = analytics?.popularDirections || buildDirections(products);
  const trackedEvents = getTrackedEvents().slice(-8).reverse();
  const metrics = analytics ? [
    [analytics.productCount, 'товарів у каталозі'],
    [analytics.orderCount, 'замовлень'],
    [analytics.purchasedItems, 'придбаних позицій'],
    [formatPrice(analytics.totalRevenue), 'загальний дохід'],
    [formatPrice(Math.round(analytics.averageOrderValue)), 'середній чек']
  ] : [];

  return (
    <section>
      <SectionTitle
        eyebrow="Аналітика"
        title="Маркетингові та комерційні показники"
        description="Розділ відображає ключові показники продажів, замовлення, популярність навчальних напрямів і взаємодію користувачів із каталогом та персоналізованим підбором."
      />
      {loading && <LoadingBlock />}
      {!loading && error && <ErrorBlock title="Не вдалося завантажити аналітику" message={error} onRetry={onRetry} />}
      {!loading && !error && analytics && (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {metrics.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="text-3xl font-extrabold text-neutral-950">{value}</div>
                <div className="mt-1 text-sm text-neutral-600">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-950">Популярні напрями навчання</h3>
              <div className="mt-4 space-y-3">
                {directions.map((item) => (
                  <div key={item.direction} className="rounded-2xl bg-neutral-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold text-neutral-950">{item.direction}</div>
                      <div className="text-sm text-neutral-600">★ {item.avgRating.toFixed(1)}</div>
                    </div>
                    <div className="mt-2 text-sm text-neutral-600">{item.products} продуктів · {item.reviews} відгуків</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-950">Останні події інтерфейсу</h3>
              <div className="mt-4 space-y-3">
                {trackedEvents.map((event, index) => (
                  <div key={`${event.name}-${index}`} className="rounded-2xl bg-neutral-50 p-4">
                    <div className="font-semibold text-neutral-950">{event.name}</div>
                    <div className="mt-1 break-all text-xs text-neutral-600">{JSON.stringify(event.params)}</div>
                  </div>
                ))}
                {trackedEvents.length === 0 && <div className="py-6 text-center text-neutral-500">Події з’являться після взаємодії з каталогом, кошиком або траєкторією.</div>}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-neutral-950">Останні замовлення</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-neutral-200 text-neutral-500">
                  <tr>
                    <th className="py-3 pr-4">ID</th>
                    <th className="py-3 pr-4">Користувач</th>
                    <th className="py-3 pr-4">Сума</th>
                    <th className="py-3 pr-4">Статус</th>
                    <th className="py-3 pr-4">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-100">
                      <td className="py-3 pr-4 font-semibold text-neutral-950">#{order.id}</td>
                      <td className="py-3 pr-4 text-neutral-700">{order.username}</td>
                      <td className="py-3 pr-4 text-neutral-700">{formatPrice(order.total)}</td>
                      <td className="py-3 pr-4 text-neutral-700">{order.status}</td>
                      <td className="py-3 pr-4 text-neutral-700">{order.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div className="py-6 text-center text-neutral-500">Замовлень поки немає.</div>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
