import Link from "next/link";
import { Leaf, ArrowLeft } from "lucide-react";

export const metadata = { title: "AI Plant Analyzer — Freshique Farm" };

export default function AnalyzerPage() {
    return (
        <div className="max-w-2xl mx-auto text-center py-20">
            <div className="mx-auto grid place-items-center h-20 w-20 rounded-2xl bg-brand-100 text-brand-700 mb-6">
                <Leaf className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-extrabold text-ink-900 mb-2">
                AI Plant Analyzer coming soon
            </h1>
            <p className="text-ink-500 mb-8">
                Upload a photo of your crop and get instant AI-powered insights on
                plant health, diseases, and care.
            </p>
            <Link
                href="/farmer/dashboard/profile"
                className="text-sm font-bold text-brand-700 hover:text-brand-800"
            >
                ← Back to Profile
            </Link>
        </div>
    );
}