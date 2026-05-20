import ProductCard from '../components/ProductCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';

export default function HomePage({ products, onOpenCatalog, onOpenPath, onDetails, onAdd }) {
  const topProducts = [...products].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 p-8 shadow-sm md:p-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700">
              Веб-платформа для продажу цифрових освітніх продуктів
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 md:text-5xl">
              Персональний підбір навчальної траєкторії в ІТ
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-700">
              ITLearn Market поєднує функції електронної комерції з рекомендаційним модулем: користувач обирає ціль навчання,
              рівень підготовки, бюджет і темп, після чого отримує послідовність цифрових продуктів для купівлі та проходження.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={onOpenPath} className="rounded-2xl bg-neutral-950 px-5 py-3 font-semibold text-white hover:bg-neutral-800">
                Підібрати траєкторію
              </button>
              <button onClick={onOpenCatalog} className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 font-semibold hover:bg-neutral-100">
                Перейти до каталогу
              </button>
              {topProducts[0] && (
                <button onClick={() => onDetails(topProducts[0])} className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 font-semibold hover:bg-neutral-100">
                  Популярний продукт
                </button>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              {[
                [products.length, 'цифрових продуктів'],
                ['5', 'навчальних напрямів'],
                ['B2C', 'модель комерції'],
                ['24/7', 'доступ до матеріалів']
              ].map(([number, label]) => (
                <div key={label} className="rounded-2xl bg-neutral-50 p-5">
                  <div className="text-3xl font-extrabold text-neutral-950">{number}</div>
                  <div className="text-sm text-neutral-600">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">1 етап</div>
          <h3 className="mt-2 text-xl font-bold text-neutral-950">Вибір цілі</h3>
          <p className="mt-2 leading-7 text-neutral-600">Користувач визначає напрям: backend, frontend, data analytics, QA або базову computer science підготовку.</p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">2 етап</div>
          <h3 className="mt-2 text-xl font-bold text-neutral-950">Рекомендаційний підбір</h3>
          <p className="mt-2 leading-7 text-neutral-600">Система враховує рівень, бюджет, формат матеріалів, рейтинг і тематичну відповідність продуктів.</p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">3 етап</div>
          <h3 className="mt-2 text-xl font-bold text-neutral-950">Купівля набору</h3>
          <p className="mt-2 leading-7 text-neutral-600">Обрану траєкторію можна додати до кошика як набір цифрових продуктів і оформити замовлення.</p>
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="Рекомендовано"
          title="Популярні навчальні матеріали"
          description="Добірка матеріалів, які найчастіше обирають для старту або посилення практичних навичок в ІТ-напрямах."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {topProducts.map((product) => (
            <ProductCard key={product.id} product={product} onDetails={onDetails} onAdd={onAdd} />
          ))}
        </div>
      </section>
    </div>
  );
}
