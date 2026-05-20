export default function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="mt-1 font-semibold text-neutral-950">{value}</div>
    </div>
  );
}
