"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBasket, ShoppingCart, User } from "lucide-react";
import CartBadge from "@/components/cart/CartBadge";
import { useUser } from "@/lib/hooks/useUser";
import { cn } from "@/lib/utils";

export default function MobileTabBar() {
  const pathname = usePathname();
  const { user, profile } = useUser();

  const accountHref = !user
    ? "/login"
    : profile?.role === "farmer"
      ? "/farmer/dashboard/profile"
      : "/profile";

  const accountLabel = !user ? "Login" : "Account";

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/market", label: "Market", icon: ShoppingBasket },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    { href: accountHref, label: accountLabel, icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // Match farmer profile routes to the "Account" tab
    if (href.startsWith("/farmer")) return pathname.startsWith("/farmer");
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-100 shadow-[0_-4px_16px_-4px_rgba(15,81,50,0.08)] pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-4 px-1 py-1">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-semibold transition-all duration-200",
                  active
                    ? "text-emerald-800 bg-emerald-100/80 font-bold"
                    : "text-ink-700 hover:text-emerald-700 hover:bg-emerald-50/50"
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  {href === "/cart" && <CartBadge />}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}