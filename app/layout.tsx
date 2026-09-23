import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import Toaster from "@/components/ui/Toaster";
import { ToastProvider } from "@/lib/toast";
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
  // Load the server cart once per request. Hydrates the Zustand store
  // and keeps the navbar badge correct.
  const cartLines = await getCartLines();

  return (
    <html lang="en" className={quicksand.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <ToastProvider>
          <CartHydrator initialItems={cartLines} />
          <Navbar />
          <main className="flex-1 pt-28 md:pt-32 pb-24 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileTabBar />
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}