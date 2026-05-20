import { useMemo, useState } from 'react';
import SectionTitle from '../components/SectionTitle.jsx';
import { formatPrice } from '../utils/format.js';
import { recordLocalPath } from '../api/localStore.js';
import { trackEvent } from '../utils/analytics.js';

const goals = [
  {
    value: 'Backend',
    label: 'Backend-розробка',
    description: 'Java/Kotlin, бази даних, REST API, Spring Boot'
  },
  {
    value: 'Frontend',
    label: 'Frontend-розробка',
    description: 'React, UI-компоненти, робота з API, адаптивний інтерфейс'
  },
  {
    value: 'Data Analytics',
    label: 'Аналітика даних',
    description: 'SQL, бізнес-метрики, візуалізація, аналіз даних'
  },
  {
    value: 'QA',
    label: 'Тестування ПЗ',
    description: 'тест-кейси, чек-листи, баг-репорти, тест-дизайн'
  },
  {
    value: 'Computer Science',
    label: 'Computer Science база',
    description: 'алгоритми, структури даних, логіка розв’язання задач'
  }
];

const levelWeight = {
  'Початковий': 1,
  'Середній': 2,
  'Просунутий': 3
};

const goalSkills = {
  Backend: ['Java або Kotlin', 'SQL', 'REST API', 'Spring Boot'],
  Frontend: ['HTML/CSS', 'React', 'робота з API', 'UI/UX'],
  'Data Analytics': ['Excel/таблиці', 'SQL', 'метрики', 'візуалізація'],
  QA: ['тест-кейси', 'чек-листи', 'баг-репорти', 'тест-дизайн'],
  'Computer Science': ['алгоритми', 'структури даних', 'аналіз складності', 'практичні задачі']
};

const stepNames = [
  'База напряму',
  'Практичне закріплення',
  'Проєктний етап',
  'Підготовка портфоліо'
];

function normalizeProduct(product) {
  return {
    direction: product.direction || product.category || 'Computer Science',
    level: product.level || 'Початковий',
    rating: Number(product.rating || 0),
    price: Number(product.price || 0),
    durationWeeks: Number(product.durationWeeks || 3),
    reviews: Number(product.reviews || 0)
  };
}

function getMaxDurationWeeks(weeklyHours) {
  const hours = Number(weeklyHours || 1);
  if (hours <= 2) return 2;
  if (hours <= 4) return 3;
  if (hours <= 7) return 5;
  return 8;
}

function scoreProduct(product, form) {
  const normalized = normalizeProduct(product);
  let score = 0;

  if (normalized.direction === form.goal) score += 60;
  if (product.category === form.goal) score += 30;
  if (form.goal === 'Backend' && ['Java', 'Kotlin', 'Бази даних', 'Backend'].includes(product.category)) score += 25;
  if (form.goal === 'Frontend' && product.category === 'Frontend') score += 25;
  if (form.goal === 'Data Analytics' && ['Data Analytics', 'Бази даних'].includes(product.category)) score += 25;
  if (form.goal === 'QA' && product.category === 'QA') score += 25;
  if (form.goal === 'Computer Science' && product.category === 'Алгоритми') score += 25;

  const desiredLevel = form.currentLevel === 'Початковий' ? 1 : 2;
  const productLevel = levelWeight[normalized.level] || 1;
  score += Math.max(0, 18 - Math.abs(productLevel - desiredLevel) * 8);
  score += normalized.rating * 3;
  score += Math.min(normalized.reviews / 5, 12);

  if (form.preferredFormat === 'Будь-який' || product.type?.toLowerCase().includes(form.preferredFormat.toLowerCase())) {
    score += 10;
  }

  return score;
}

