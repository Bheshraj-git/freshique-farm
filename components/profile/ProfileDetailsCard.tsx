import { Phone, MapPin, Calendar } from "lucide-react";

interface Props {
  phone: string | null;
  region: string;
  joinedAt: string;
}

export default function ProfileDetailsCard({ phone, region, joinedAt }: Props) {
  return (
    <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-5">
      <p className="text-[11px] font-bold tracking-wider text-ink-500 uppercase mb-4">
        Details
      </p>

      <ul className="space-y-4">
        <Row icon={Phone} label="Phone" value={phone || "—"} />
        <Row icon={MapPin} label="Region" value={region} />
        <Row icon={Calendar} label="Joined" value={joinedAt} />
      </ul>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-ink-500">{label}</p>
        <p className="text-sm font-medium text-ink-900 truncate">{value}</p>
      </div>
    </li>
  );
}