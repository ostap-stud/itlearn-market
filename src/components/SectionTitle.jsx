export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-3xl text-neutral-600">{description}</p>}
    </div>
  );
}
