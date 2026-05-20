import { useState } from 'react';
import SectionTitle from '../components/SectionTitle.jsx';
import { categories, directions, levels } from '../data/products.js';
import { formatPrice } from '../utils/format.js';

const emptyDraft = {
  title: '',
  category: 'Java',
  direction: 'Backend',
  level: 'Початковий',
  type: 'PDF',
  price: 199,
  durationWeeks: 3,
  skills: 'основи теми\nпрактичні навички',
  author: 'ITLearn Team',
  description: '',
  includes: 'навчальний матеріал\nпрактичні завдання'
};

export default function AdminPage({ products, onCreateProduct, onDeleteProduct, loading }) {
  const [draft, setDraft] = useState(emptyDraft);

  async function addProduct(event) {
    event.preventDefault();
    const product = {
      ...draft,
      price: Number(draft.price),
      durationWeeks: Number(draft.durationWeeks),
      rating: 4.5,
      reviews: 0,
      skills: draft.skills
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      includes: draft.includes
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
    };
    await onCreateProduct(product);
    setDraft(emptyDraft);
  }

  return (
    <section>
      <SectionTitle
        eyebrow="Адміністрування"
        title="Керування цифровими продуктами"
        description="Адміністратор може додавати нові цифрові продукти, задавати напрям навчання, рівень, формат, вартість і навички, які враховуються під час персоналізованого підбору."
      />
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={addProduct} className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-neutral-950">Додати продукт</h3>
          <input
            required
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            placeholder="Назва"
            className="mt-4 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
          />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950">
              {categories.filter((item) => item !== 'Усі').map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={draft.direction} onChange={(event) => setDraft({ ...draft, direction: event.target.value })} className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950">
              {directions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <select value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value })} className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950">
              {levels.filter((item) => item !== 'Усі').map((item) => <option key={item}>{item}</option>)}
            </select>
            <input required type="number" min="1" value={draft.durationWeeks} onChange={(event) => setDraft({ ...draft, durationWeeks: event.target.value })} placeholder="Тривалість, тиж." className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input required value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} placeholder="Формат" className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950" />
            <input required type="number" min="0" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="Ціна" className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950" />
          </div>
          <input
            required
            value={draft.author}
            onChange={(event) => setDraft({ ...draft, author: event.target.value })}
            placeholder="Автор"
            className="mt-3 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
          />
          <textarea
            required
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            placeholder="Опис"
            className="mt-3 min-h-28 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
          />
          <textarea
            value={draft.skills}
            onChange={(event) => setDraft({ ...draft, skills: event.target.value })}
            placeholder="Навички, кожен пункт з нового рядка"
            className="mt-3 min-h-20 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
          />
          <textarea
            value={draft.includes}
            onChange={(event) => setDraft({ ...draft, includes: event.target.value })}
            placeholder="Склад продукту, кожен пункт з нового рядка"
            className="mt-3 min-h-24 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
          />
          <button disabled={loading} className="mt-4 rounded-2xl bg-neutral-950 px-5 py-3 font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300">
            {loading ? 'Збереження...' : 'Додати до каталогу'}
          </button>
        </form>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-bold text-neutral-950">{product.title}</div>
                <div className="mt-1 text-sm text-neutral-600">{product.category} · {product.direction || 'напрям не вказано'} · {formatPrice(product.price)}</div>
              </div>
              <button onClick={() => onDeleteProduct(product.id)} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100">
                Видалити
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
