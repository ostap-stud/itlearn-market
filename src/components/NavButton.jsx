export default function NavButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
        active
          ? 'bg-neutral-950 text-white'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
      }`}
    >
      {children}
    </button>
  );
}
