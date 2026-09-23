import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-6",
        className
      )}
    >
      <div className="grid place-items-center h-24 w-24 rounded-full bg-brand-100/50 mb-6">
        <Icon className="h-12 w-12 text-brand-500" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-ink-900 mb-2">{title}</h2>
      {description && (
        <p className="text-ink-500 max-w-md mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}