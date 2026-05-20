import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { categories, levels } from '../data/products.js';

export default function CatalogPage({ products, onDetails, onAdd }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Усі');
  const [level, setLevel] = useState('Усі');
  const [sort, setSort] = useState('rating');

  const filtered = useMemo(() => {
    return products
      .filter((product) => {
        const text = `${product.title} ${product.category} ${product.direction || ''} ${product.description} ${(product.skills || []).join(' ')}`.toLowerCase();
        const matchesQuery = text.includes(query.trim().toLowerCase());
        const matchesCategory = category === 'Усі' || product.category === category;
        const matchesLevel = level === 'Усі' || product.level === level;
        return matchesQuery && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sort === 'priceAsc') return a.price - b.price;
        if (sort === 'priceDesc') return b.price - a.price;
        return b.rating - a.rating;
      });
  }, [products, query, category, level, sort]);

  return (
    <section>
      <SectionTitle
        eyebrow="Каталог"
        title="Цифрові освітні продукти"
        description="Користувач може знайти потрібний матеріал за категорією, напрямом, рівнем складності, рейтингом або ціною."
      />
      <div className="mb-6 grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 md:grid-cols-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Пошук матеріалів..."
          className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950">
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={level} onChange={(event) => setLevel(event.target.value)} className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950">
          {levels.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950">
          <option value="rating">За рейтингом</option>
          <option value="priceAsc">Ціна: зростання</option>
          <option value="priceDesc">Ціна: спадання</option>
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} onDetails={onDetails} onAdd={onAdd} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
          За вибраними параметрами матеріалів не знайдено.
        </div>
      )}
    </section>
  );
}
