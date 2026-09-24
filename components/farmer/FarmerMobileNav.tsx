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
        <nav className="lg:hidden sticky top-0 z-40 bg-brand-800 text-white border-b border-brand-700/60">
            <div className="overflow-x-auto px-4 py-3">
                <ul className="flex gap-2 w-max">
                    {items.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition",
                                        active
                                            ? "bg-brand-600 text-white"
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
        </nav>
    );
}