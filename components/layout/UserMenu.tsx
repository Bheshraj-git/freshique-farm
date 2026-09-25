"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User as UserIcon, Package, Heart } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { signOutAction } from "@/app/(auth)/actions";

export default function UserMenu() {
  const { user, profile, loading } = useUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (loading) {
    return <div className="h-9 w-24 rounded-xl bg-brand-100 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full bg-[#4ee1a0] hover:bg-[#3cd290] px-6 py-2.5 text-base font-extrabold text-white shadow-sm transition hover:shadow-md active:scale-95"
      >
        <UserIcon className="h-5 w-5 stroke-[2.5]" />
        <span>Login</span>
      </Link>
    );
  }

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white px-2 py-1.5 shadow-soft hover:bg-brand-50 transition"
      >
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <span className="grid place-items-center h-8 w-8 rounded-full bg-brand-600 text-white text-xs font-bold">
            {initials}
          </span>
        )}
        <span className="text-sm font-semibold text-ink-900 hidden lg:inline">
          {profile?.full_name?.split(" ")[0] || "Account"}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-float border border-brand-50 overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-brand-50 bg-brand-50/40">
            <p className="text-sm font-bold text-ink-900 truncate">
              {profile?.full_name}
            </p>
            <p className="text-xs text-ink-500 truncate">{user.email}</p>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {profile?.role}
            </span>
          </div>

          <nav className="py-2">
            <MenuItem href="/orders" icon={Package} label="My Orders" onClick={() => setOpen(false)} />
            <MenuItem href="/favorites" icon={Heart} label="Favorites" onClick={() => setOpen(false)} />
            {profile?.role === "farmer" ? (
              <MenuItem
                href="/farmer/dashboard/profile"
                icon={UserIcon}
                label="Farmer Dashboard"
                onClick={() => setOpen(false)}
              />
            ) : (
              <MenuItem
                href="/profile"
                icon={UserIcon}
                label="Profile"
                onClick={() => setOpen(false)}
              />
            )}
          </nav>

          <button
            type="button"
            onClick={async () => {
              await signOutAction();
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-danger-600 hover:bg-danger-500/5 transition border-t border-brand-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-800 transition"
    >
      <Icon className="h-4 w-4 text-brand-600" />
      {label}
    </Link>
  );
}