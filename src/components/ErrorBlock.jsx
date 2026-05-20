export default function ErrorBlock({ title = 'Помилка', message, onRetry }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <div className="text-lg font-bold text-neutral-950">{title}</div>
      {message && <p className="mt-2 text-neutral-600">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="mt-5 rounded-xl bg-neutral-950 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800">
          Спробувати ще раз
        </button>
      )}
    </div>
  );
}
