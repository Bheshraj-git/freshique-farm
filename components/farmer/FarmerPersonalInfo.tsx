import Link from "next/link";
import { User, KeyRound } from "lucide-react";

interface Props {
    fullName: string;
    phone: string | null;
    email: string;
    joinedLabel: string;
}

export default function FarmerPersonalInfo({
    fullName,
    phone,
    email,
    joinedLabel,
}: Props) {
    return (
        <section className="rounded-2xl bg-white border border-brand-50 shadow-card p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-600 text-white">
                        <User className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-bold text-ink-900">
                        Personal Information
                    </h2>
                </div>
                <Link
                    href="/profile/password"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent-500 px-4 py-2 text-xs font-bold text-white hover:bg-accent-600 transition"
                >
                    <KeyRound className="h-3.5 w-3.5" />
                    Change Password
                </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" value={fullName} />
                <Field label="Phone Number" value={phone || "—"} />
                <Field label="Email Address" value={email} />
                <Field label="Joined Freshique" value={joinedLabel} accent />
            </div>
        </section>
    );
}

function Field({
    label,
    value,
    accent,
}: {
    label: string;
    value: string;
    accent?: boolean;
}) {
    return (
        <div>
            <p className="text-xs text-ink-500 font-medium mb-1">{label}</p>
            <p
                className={
                    accent
                        ? "text-base font-bold text-brand-700"
                        : "text-base font-bold text-ink-900"
                }
            >
                {value}
            </p>
        </div>
    );
}