"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building2,
  Copy,
  Check,
  Calendar,
  Send,
  PhoneForwarded,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Receipt,
  FileText,
  History,
  LayoutGrid,
} from "lucide-react";
import { CustomerStatusBadge } from "@/components/customers/CustomerStatusBadge";
import { DeleteCustomerDialog } from "@/components/customers/DeleteCustomerDialog";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCustomer, useDeleteCustomer } from "@/features/customers/hooks";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const { data: customer, isLoading, isError, error } = useCustomer(customerId);
  const deleteMutation = useDeleteCustomer();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "invoices" | "contracts">("overview");
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyId = () => {
    if (!customer) return;
    navigator.clipboard.writeText(customer.id);
    setIsCopied(true);
    success("Copied to Clipboard", `Customer ID: ${customer.id}`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!customer) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(customer.id);
      success("Customer Deleted", `Profile for ${customer.name} was removed.`);
      router.push("/dashboard/customers");
    } catch (err: any) {
      toastError("Failed to Delete Customer", err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-7 h-96 rounded-xl" />
          <Skeleton className="lg:col-span-5 h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="px-6 py-12 max-w-2xl mx-auto text-center space-y-4">
        <div className="p-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
          <h2 className="text-lg font-bold">Customer Not Found</h2>
          <p className="text-sm">
            {(error as Error)?.message ||
              "The requested customer profile could not be located in the database."}
          </p>
        </div>
        <Link href="/dashboard/customers">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Customers
          </Button>
        </Link>
      </div>
    );
  }

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const formattedCreated = formatDate(customer.created_at);
  const formattedUpdated = formatDate(customer.updated_at);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
      {/* Back Link Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Customers</span>
        </Link>
      </div>

      {/* Profile Hero Header Banner Card */}
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* 56px Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0">
              {initials}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight truncate">
                  {customer.name}
                </h1>
                <CustomerStatusBadge status={customer.status} pulse />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-800">{customer.company}</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Created on {formattedCreated}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <Link href={`/dashboard/customers/${customer.id}/edit`}>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit</span>
              </button>
            </Link>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-rose-50 hover:bg-rose-100/80 text-rose-700 text-xs font-semibold border border-rose-200 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 -mb-6 pt-2 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`relative pb-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === "overview"
                ? "text-blue-600 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Overview</span>
            {activeTab === "overview" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`relative pb-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === "activity"
                ? "text-blue-600 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>Activity</span>
            {activeTab === "activity" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`relative pb-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === "invoices"
                ? "text-blue-600 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Receipt className="w-4 h-4 text-slate-400" />
            <span>Invoices</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600">
              3
            </span>
            {activeTab === "invoices" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contracts")}
            className={`relative pb-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === "contracts"
                ? "text-blue-600 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Contracts</span>
            {activeTab === "contracts" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Two-Column Detailed Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Customer Information (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 bg-slate-50/70 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 p-6 sm:px-8 rounded-t-xl border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Customer Information</h2>
            </div>
            <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider">
              VERIFIED RECORD
            </span>
          </div>

          <div className="flex flex-col divide-y divide-slate-100 text-xs">
            {/* Full Name */}
            <div className="py-3.5 grid grid-cols-3 items-center">
              <span className="font-medium text-slate-500">Full name</span>
              <span className="col-span-2 font-semibold text-slate-900">{customer.name}</span>
            </div>

            {/* Email Address */}
            <div className="py-3.5 grid grid-cols-3 items-center">
              <span className="font-medium text-slate-500">Email</span>
              <div className="col-span-2 flex items-center gap-2">
                <a
                  href={`mailto:${customer.email}`}
                  className="font-medium text-blue-600 hover:underline cursor-pointer truncate"
                >
                  {customer.email}
                </a>
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  verified
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="py-3.5 grid grid-cols-3 items-center">
              <span className="font-medium text-slate-500">Phone</span>
              <a
                href={`tel:${customer.phone}`}
                className="col-span-2 font-mono font-medium text-slate-900 hover:text-blue-600"
              >
                {customer.phone}
              </a>
            </div>

            {/* Company */}
            <div className="py-3.5 grid grid-cols-3 items-center">
              <span className="font-medium text-slate-500">Company</span>
              <div className="col-span-2 flex items-center gap-2">
                <span className="font-semibold text-slate-900">{customer.company}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600">
                  Enterprise
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="py-3.5 grid grid-cols-3 items-center">
              <span className="font-medium text-slate-500">Status</span>
              <div className="col-span-2">
                <CustomerStatusBadge status={customer.status} pulse />
              </div>
            </div>

            {/* Customer ID */}
            <div className="py-3.5 grid grid-cols-3 items-center">
              <span className="font-medium text-slate-500">Customer ID</span>
              <div className="col-span-2 flex items-center gap-2.5">
                <span className="font-mono text-slate-800 bg-slate-50 border border-slate-200 px-2 py-1 rounded text-xs select-all">
                  {customer.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy Customer ID"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all text-xs font-semibold cursor-pointer active:scale-95"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 opacity-70" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip within Card */}
          <div className="mt-2 p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Lifetime Value
              </span>
              <span className="text-base font-bold text-slate-900 mt-0.5">$38,450</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Health Score
              </span>
              <span className="text-base font-bold text-emerald-600 mt-0.5">94 / 100</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                NPS Rating
              </span>
              <span className="text-base font-bold text-blue-600 mt-0.5">10 (Promoter)</span>
            </div>
          </div>
        </div>

        {/* Right Card: Contact Information & System Audit (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Contact Channels Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 bg-slate-50/70 -mx-6 -mt-6 p-6 rounded-t-xl border-b border-slate-100">
              <Mail className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Contact Information</h2>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              {/* Email Contact */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Work Email
                  </span>
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-xs font-bold text-slate-900 truncate hover:text-blue-600"
                  >
                    {customer.email}
                  </a>
                </div>
                <a
                  href={`mailto:${customer.email}`}
                  aria-label="Send direct email"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Phone Contact */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Mobile Phone
                  </span>
                  <a
                    href={`tel:${customer.phone}`}
                    className="font-mono text-xs font-bold text-slate-900 truncate hover:text-blue-600"
                  >
                    {customer.phone}
                  </a>
                </div>
                <a
                  href={`tel:${customer.phone}`}
                  aria-label="Call directly"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-white transition-colors"
                >
                  <PhoneForwarded className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Company Item */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Organization
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {customer.company}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    Enterprise Tier • 120 Seats
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & System Audit Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 bg-slate-50/70 -mx-6 -mt-6 p-6 rounded-t-xl border-b border-slate-100">
              <History className="w-4 h-4 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-900">Timeline &amp; Audit</h2>
            </div>

            <div className="relative pl-6 flex flex-col gap-5 pt-1 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {/* Audit Item 1: Created */}
              <div className="relative flex flex-col">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                <span className="text-xs font-bold text-slate-900">Account created</span>
                <span className="font-mono text-[10px] text-slate-500">{formattedCreated}</span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Created via Self-serve Onboarding
                </span>
              </div>

              {/* Audit Item 2: Updated */}
              <div className="relative flex flex-col">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <span className="text-xs font-bold text-slate-900">Last updated</span>
                <span className="font-mono text-[10px] text-slate-500">{formattedUpdated}</span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Profile metadata synchronized via CRM sync
                </span>
              </div>

              {/* Audit Item 3: Assigned Rep */}
              <div className="relative flex flex-col">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 ring-4 ring-white" />
                <span className="text-xs font-bold text-slate-900">Assigned Account Manager</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
                    JD
                  </div>
                  <span className="text-xs font-medium text-slate-900">John Doe</span>
                  <span className="text-[10px] text-slate-400">(Account Manager)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteCustomerDialog
        customer={customer}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
