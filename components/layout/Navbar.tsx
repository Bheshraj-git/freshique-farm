"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  ClipboardList,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import CartBadge from "@/components/cart/CartBadge";
import { useUser } from "@/lib/hooks/useUser";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const { profile } = useUser();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Role-aware link targets
  const ordersHref =
    profile?.role === "farmer" ? "/farmer/dashboard/orders" : "/orders";

  const links = [
    { href: "/community", label: "Community", icon: MessageCircle },
    { href: ordersHref, label: "My Orders", icon: ClipboardList },
  ];

  const iconLinks = [
    { href: "/market", label: "Market", icon: ShoppingBasket },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
  ];

  return (
    <header className="hidden md:block fixed top-5 left-0 right-0 z-40 px-6">
      <nav className="mx-auto max-w-7xl bg-white rounded-2xl shadow-nav border border-brand-50 px-6 py-3 flex items-center justify-between">
        <Logo />

        <ul className="flex items-center gap-8">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-semibold transition",
                  isActive(href)
                    ? "text-brand-700"
                    : "text-ink-700 hover:text-brand-700"
                )}
              >
                {label}
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          {iconLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center text-[11px] font-semibold transition",
                isActive(href)
                  ? "text-brand-700"
                  : "text-ink-700 hover:text-brand-700"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5 mb-0.5" strokeWidth={2} />
                {href === "/cart" && <CartBadge />}
              </div>
              {label}
            </Link>
          ))}

          <UserMenu />
        </div>
      </nav>
    </header>
  );
}