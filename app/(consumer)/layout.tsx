import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";

export default function ConsumerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-14 md:pt-32 pb-20 md:pb-0">
                {children}
            </main>
            <Footer />
            <MobileTabBar />
        </div>
    );
}