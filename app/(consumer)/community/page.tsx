import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata = {
    title: "Community — Freshique Farm",
};

export default function CommunityPage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <div className="mx-auto grid place-items-center h-20 w-20 rounded-2xl bg-brand-100 text-brand-700 mb-6">
                <MessageCircle className="h-10 w-10" strokeWidth={1.5} />
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-ink-900 mb-3">
                Community
            </h1>
            <p className="text-ink-500 max-w-lg mx-auto mb-8">
                Share recipes, farming tips, and connect with other Freshique members.
                This space is coming in a future phase.
            </p>

            <Link href="/market">
                <Button>
                    Browse Market
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>
        </div>
    );
}