import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import Toaster from "@/components/ui/Toaster";
import CartHydrator from "@/components/cart/CartHydrator";
import { getCartLines } from "@/lib/queries/cart";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Freshique Farm — Harvest Happiness",
  description:
    "Experience the taste of pure nature. Real-time farm tracking, same-day harvest, and absolutely 100% chemical-free.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartLines = await getCartLines();

  return (
    <html lang="en" className={quicksand.variable}>
      <body className="min-h-screen font-sans">
        <ToastProvider>
          <CartHydrator initialItems={cartLines} />
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}