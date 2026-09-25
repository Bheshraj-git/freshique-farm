import { requireRole } from "@/lib/auth";
import { getFarmerAnalytics } from "@/lib/queries/farmer";
import FarmerAnalyticsDashboard from "@/components/farmer/FarmerAnalyticsDashboard";

export const metadata = {
    title: "Farm Analytics Dashboard — Freshique Farm",
    description: "Detailed analytics, sales performance, orders and product trends for farmers.",
};

export default async function AnalyticsPage() {
    const { user } = await requireRole("farmer", "/farmer/dashboard/analytics");
    const analyticsData = await getFarmerAnalytics(user.id);

    return <FarmerAnalyticsDashboard data={analyticsData} />;
}