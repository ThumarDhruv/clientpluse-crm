"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { useCreateCustomer } from "@/features/customers/hooks";
import { CustomerFormValues } from "@/features/customers/schemas";
import { useToast } from "@/providers/ToastProvider";

export default function NewCustomerPage() {
  const router = useRouter();
  const createMutation = useCreateCustomer();
  const { success, error: toastError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const newCustomer = await createMutation.mutateAsync(values);
      success(
        "Customer Created",
        `Profile for ${newCustomer.name} was successfully created.`
      );
      router.push(`/dashboard/customers/${newCustomer.id}`);
    } catch (err: any) {
      toastError("Failed to Create Customer", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
      {/* Top Header & Breadcrumbs */}
      <div className="space-y-1">
        <Breadcrumbs
          items={[
            { label: "Customers", href: "/dashboard/customers" },
            { label: "Add Customer", active: true },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Add Customer
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
              Create a new customer record to start tracking interactions and revenue.
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

      {/* Customer Form Component */}
      <CustomerForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        mode="create"
      />
    </div>
  );
}
