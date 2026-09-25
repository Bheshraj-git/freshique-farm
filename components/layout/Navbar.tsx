"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquareMore,
  PackageOpen,
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
    { href: "/community", label: "Community", icon: MessageSquareMore },
    { href: ordersHref, label: "My Orders", icon: PackageOpen },
  ];

  const iconLinks = [
    { href: "/market", label: "Market", icon: ShoppingBasket },
    { href: "/cart", label: "Cart", icon: ShoppingCart },
  ];

  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-white rounded-b-[2.5rem] shadow-[0_4px_30px_-6px_rgba(0,0,0,0.06)]">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Logo aligned with page content */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center: Community and My Orders links */}
        <ul className="flex items-center gap-14">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2 text-[17px] font-bold tracking-tight transition group",
                  isActive(href)
                    ? "text-[#184d39]"
                    : "text-[#243a2e] hover:text-[#00875a]"
                )}
              >
                <span>{label}</span>
                <Icon className="h-5 w-5 text-[#184d39] stroke-[2.4] group-hover:scale-110 transition-transform" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Market, Cart, Login */}
        <div className="flex items-center gap-10">
          {iconLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center justify-center text-xs font-bold transition group",
                isActive(href)
                  ? "text-[#184d39]"
                  : "text-[#184d39] hover:text-[#00875a]"
              )}
            >
              <div className="relative">
                <Icon className="h-6 w-6 mb-1 text-[#184d39] stroke-[2.2] group-hover:scale-110 transition-transform" />
                {href === "/cart" && <CartBadge />}
              </div>
              <span className="leading-tight font-extrabold tracking-tight">{label}</span>
            </Link>
          ))}

          <UserMenu />
        </div>
      </nav>
    </header>
  );
}