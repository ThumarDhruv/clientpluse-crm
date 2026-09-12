import React from "react";
import { CustomerStatus } from "@/features/customers/types";
import { cn } from "@/lib/utils";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  className?: string;
  pulse?: boolean;
}

export function CustomerStatusBadge({
  status,
  className,
  pulse = false,
}: CustomerStatusBadgeProps) {
  const configs = {
    active: {
      bg: "bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]",
      dot: "bg-[#10b981]",
      label: "Active",
    },
    lead: {
      bg: "bg-[#fffbeb] border-[#fde68a] text-[#92400e]",
      dot: "bg-[#f59e0b]",
      label: "Lead",
    },
    inactive: {
      bg: "bg-[#f1f5f9] border-[#e2e8f0] text-[#475569]",
      dot: "bg-[#94a3b8]",
      label: "Inactive",
    },
  };

  const config = configs[status] || configs.inactive;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-label-sm text-label-sm uppercase tracking-wider font-semibold select-none",
        config.bg,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              config.dot
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            config.dot
          )}
        />
      </span>
      <span>{config.label}</span>
    </span>
  );
}
