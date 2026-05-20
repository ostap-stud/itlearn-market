import { formatPrice } from '../utils/format.js';

export default function ProductCard({ product, onDetails, onAdd }) {
  const skills = Array.isArray(product.skills) ? product.skills.slice(0, 3) : [];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-neutral-500">{product.category}</div>
          <h3 className="mt-1 text-lg font-bold text-neutral-950">{product.title}</h3>
        </div>
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-sm font-semibold text-neutral-800">
          ★ {product.rating || '—'}
        </span>
      </div>
      <p className="flex-1 text-sm leading-6 text-neutral-600">{product.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-3 py-1">{product.level}</span>
        <span className="rounded-full bg-neutral-100 px-3 py-1">{product.type}</span>
        {product.direction && <span className="rounded-full bg-neutral-100 px-3 py-1">{product.direction}</span>}
      </div>
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-600">
          {skills.map((skill) => <span key={skill} className="rounded-full border border-neutral-200 px-3 py-1">{skill}</span>)}
        </div>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xl font-bold text-neutral-950">{formatPrice(product.price)}</div>
        <div className="flex gap-2">
          <button
            onClick={() => onDetails(product)}
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-100"
          >
            Детальніше
          </button>
          <button
            onClick={() => onAdd(product)}
            className="rounded-xl bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            У кошик
          </button>
        </div>
      </div>
    </article>
  );
}
