"use client";

import React, { useState, useEffect } from "react";
import { Trash2, AlertTriangle, X, CheckCircle2 } from "lucide-react";
import { Customer } from "@/features/customers/types";
import { CustomerStatusBadge } from "./CustomerStatusBadge";

interface DeleteCustomerDialogProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export function DeleteCustomerDialog({
  customer,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteCustomerDialogProps) {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasConfirmed(false);
    }
  }, [isOpen]);

  if (!isOpen || !customer) return null;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const shortId = `CP-${customer.id.substring(0, 6).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Elevated Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl p-6 sm:p-7 flex flex-col gap-5 overflow-hidden animate-in zoom-in-95 duration-150 border border-slate-200"
      >
        {/* Top ambient highlight gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-400" />

        {/* Top Section: Icon, Title & Close */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600 shadow-2xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <h2
                id="modal-headline"
                className="text-lg font-bold text-slate-900 tracking-tight"
              >
                Delete customer?
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                This action cannot be undone. The customer record for{" "}
                <strong className="text-slate-900 font-semibold">{customer.name}</strong>{" "}
                will be permanently removed from your CRM database.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition -mr-1 -mt-1 shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Customer Record Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-left">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {customer.name}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              </div>
              <span className="text-[11px] text-slate-500 truncate font-mono">
                {customer.company} • Customer ID: {shortId}
              </span>
            </div>
          </div>
          <div className="shrink-0 ml-2">
            <CustomerStatusBadge status={customer.status} pulse />
          </div>
        </div>

        {/* Warning Callout */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-left">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 text-xs text-amber-900">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              DATA CASCADE NOTICE
            </span>
            <p className="text-[11px] text-amber-800 leading-snug">
              Associated notes, 3 invoices, signed contracts, and historical activity audit logs will be permanently purged.
            </p>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <label className="flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasConfirmed}
            onChange={(e) => setHasConfirmed(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
          />
          <span>
            I understand that <strong className="text-slate-800">{customer.company}</strong> historical analytics will no longer be recoverable.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading || !hasConfirmed}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm shadow-rose-600/20 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Customer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
