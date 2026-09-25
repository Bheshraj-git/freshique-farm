"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    Package,
    Plus,
    BarChart3,
    Users,
    ClipboardList,
    Leaf,
    ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    { href: "/farmer/dashboard/profile", label: "Profile", icon: User },
    { href: "/farmer/dashboard/products", label: "Products", icon: Package },
    { href: "/farmer/dashboard/products/new", label: "Add", icon: Plus },
    { href: "/farmer/dashboard/orders", label: "Orders", icon: ClipboardList },
    { href: "/farmer/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/farmer/dashboard/analyzer", label: "AI", icon: Leaf },
    { href: "/community", label: "Community", icon: Users },
];

export default function FarmerMobileNav() {
    const pathname = usePathname();

    return (
        <header className="lg:hidden sticky top-0 z-40 bg-brand-800 text-white border-b border-brand-700/60 shadow-md">
            {/* Top Bar with Back to Home Link */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-brand-700/40">
                <div className="flex items-center gap-2">
                    <span className="grid place-items-center h-7 w-7 rounded-lg bg-brand-500 text-white shrink-0">
                        <Leaf className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-extrabold tracking-tight">Farmer Portal</span>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-700/60 hover:bg-brand-700 text-xs font-semibold text-brand-100 hover:text-white border border-brand-600/40 transition"
                >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Horizontal Scrollable Tabs */}
            <div className="overflow-x-auto px-3 py-2 scrollbar-none">
                <ul className="flex gap-2 w-max">
                    {items.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition",
                                        active
                                            ? "bg-brand-600 text-white shadow-sm"
                                             : "bg-brand-700/50 text-brand-100 hover:bg-brand-700"
                                    )}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </header>
    );
}