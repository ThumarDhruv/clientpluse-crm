import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 font-body-sm text-body-sm text-secondary"
    >
      <Link
        href="/dashboard"
        className="hover:text-on-surface transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={item.label + idx}>
          <ChevronRight className="w-3.5 h-3.5 text-outline-variant shrink-0" />
          {item.active || !item.href ? (
            <span className="text-on-surface font-semibold truncate max-w-[200px]">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-on-surface transition-colors truncate max-w-[200px]"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
