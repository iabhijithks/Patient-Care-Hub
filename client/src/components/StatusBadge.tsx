import { cn } from "@/lib/utils";

type Status = "waiting" | "in-progress" | "completed" | "dispensed" | "pending" | "requested" | "collected" | "testing" | "ready" | "discharged" | "consulting";

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case "completed":
      case "dispensed":
      case "ready":
      case "discharged":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "in-progress":
      case "testing":
      case "consulting":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "waiting":
      case "pending":
      case "requested":
      case "collected":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getLabel = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ");
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      getStyles(status),
      className
    )}>
      {getLabel(status)}
    </span>
  );
}
