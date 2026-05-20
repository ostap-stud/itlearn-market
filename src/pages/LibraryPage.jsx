import SectionTitle from '../components/SectionTitle.jsx';
import LoadingBlock from '../components/LoadingBlock.jsx';
import ErrorBlock from '../components/ErrorBlock.jsx';

export default function LibraryPage({ products, loading, error, onRetry }) {
  return (
    <section>
      <SectionTitle
        eyebrow="Кабінет"
        title="Мої навчальні матеріали"
        description="У кабінеті відображаються цифрові матеріали, придбані поточним користувачем."
      />
      {loading && <LoadingBlock />}
      {!loading && error && <ErrorBlock title="Не вдалося завантажити бібліотеку" message={error} onRetry={onRetry} />}
      {!loading && !error && (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-neutral-500">{product.category}</div>
                <h3 className="mt-1 text-lg font-bold text-neutral-950">{product.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{product.description}</p>
                <button className="mt-5 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100">
                  Відкрити матеріал
                </button>
              </div>
            ))}
          </div>
          {products.length === 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
              Придбані матеріали поки відсутні.
            </div>
          )}
        </>
      )}
    </section>
  );
}
