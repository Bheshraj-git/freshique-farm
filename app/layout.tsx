import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import Toaster from "@/components/ui/Toaster";
import { ToastProvider } from "@/lib/toast";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <ToastProvider>
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