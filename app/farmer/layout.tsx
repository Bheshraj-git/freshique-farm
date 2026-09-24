import { requireRole } from "@/lib/auth";
import FarmerSidebar from "@/components/farmer/FarmerSidebar";
import FarmerMobileNav from "@/components/farmer/FarmerMobileNav";

export default async function FarmerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile } = await requireRole("farmer", "/farmer/dashboard");

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-brand-50 via-brand-100/40 to-accent-50">
            <FarmerSidebar
                fullName={profile.full_name}
                email={user.email ?? ""}
                avatarUrl={profile.avatar_url}
            />
            <div className="flex-1 min-w-0 flex flex-col">
                <FarmerMobileNav />
                <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
                    {children}
                </main>
            </div>
        </div>
    );
}