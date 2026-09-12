"use client";

import React from "react";
import Link from "next/link";
import {
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Customer } from "@/features/customers/types";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthContext } from "@/providers/AuthProvider";

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  onDeleteClick: (customer: Customer) => void;
}

export function CustomerTable({
  customers,
  isLoading,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onDeleteClick,
}: CustomerTableProps) {
  const { canWrite, canDelete } = useAuthContext();
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2.5">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Generate pagination numbers: e.g. [1, 2, 3, 4, 5]
  const renderPaginationButtons = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages.map((p, idx) => {
      if (typeof p === "string") {
        return (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 h-8 flex items-center justify-center text-xs text-slate-400 select-none"
          >
            ...
          </span>
        );
      }

      const isActive = p === page;
      return (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${isActive
            ? "bg-blue-600 text-white shadow-xs"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white"
            }`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="h-10 bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase tracking-wider select-none">
              <th className="py-3 px-5">Customer</th>
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Phone</th>
              <th className="py-3 px-5">Company</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Created Date</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {customers.map((customer) => {
              const initials = customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                >
                  {/* Name & Initials Avatar */}
                  <td className="py-3.5 px-5">
                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className="flex items-center gap-3 group-hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                          {customer.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          CP-{customer.id.substring(0, 6).toUpperCase()}
                        </span>
                      </div>
                    </Link>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-5 text-slate-600 truncate max-w-[200px]">
                    <a
                      href={`mailto:${customer.email}`}
                      className="hover:text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {customer.email}
                    </a>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-5 text-slate-600 font-mono text-xs whitespace-nowrap">
                    <a
                      href={`tel:${customer.phone}`}
                      className="hover:text-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {customer.phone}
                    </a>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-5 text-slate-800 font-medium whitespace-nowrap">
                    {customer.company}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <CustomerStatusBadge status={customer.status} pulse />
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-5 text-slate-500 text-[11px] whitespace-nowrap">
                    {formatDate(customer.created_at)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        title="View Customer Profile"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      {canWrite && (
                        <Link
                          href={`/dashboard/customers/${customer.id}/edit`}
                          title="Edit Customer Profile"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onDeleteClick(customer);
                          }}
                          title="Delete Customer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 select-none">
        {/* Total info & Page Size */}
        <div className="flex items-center gap-3">
          <span>
            Showing{" "}
            <strong className="text-slate-900 font-semibold">
              {total > 0 ? (page - 1) * pageSize + 1 : 0}
            </strong>
            -
            <strong className="text-slate-900 font-semibold">
              {Math.min(page * pageSize, total)}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-900 font-semibold">
              {total.toLocaleString()}
            </strong>{" "}
            customers
          </span>

          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
            <span className="text-slate-400 uppercase font-semibold text-[10px]">
              Per page:
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-md px-2 py-0.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Numeric Page Nav Buttons (< 1 2 3 >) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {renderPaginationButtons()}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
