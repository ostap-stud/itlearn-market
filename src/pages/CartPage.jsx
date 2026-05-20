import SectionTitle from '../components/SectionTitle.jsx';
import { formatPrice } from '../utils/format.js';

export default function CartPage({ cart, products, onRemove, onCheckout }) {
  const items = cart.map((id) => products.find((product) => Number(product.id) === Number(id))).filter(Boolean);
  const total = items.reduce((sum, product) => sum + Number(product.price || 0), 0);

  return (
    <section>
      <SectionTitle
        eyebrow="Кошик"
        title="Оформлення цифрових продуктів"
        description="Кошик містить обрані цифрові продукти, а замовлення оформлюється після входу користувача в систему."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((product) => (
            <div key={product.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-bold text-neutral-950">{product.title}</div>
                <div className="mt-1 text-sm text-neutral-600">{product.category} · {product.type}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-bold text-neutral-950">{formatPrice(product.price)}</div>
                <button onClick={() => onRemove(product.id)} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
                  Видалити
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
              Кошик порожній. Додайте матеріали з каталогу.
            </div>
          )}
        </div>
        <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-neutral-500">Підсумкова сума</div>
          <div className="mt-2 text-3xl font-extrabold text-neutral-950">{formatPrice(total)}</div>
          <button
            disabled={items.length === 0}
            onClick={onCheckout}
            className="mt-6 w-full rounded-2xl bg-neutral-950 px-5 py-3 font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Оформити замовлення
          </button>
        </aside>
      </div>
    </section>
  );
}
