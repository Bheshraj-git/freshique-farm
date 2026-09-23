interface Props {
  description: string | null;
}

export default function ProductDescription({ description }: Props) {
  if (!description) return null;

  return (
    <section className="mt-12">
      {/* Heading with green accent underline */}
      <div className="flex items-center gap-3 mb-6">
        <span className="h-1 w-8 rounded-full bg-brand-600" />
        <h2 className="text-2xl font-extrabold text-ink-900">
          Product Description
        </h2>
      </div>

      <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-6 md:p-8">
        <p className="text-ink-700 leading-relaxed">{description}</p>

        {/* Standard bullet list — matches the reference */}
        <ul className="mt-6 space-y-3 text-ink-700">
          <li className="flex items-start gap-3">
            <span className="text-lg">🌱</span>
            <span>100% Organic &amp; Chemical-Free</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg">🍯</span>
            <span>Naturally sweet, perfect for snacking or desserts</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg">💪</span>
            <span>Rich in fiber, vitamins, and antioxidants</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-lg">🥗</span>
            <span>Versatile — enjoy fresh, in salads, or paired with cheese</span>
          </li>
        </ul>
      </div>
    </section>
  );
}