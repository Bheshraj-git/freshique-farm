"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    User,
    Package,
    Plus,
    BarChart3,
    Users,
    ClipboardList,
    Leaf,
    LogOut,
} from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

interface Props {
    fullName: string;
    email: string;
    avatarUrl: string | null;
}

const navItems = [
    { href: "/farmer/dashboard/profile", label: "Profile", icon: User },
    { href: "/farmer/dashboard/products", label: "My Products", icon: Package },
    { href: "/farmer/dashboard/products/new", label: "Add Product", icon: Plus },
    { href: "/farmer/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/community", label: "Community", icon: Users, isExternal: true },
    { href: "/farmer/dashboard/orders", label: "Orders", icon: ClipboardList },
    {
        href: "/farmer/dashboard/analyzer",
        label: "AI Plant Analyzer",
        icon: Leaf,
    },
];

export default function FarmerSidebar({
    fullName,
    email,
    avatarUrl,
}: Props) {
    const pathname = usePathname();
    const initials =
        fullName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "F";

    return (
        <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-brand-800 text-white">
            {/* Logo */}
            <div className="px-6 pt-6 pb-4 flex items-center gap-3">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-500 text-white shrink-0">
                    <Leaf className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                    <p className="text-base font-extrabold">Freshique</p>
                    <p className="text-[11px] text-brand-200 font-medium tracking-wide">
                        Farmer Portal
                    </p>
                </div>
            </div>

            {/* User card */}
            <div className="px-6 py-4 border-y border-brand-700/60">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-brand-600 ring-2 ring-brand-400/50 shrink-0">
                        {avatarUrl ? (
                            <Image
                                src={avatarUrl}
                                alt={fullName}
                                fill
                                sizes="48px"
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <span className="grid place-items-center h-full w-full text-sm font-bold text-white">
                                {initials}
                            </span>
                        )}
                        <span className="absolute -bottom-0 -right-0 grid place-items-center h-4 w-4 rounded-full bg-brand-300 ring-2 ring-brand-800">
                            <span className="h-2 w-2 rounded-full bg-brand-700" />
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{fullName}</p>
                        <p className="text-[11px] text-brand-200 truncate">{email}</p>
                        <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-brand-500/30 text-brand-100 text-[10px] font-bold px-2 py-0.5">
                            Active Producer
                        </p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active =
                            pathname === href ||
                            (href !== "/farmer/dashboard/profile" &&
                                pathname.startsWith(href + "/")) ||
                            (href.endsWith("/products") &&
                                pathname.startsWith("/farmer/dashboard/products"));

                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                                        active
                                            ? "bg-brand-600 text-white"
                                            : "text-brand-100 hover:bg-brand-700/60"
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Sign out */}
            <div className="px-4 pb-4">
                <form action={signOutAction}>
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-danger-600 px-4 py-3 text-sm font-bold text-white hover:bg-danger-500 transition"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </form>
                <p className="mt-4 text-center text-[11px] text-brand-300">
                    © 2025 Freshique Farm
                </p>
            </div>
        </aside>
    );
}