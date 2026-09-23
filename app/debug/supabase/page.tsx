import { createClient } from "@/lib/supabase/server";

// Never cache — always run fresh
export const dynamic = "force-dynamic";

export default async function SupabaseHealthPage() {
  const checks: {
    name: string;
    ok: boolean;
    detail?: string;
  }[] = [];

  // 1. Env vars present?
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  checks.push({
    name: "NEXT_PUBLIC_SUPABASE_URL set",
    ok: hasUrl,
    detail: hasUrl ? "✓" : "MISSING from .env.local",
  });
  checks.push({
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY set",
    ok: hasAnon,
    detail: hasAnon ? "✓" : "MISSING from .env.local",
  });

  // 2. Can we connect?
  if (hasUrl && hasAnon) {
    try {
      const supabase = await createClient();

      // Fetch categories (public read via RLS)
      const { data, error, count } = await supabase
        .from("categories")
        .select("*", { count: "exact" });

      if (error) {
        checks.push({
          name: "Supabase connection",
          ok: false,
          detail: error.message,
        });
      } else {
        checks.push({
          name: "Supabase connection",
          ok: true,
          detail: `Connected. Categories table has ${count ?? 0} rows.`,
        });
      }

      // 3. Table presence check — try each table
      const tables = [
        "profiles",
        "categories",
        "products",
        "product_images",
        "favorites",
        "cart_items",
        "orders",
        "order_items",
        "community_posts",
        "community_comments",
      ];

      for (const table of tables) {
        const { error: tErr } = await supabase.from(table).select("id").limit(1);
        checks.push({
          name: `Table: ${table}`,
          ok: !tErr,
          detail: tErr ? tErr.message : "Reachable",
        });
      }
    } catch (err) {
      checks.push({
        name: "Supabase client init",
        ok: false,
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const allOk = checks.every((c) => c.ok);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Supabase Health Check</h1>
      <p className="text-ink-500 mb-8">
        Confirms environment, connection, and table access. Delete this page
        before deployment.
      </p>

      <div
        className={`mb-6 rounded-xl px-4 py-3 font-semibold ${
          allOk
            ? "bg-brand-100 text-brand-800"
            : "bg-danger-500/10 text-danger-600"
        }`}
      >
        {allOk ? "✓ All checks passed" : "✗ Some checks failed — see below"}
      </div>

      <ul className="space-y-2">
        {checks.map((c) => (
          <li
            key={c.name}
            className="flex items-start justify-between gap-4 rounded-xl border border-brand-50 bg-white px-4 py-3 shadow-card"
          >
            <div>
              <p className="font-semibold text-ink-900">{c.name}</p>
              {c.detail && (
                <p className="text-xs text-ink-500 mt-0.5">{c.detail}</p>
              )}
            </div>
            <span
              className={`shrink-0 mt-0.5 text-sm font-bold ${
                c.ok ? "text-brand-600" : "text-danger-600"
              }`}
            >
              {c.ok ? "PASS" : "FAIL"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}