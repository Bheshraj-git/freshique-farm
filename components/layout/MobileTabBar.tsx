"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBasket, ShoppingCart, User } from "lucide-react";
import CartBadge from "@/components/cart/CartBadge";
import { useUser } from "@/lib/hooks/useUser";
import { cn } from "@/lib/utils";

export default function MobileTabBar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/market", label: "Market", icon: ShoppingBasket },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
    {
      href: user ? "/profile" : "/login",
      label: user ? "Profile" : "Login",
      icon: User,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-brand-100 shadow-[0_-4px_16px_-4px_rgba(15,81,50,0.08)]"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition",
                  active
                    ? "text-white bg-brand-600"
                    : "text-ink-700 hover:text-brand-700"
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  {href === "/cart" && <CartBadge />}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}