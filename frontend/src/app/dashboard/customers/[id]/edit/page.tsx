"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCustomer, useUpdateCustomer } from "@/features/customers/hooks";
import { CustomerFormValues } from "@/features/customers/schemas";
import { useToast } from "@/providers/ToastProvider";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const { data: customer, isLoading } = useCustomer(customerId);
  const updateMutation = useUpdateCustomer(customerId);
  const { success, error: toastError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(values);
      success(
        "Customer Updated",
        `Changes to ${values.name} were successfully saved.`
      );
      router.push(`/dashboard/customers/${customerId}`);
    } catch (err: any) {
      toastError("Failed to Update Customer", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
      {/* Top Header & Breadcrumbs */}
      <div className="space-y-1">
        <Breadcrumbs
          items={[
            { label: "Customers", href: "/dashboard/customers" },
            {
              label: customer?.name || "Customer",
              href: `/dashboard/customers/${customerId}`,
            },
            { label: "Edit Profile", active: true },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Edit Customer
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
              Update profile information for this customer record.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Auto-sync enabled
            </span>
          </div>
        </div>
      </div>

      {/* Reusable Customer Form in Edit Mode */}
      <CustomerForm
        initialData={customer}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        mode="edit"
      />
    </div>
  );
}
