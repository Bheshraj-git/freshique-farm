import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/layout/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page-gradient">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 sm:pt-6 pb-12">
        {/* Top bar with logo only — no nav links on auth pages */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <Logo />
          <Link
            href="/"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            ← Back to home
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}