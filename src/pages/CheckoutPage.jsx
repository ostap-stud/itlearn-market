import SectionTitle from '../components/SectionTitle.jsx';
import { formatPrice } from '../utils/format.js';

export default function CheckoutPage({ cart, products, user, onConfirm, loading }) {
  const items = cart.map((id) => products.find((product) => Number(product.id) === Number(id))).filter(Boolean);
  const total = items.reduce((sum, product) => sum + Number(product.price || 0), 0);

  return (
    <section>
      <SectionTitle
        eyebrow="Замовлення"
        title="Оформлення покупки"
        description="Після підтвердження придбані цифрові матеріали з’являються в особистому кабінеті користувача."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm" onSubmit={(event) => { event.preventDefault(); onConfirm(); }}>
          <div className="rounded-2xl bg-neutral-50 p-5">
            <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Покупець</div>
            <div className="mt-2 text-xl font-bold text-neutral-950">{user?.displayName}</div>
            <div className="mt-1 text-sm text-neutral-600">{user?.email}</div>
          </div>
          <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
            Після підтвердження замовлення цифрові матеріали будуть додані до особистої бібліотеки. Оплату можна виконати карткою або через доступні онлайн-сервіси.
          </div>
          <button
            disabled={loading || items.length === 0}
            className="mt-6 rounded-2xl bg-neutral-950 px-5 py-3 font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {loading ? 'Створення замовлення...' : 'Підтвердити замовлення'}
          </button>
        </form>
        <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-neutral-950">Склад замовлення</h3>
          <div className="mt-4 space-y-3">
            {items.map((product) => (
              <div key={product.id} className="flex justify-between gap-4 text-sm">
                <span className="text-neutral-700">{product.title}</span>
                <span className="font-semibold text-neutral-950">{formatPrice(product.price)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-neutral-200 pt-5 text-xl font-extrabold text-neutral-950">
            Разом: {formatPrice(total)}
          </div>
        </aside>
      </div>
    </section>
  );
}
