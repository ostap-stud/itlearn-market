import NavButton from './NavButton.jsx';

export default function Header({ page, setPage, cartCount, user, onLogout }) {
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <button onClick={() => setPage('home')} className="text-left">
          <div className="text-xl font-extrabold tracking-tight">ITLearn Market</div>
          <div className="text-xs text-neutral-500">персоналізовані цифрові освітні продукти</div>
        </button>
        <nav className="flex flex-wrap gap-2">
          <NavButton active={page === 'home'} onClick={() => setPage('home')}>Головна</NavButton>
          <NavButton active={page === 'catalog'} onClick={() => setPage('catalog')}>Каталог</NavButton>
          <NavButton active={page === 'learningPath'} onClick={() => setPage('learningPath')}>Траєкторія</NavButton>
          <NavButton active={page === 'cart'} onClick={() => setPage('cart')}>Кошик ({cartCount})</NavButton>
          {user && <NavButton active={page === 'library'} onClick={() => setPage('library')}>Кабінет</NavButton>}
          {isAdmin && <NavButton active={page === 'analytics'} onClick={() => setPage('analytics')}>Аналітика</NavButton>}
          {isAdmin && <NavButton active={page === 'admin'} onClick={() => setPage('admin')}>Адмін</NavButton>}
          {!user ? (
            <NavButton active={page === 'login'} onClick={() => setPage('login')}>Вхід</NavButton>
          ) : (
            <button
              onClick={onLogout}
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              title={`${user.displayName} (${user.role})`}
            >
              Вийти · {user.username}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
