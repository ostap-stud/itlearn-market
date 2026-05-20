export default function LoadingBlock({ message = 'Завантаження даних...' }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600 shadow-sm">
      {message}
    </div>
  );
}
