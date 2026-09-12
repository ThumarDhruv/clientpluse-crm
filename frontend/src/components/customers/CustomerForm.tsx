"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  ArrowLeft,
  UserPlus,
  Edit2,
  Clock,
  Sparkles,
  Info,
  Lightbulb,
  Check,
  RotateCw,
} from "lucide-react";
import Link from "next/link";
import {
  customerFormSchema,
  CustomerFormValues,
} from "@/features/customers/schemas";
import { Customer } from "@/features/customers/types";
import { Input } from "@/components/ui/Input";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { cn } from "@/lib/utils";

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (values: CustomerFormValues) => Promise<void>;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export function CustomerForm({
  initialData,
  onSubmit,
  isLoading = false,
  mode = "create",
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      status: initialData?.status || "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        company: initialData.company,
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const watchedValues = watch();
  const watchedName = watchedValues.name || "";
  const watchedEmail = watchedValues.email || "";
  const watchedPhone = watchedValues.phone || "";
  const watchedCompany = watchedValues.company || "";
  const watchedStatus = watchedValues.status || "active";

  const previewInitials = watchedName
    ? watchedName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "--"
    : "--";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      {/* Main Form Panel (8 cols) */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-4 bg-slate-50/70 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 px-6 sm:px-8 pt-6 sm:pt-8 rounded-t-xl border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                {mode === "create" ? (
                  <UserPlus className="w-5 h-5" />
                ) : (
                  <Edit2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {mode === "create" ? "Customer Information" : "Edit Customer Information"}
                </h2>
                <p className="text-xs text-slate-500">
                  Basic profile, organization, and communication details.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              {initialData?.id ? `ID: ${initialData.id.substring(0, 8)}...` : "ID: AUTO-ASSIGNED"}
            </span>
          </div>

          {/* Two-Column Grid for Main Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <Input
                label="Full Name *"
                placeholder="Enter customer name"
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                error={errors.name?.message}
                {...register("name")}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Input
                label="Email *"
                placeholder="name@company.com"
                type="email"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <Input
                label="Phone *"
                placeholder="+91 98765 43210"
                type="tel"
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

            {/* Company */}
            <div className="flex flex-col gap-1">
              <Input
                label="Company *"
                placeholder="Company name"
                leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
                error={errors.company?.message}
                {...register("company")}
              />
            </div>
          </div>

          {/* Status Selection Section (3 interactive radio cards) */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">
                Status <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">Select customer lifecycle stage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Active Option */}
              <div
                onClick={() => setValue("status", "active", { shouldValidate: true })}
                className={cn(
                  "relative cursor-pointer flex flex-col p-4 rounded-xl border transition-all select-none",
                  watchedStatus === "active"
                    ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                      watchedStatus === "active"
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {watchedStatus === "active" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">Active</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Customer is active</span>
              </div>

              {/* Lead Option */}
              <div
                onClick={() => setValue("status", "lead", { shouldValidate: true })}
                className={cn(
                  "relative cursor-pointer flex flex-col p-4 rounded-xl border transition-all select-none",
                  watchedStatus === "lead"
                    ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                      watchedStatus === "lead"
                        ? "border-amber-600 bg-amber-600 text-white"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {watchedStatus === "lead" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">Lead</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Potential customer</span>
              </div>

              {/* Inactive Option */}
              <div
                onClick={() => setValue("status", "inactive", { shouldValidate: true })}
                className={cn(
                  "relative cursor-pointer flex flex-col p-4 rounded-xl border transition-all select-none",
                  watchedStatus === "inactive"
                    ? "bg-slate-100 border-slate-400 ring-2 ring-slate-400/20 shadow-xs"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                      watchedStatus === "inactive"
                        ? "border-slate-600 bg-slate-600 text-white"
                        : "border-slate-300 bg-white"
                    )}
                  >
                    {watchedStatus === "inactive" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">Inactive</span>
                <span className="text-[11px] text-slate-500 mt-0.5">No longer active</span>
              </div>
            </div>
          </div>

          {/* Record creation tip callout */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="flex flex-col text-xs">
              <span className="font-bold text-slate-900">
                {mode === "create" ? "Record creation tip" : "Record update tip"}
              </span>
              <p className="text-slate-500 mt-0.5">
                Customer records immediately synchronize across workspace metrics, contact search, and team activity feeds.
              </p>
            </div>
          </div>

          {/* Bottom Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/dashboard/customers">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {mode === "create" ? (
                    <UserPlus className="w-3.5 h-3.5" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{mode === "create" ? "Create Customer" : "Save Changes"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Right-Hand Supporting Context / Live Preview Panel (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Live Preview Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 bg-slate-50/70 -mx-6 -mt-6 px-6 pt-6 rounded-t-xl border-b border-slate-100">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Preview Card
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-3.5 pt-1">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center shrink-0 border border-blue-200">
              {previewInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate">
                {watchedName || "New Contact"}
              </span>
              <span className="text-xs text-slate-500 truncate">
                {watchedCompany || "Company unassigned"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1 text-xs">
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium">Status</span>
              <CustomerStatusBadge status={watchedStatus} />
            </div>
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium">Email</span>
              <span className="font-mono text-[11px] text-slate-700 truncate max-w-[170px]">
                {watchedEmail || "not specified"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium">Phone</span>
              <span className="font-mono text-[11px] text-slate-700">
                {watchedPhone || "--"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Tips Guidelines Card */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold">Quick Guidelines</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-500">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Use corporate emails to automatically enrich domain firmographics.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Assign <strong>Lead</strong> to pending prospects awaiting discovery.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Phone numbers should include country code for direct dialing.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
