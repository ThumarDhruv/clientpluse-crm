import React from "react";
import { Users, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No Customers Found",
  description = "No customer accounts match your current query or filter criteria.",
  actionText = "Add New Customer",
  actionHref = "/dashboard/customers/new",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="w-full bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-secondary shadow-xs">
        <Users className="w-7 h-7" />
      </div>

      <div className="max-w-md space-y-1">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          {title}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {description}
        </p>
      </div>

      {actionHref ? (
        <Link href={actionHref}>
          <Button
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {actionText}
          </Button>
        </Link>
      ) : onAction ? (
        <Button
          size="md"
          onClick={onAction}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}
