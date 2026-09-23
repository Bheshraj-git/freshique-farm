import Link from "next/link";
import { Package, KeyRound, LogOut, ChevronRight } from "lucide-react";

const items = [
  {
    href: "/orders",
    label: "My Orders",
    Icon: Package,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    href: "/profile/password",
    label: "Change Password",
    Icon: KeyRound,
    iconBg: "bg-accent-100",
    iconColor: "text-accent-600",
  },
] as const;

export default function ProfileActionsCard({
  signOutSlot,
}: {
  signOutSlot: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-brand-50 shadow-card overflow-hidden">
      {items.map(({ href, label, Icon, iconBg, iconColor }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 px-5 py-4 border-b border-brand-50 hover:bg-brand-50/50 transition"
        >
          <span
            className={`grid place-items-center h-9 w-9 rounded-lg ${iconBg} ${iconColor}`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <span className="flex-1 text-sm font-semibold text-ink-900">
            {label}
          </span>
          <ChevronRight className="h-4 w-4 text-ink-300" />
        </Link>
      ))}

      {/* Sign out — provided by the parent so it can use the server action */}
      {signOutSlot}
    </div>
  );
}