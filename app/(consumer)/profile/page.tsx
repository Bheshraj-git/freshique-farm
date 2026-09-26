import { requireAuth } from "@/lib/auth";
import { signOutAction } from "@/app/(auth)/actions";
import { LogOut, ChevronRight } from "lucide-react";
import ProfileIdentityCard from "@/components/profile/ProfileIdentityCard";
import ProfileActionsCard from "@/components/profile/ProfileActionsCard";
import ProfileDetailsCard from "@/components/profile/ProfileDetailsCard";
import SavedItemsSection from "@/components/profile/SavedItemsSection";
import Badge from "@/components/ui/Badge";
import {
  getFavoriteProducts,
  getFavoriteCount,
} from "@/lib/queries/favorites";
import ProductCard from "@/components/market/ProductCard";

export const metadata = {
  title: "Profile — Freshique Farm",
};

function formatJoined(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default async function ProfilePage() {
  const { user, profile } = await requireAuth("/profile");

  const [favoritesCount, favorites] = await Promise.all([
    getFavoriteCount(),
    getFavoriteProducts(),
  ]);

  // Profile "created_at" wasn't in the initial Profile type.
  // Fall back to something safe if missing.
  const joined = profile.created_at
    ? formatJoined(profile.created_at)
    : "—";

  const region =
    [profile.state, profile.country].filter(Boolean).join(", ") || "—";

  const signOutSlot = (
    <form action={signOutAction} className="block">
      <button
        type="submit"
        className="flex w-full items-center gap-3 px-5 py-4 hover:bg-danger-500/5 transition text-left"
      >
        <span className="grid place-items-center h-9 w-9 rounded-lg bg-danger-500/10 text-danger-600">
          <LogOut className="h-4 w-4" />
        </span>
        <span className="flex-1 text-sm font-semibold text-danger-600">
          Log Out
        </span>
        <ChevronRight className="h-4 w-4 text-ink-300" />
      </button>
    </form>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-24 md:pb-12">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-5">
          <ProfileIdentityCard
            fullName={profile.full_name}
            email={user.email ?? ""}
            avatarUrl={profile.avatar_url}
          />
          <ProfileActionsCard signOutSlot={signOutSlot} />
          <ProfileDetailsCard
            phone={profile.phone}
            region={region}
            joinedAt={joined}
          />
        </aside>

        <main>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-ink-900">
              Profile Details
            </h1>
            <Badge tone="success" size="md">
              {profile.role}
            </Badge>
          </div>

          <SavedItemsSection count={favoritesCount}>
            {favorites.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {favorites.slice(0, 6).map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      initialFavorited={true}
                    />
                  ))}
                </div>
                {favorites.length > 6 && (
                  <div className="mt-6 text-center">
                    <a
                      href="/favorites"
                      className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800"
                    >
                      View all {favorites.length} favorites →
                    </a>
                  </div>
                )}
              </>
            )}
          </SavedItemsSection>
        </main>
      </div>
    </div>
  );
}