function buildLearningPath(products, form) {
  const budget = Math.max(0, Number(form.budget || 0));
  const maxDurationWeeks = getMaxDurationWeeks(form.weeklyHours);

  const matchingProducts = [...products]
    .map((product) => ({ product, score: scoreProduct(product, form), normalized: normalizeProduct(product) }))
    .filter(({ normalized }) => normalized.price <= budget && normalized.durationWeeks <= maxDurationWeeks)
    .sort((a, b) => b.score - a.score || a.normalized.price - b.normalized.price);

  const selected = [];
  let total = 0;

  for (const item of matchingProducts) {
    const price = Number(item.product.price || 0);
    if (total + price > budget) continue;
    selected.push(item.product);
    total += price;
    if (selected.length === 4) break;
  }

  const ranked = selected.map((product, index) => ({
    step: index + 1,
    stepName: stepNames[index] || 'Додаткове навчання',
    reason:
      index === 0
        ? 'підходить для старту в обраному напрямі та відповідає поточному рівню'
        : 'логічно продовжує попередній етап і розширює практичні навички',
    product
  }));

  const weeks = ranked.reduce((sum, item) => sum + Number(item.product.durationWeeks || 3), 0);

  return {
    items: ranked,
    total,
    weeks,
    maxDurationWeeks,
    skills: goalSkills[form.goal] || [],
    hasMatchesBeforeBudget: matchingProducts.length > 0
  };
}

function PathProduct({ item, goal, onDetails, onAdd }) {
  const { product } = item;
  const skills = Array.isArray(product.skills) ? product.skills.slice(0, 4) : [];

  return (
    <article className="flex h-full min-h-[330px] flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 font-bold text-white">
          {item.step}
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{item.stepName}</div>
          <h3 className="mt-1 text-lg font-extrabold leading-6 text-neutral-950">{product.title}</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{item.reason}</p>
        </div>
      </div>

      <p className="text-sm leading-6 text-neutral-700">{product.description}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl bg-neutral-50 p-3">
          <div className="text-xs text-neutral-500">Вартість</div>
          <div className="font-bold text-neutral-950">{formatPrice(product.price)}</div>
        </div>
        <div className="rounded-2xl bg-neutral-50 p-3">
          <div className="text-xs text-neutral-500">Тривалість</div>
          <div className="font-bold text-neutral-950">{product.durationWeeks || 3} тиж.</div>
        </div>
        <div className="rounded-2xl bg-neutral-50 p-3">
          <div className="text-xs text-neutral-500">Рейтинг</div>
          <div className="font-bold text-neutral-950">★ {product.rating || '—'}</div>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-700">{skill}</span>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <button
          onClick={() => {
            trackEvent('open_recommended_product', { product_id: product.id, product_name: product.title, goal });
            onDetails(product);
          }}
          className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100"
        >
          Детальніше
        </button>
        <button
          onClick={() => {
            trackEvent('add_recommended_product_to_cart', { product_id: product.id, product_name: product.title, goal });
            onAdd(product);
          }}
          className="rounded-xl bg-neutral-950 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          У кошик
        </button>
      </div>
    </article>
  );
}

