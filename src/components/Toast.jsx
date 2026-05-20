export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed right-4 top-24 z-30 rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium shadow-lg">
      {message}
    </div>
  );
}
