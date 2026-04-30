import { cn } from "@/lib/utils";
import { StopType } from "@/types";
import { STOP_TYPE_CONFIG } from "@/lib/constants";

interface BadgeProps {
  type: StopType;
  className?: string;
}

export function StopBadge({ type, className }: BadgeProps) {
  const config = STOP_TYPE_CONFIG[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-xl",
        config.bg,
        config.color,
        className
      )}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}

interface GenericBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: GenericBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-xl bg-birk-yellow-soft text-birk-text",
        className
      )}
    >
      {children}
    </span>
  );
}
