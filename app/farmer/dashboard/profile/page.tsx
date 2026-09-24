import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import FarmerHeroBanner from "@/components/farmer/FarmerHeroBanner";
import FarmerPersonalInfo from "@/components/farmer/FarmerPersonalInfo";
import FarmerFarmLocation from "@/components/farmer/FarmerFarmLocation";
import FarmerProducerStats from "@/components/farmer/FarmerProducerStats";

export const metadata = {
    title: "Farmer Profile — Freshique Farm",
};

function formatLong(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });
}

function formatLongWithDay(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export default async function FarmerProfilePage() {
    const { user, profile } = await requireRole("farmer", "/farmer/dashboard/profile");

    const supabase = await createClient();
    const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("farmer_id", user.id);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <FarmerHeroBanner
                fullName={profile.full_name}
                avatarUrl={profile.avatar_url}
                joinedLabel={formatLong(profile.created_at)}
                productCount={productCount ?? 0}
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <FarmerPersonalInfo
                        fullName={profile.full_name}
                        phone={profile.phone}
                        email={user.email ?? ""}
                        joinedLabel={formatLongWithDay(profile.created_at)}
                    />
                    <FarmerFarmLocation
                        address={profile.address}
                        city={profile.city}
                        state={profile.state}
                        country={profile.country}
                        zipCode={profile.zip_code}
                    />
                </div>

                <FarmerProducerStats
                    productCount={productCount ?? 0}
                    activeSince={formatLong(profile.created_at)}
                />
            </div>
        </div>
    );
}