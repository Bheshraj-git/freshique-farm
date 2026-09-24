import { MapPin, Building2, Map, Flag, Hash } from "lucide-react";

interface Props {
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipCode: string | null;
}

export default function FarmerFarmLocation({
    address,
    city,
    state,
    country,
    zipCode,
}: Props) {
    return (
        <section className="rounded-2xl bg-white border border-brand-50 shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-brand-600 text-white">
                    <MapPin className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-bold text-ink-900">Farm Location</h2>
            </div>

            {/* Address line in a dashed-border box */}
            <div className="rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 px-5 py-4 mb-6">
                <p className="text-sm text-ink-800">{address || "No address on file"}</p>
            </div>

            {/* 4 info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <InfoTile
                    icon={Building2}
                    label="City"
                    value={city || "—"}
                    color="brand"
                />
                <InfoTile
                    icon={Map}
                    label="State"
                    value={state || "—"}
                    color="accent"
                />
                <InfoTile
                    icon={Flag}
                    label="Country"
                    value={country || "—"}
                    color="brand"
                />
                <InfoTile
                    icon={Hash}
                    label="ZIP Code"
                    value={zipCode || "—"}
                    color="sky"
                />
            </div>
        </section>
    );
}

const palettes = {
    brand: "bg-brand-50 text-brand-700",
    accent: "bg-accent-50 text-accent-600",
    sky: "bg-sky-50 text-sky-600",
} as const;

function InfoTile({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    color: keyof typeof palettes;
}) {
    return (
        <div className={`rounded-2xl p-4 text-center ${palettes[color]}`}>
            <Icon className="h-5 w-5 mx-auto mb-1.5" />
            <p className="text-[11px] font-semibold opacity-80">{label}</p>
            <p className="text-sm font-bold mt-0.5 text-ink-900 truncate">
                {value}
            </p>
        </div>
    );
}