export default function LearningPathPage({ products, onDetails, onAdd, onAddMany }) {
  const [form, setForm] = useState({
    goal: 'Backend',
    currentLevel: 'Початковий',
    weeklyHours: 5,
    budget: 1600,
    preferredFormat: 'Будь-який'
  });
  const [submittedForm, setSubmittedForm] = useState(form);

  const path = useMemo(() => buildLearningPath(products, submittedForm), [products, submittedForm]);
  const selectedGoal = goals.find((goal) => goal.value === submittedForm.goal) || goals[0];
  const budget = Number(submittedForm.budget || 0);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function generate(event) {
    event.preventDefault();
    const nextPath = buildLearningPath(products, form);
    setSubmittedForm({ ...form });
    recordLocalPath({
      goal: form.goal,
      level: form.currentLevel,
      weeklyHours: Number(form.weeklyHours),
      budget: Number(form.budget),
      productIds: nextPath.items.map((item) => item.product.id)
    });
    trackEvent('generate_learning_path', {
      goal: form.goal,
      level: form.currentLevel,
      budget: Number(form.budget),
      weekly_hours: Number(form.weeklyHours),
      result_count: nextPath.items.length
    });
  }

  function addPathToCart() {
    const selected = path.items.map((item) => item.product);
    if (selected.length === 0) return;
    onAddMany(selected);
    trackEvent('add_learning_path_to_cart', {
      goal: submittedForm.goal,
      items: selected.length,
      value: path.total
    });
  }

  return (
    <section className="pb-12">
      <SectionTitle
        eyebrow="Персоналізація"
        title="Підбір індивідуальної навчальної траєкторії"
        description="Оберіть напрям, рівень підготовки, доступний бюджет і темп навчання. Система підбере послідовність матеріалів, які відповідають заданим обмеженням."
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={generate} className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-neutral-950">Параметри підбору</h3>
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-neutral-700">Ціль навчання</span>
            <select
              value={form.goal}
              onChange={(event) => updateField('goal', event.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
            >
              {goals.map((goal) => <option key={goal.value} value={goal.value}>{goal.label}</option>)}
            </select>
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-neutral-700">Поточний рівень</span>
            <select
              value={form.currentLevel}
              onChange={(event) => updateField('currentLevel', event.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
            >
              <option>Початковий</option>
              <option>Середній</option>
            </select>
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label>
              <span className="text-sm font-semibold text-neutral-700">Год/тиждень</span>
              <input
                type="number"
                min="1"
                max="30"
                value={form.weeklyHours}
                onChange={(event) => updateField('weeklyHours', event.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
              />
            </label>
            <label>
              <span className="text-sm font-semibold text-neutral-700">Бюджет, грн</span>
              <input
                type="number"
                min="0"
                step="50"
                value={form.budget}
                onChange={(event) => updateField('budget', event.target.value)}
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
              />
            </label>
          </div>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Бюджет обмежує загальну вартість набору, а темп навчання впливає на добір коротших або довших матеріалів.
          </p>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-neutral-700">Бажаний формат</span>
            <select
              value={form.preferredFormat}
              onChange={(event) => updateField('preferredFormat', event.target.value)}
              className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
            >
              <option>Будь-який</option>
              <option>PDF</option>
              <option>Мінікурс</option>
              <option>Практикум</option>
              <option>Шаблон</option>
            </select>
          </label>
          <button className="mt-6 w-full rounded-2xl bg-neutral-950 px-5 py-3 font-semibold text-white hover:bg-neutral-800">
            Сформувати траєкторію
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Обрана траєкторія</div>
            <h3 className="mt-2 text-2xl font-extrabold text-neutral-950">{selectedGoal.label}</h3>
            <p className="mt-2 leading-7 text-neutral-600">{selectedGoal.description}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <div className="text-sm text-neutral-500">Орієнтовна тривалість</div>
                <div className="mt-1 text-xl font-bold text-neutral-950">{path.weeks} тиж.</div>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4">
                <div className="text-sm text-neutral-500">Вартість набору</div>
                <div className="mt-1 text-xl font-bold text-neutral-950">{formatPrice(path.total)}</div>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4">
                <div className="text-sm text-neutral-500">Бюджет</div>
                <div className="mt-1 text-xl font-bold text-neutral-950">{formatPrice(budget)}</div>
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4">
                <div className="text-sm text-neutral-500">Продуктів</div>
                <div className="mt-1 text-xl font-bold text-neutral-950">{path.items.length}</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {path.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700">{skill}</span>
              ))}
            </div>
            {path.items.length > 0 ? (
              <button onClick={addPathToCart} className="mt-6 rounded-2xl bg-neutral-950 px-5 py-3 font-semibold text-white hover:bg-neutral-800">
                Додати всю траєкторію до кошика
              </button>
            ) : (
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                За вказаними обмеженнями не знайдено відповідного набору. Збільште бюджет, оберіть інший формат або підвищте доступний час на навчання.
              </div>
            )}
          </div>

          <div className="grid items-stretch gap-5 xl:grid-cols-2">
            {path.items.map((item) => (
              <PathProduct
                key={`${item.step}-${item.product.id}`}
                item={item}
                goal={submittedForm.goal}
                onDetails={onDetails}
                onAdd={onAdd}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
