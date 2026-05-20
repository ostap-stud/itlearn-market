import InfoRow from '../components/InfoRow.jsx';
import { formatPrice } from '../utils/format.js';

export default function ProductDetailsPage({ product, onBack, onAdd }) {
  if (!product) return null;
  const skills = Array.isArray(product.skills) ? product.skills : [];

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
      <button onClick={onBack} className="mb-6 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100">
        ← Назад до каталогу
      </button>
      <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{product.category}</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950">{product.title}</h2>
          <p className="mt-4 text-lg leading-8 text-neutral-700">{product.description}</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <InfoRow label="Автор" value={product.author || 'ITLearn Team'} />
            <InfoRow label="Формат" value={product.type} />
            <InfoRow label="Рівень" value={product.level} />
            <InfoRow label="Відгуки" value={`${product.reviews || 0} відгуків`} />
            {product.direction && <InfoRow label="Навчальний напрям" value={product.direction} />}
            {product.durationWeeks && <InfoRow label="Орієнтовна тривалість" value={`${product.durationWeeks} тиж.`} />}
          </div>
          {skills.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-neutral-950">Навички після проходження</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700">{skill}</span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-neutral-950">До складу продукту входить</h3>
            <ul className="mt-4 grid gap-2 text-neutral-700 md:grid-cols-2">
              {(product.includes || []).map((item) => (
                <li key={item} className="rounded-xl bg-neutral-50 px-4 py-3">✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="text-sm text-neutral-500">Вартість доступу</div>
          <div className="mt-2 text-4xl font-extrabold text-neutral-950">{formatPrice(product.price)}</div>
          <div className="mt-4 rounded-2xl bg-white p-4 text-neutral-700">
            <div className="font-semibold text-neutral-950">Рейтинг: ★ {product.rating || '—'}</div>
            <p className="mt-1 text-sm">Після оплати матеріал буде доступний у кабінеті користувача.</p>
          </div>
          <button onClick={() => onAdd(product)} className="mt-6 w-full rounded-2xl bg-neutral-950 px-5 py-3 font-semibold text-white hover:bg-neutral-800">
            Додати до кошика
          </button>
        </aside>
      </div>
    </section>
  );
}
