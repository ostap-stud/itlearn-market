import { useState } from 'react';
import SectionTitle from '../components/SectionTitle.jsx';

const quickUsers = [
  { label: 'Користувач', username: 'student', password: 'student123', description: 'купівля матеріалів і перегляд кабінету' },
  { label: 'Адміністратор', username: 'admin', password: 'admin123', description: 'керування товарами та перегляд аналітики' }
];

export default function LoginPage({ onLogin, loading }) {
  const [form, setForm] = useState({ username: 'student', password: 'student123' });

  function fillCredentials(user) {
    setForm({ username: user.username, password: user.password });
  }

  function submit(event) {
    event.preventDefault();
    onLogin(form.username.trim(), form.password);
  }

  return (
    <section>
      <SectionTitle
        eyebrow="Авторизація"
        title="Вхід у систему"
        description="Авторизація використовується для розмежування ролей: звичайний користувач може купувати матеріали та переглядати кабінет, а адміністратор має доступ до аналітики й керування каталогом."
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="h-fit rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm font-semibold text-neutral-700">Логін</span>
            <input
              required
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
              placeholder="student або admin"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-neutral-700">Пароль</span>
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
              placeholder="Пароль"
            />
          </label>
          <button
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-neutral-950 px-5 py-3 font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-neutral-950">Швидкий вхід</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {quickUsers.map((user) => (
              <button
                key={user.username}
                onClick={() => fillCredentials(user)}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-left transition hover:border-neutral-400 hover:bg-white"
              >
                <div className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{user.label}</div>
                <div className="mt-1 font-bold text-neutral-950">{user.username} / {user.password}</div>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{user.description}</p>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
            Після входу користувач отримує доступ до кабінету, бібліотеки придбаних матеріалів, кошика та персональних функцій платформи.
          </div>
        </div>
      </div>
    </section>
  );
}
