"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CustomerKpiCards } from "@/components/customers/CustomerKpiCards";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { DeleteCustomerDialog } from "@/components/customers/DeleteCustomerDialog";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCustomers, useDeleteCustomer } from "@/features/customers/hooks";
import { Customer } from "@/features/customers/types";
import { useToast } from "@/providers/ToastProvider";
import { useAuthContext } from "@/providers/AuthProvider";

function CustomersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial query state directly from URL query parameters (persists on refresh)
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "all";
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialPageSize = Number(searchParams.get("page_size")) || 10;
  const initialSort = searchParams.get("sort") || "created_at:desc";

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [sortBy, setSortBy] = useState(initialSort);

  // Sync state to URL search parameters so page refresh keeps all filters & search terms
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status && status !== "all") params.set("status", status);
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 10) params.set("page_size", String(pageSize));
    if (sortBy !== "created_at:desc") params.set("sort", sortBy);

    const queryStr = params.toString();
    const targetUrl = `/dashboard/customers${queryStr ? `?${queryStr}` : ""}`;
    window.history.replaceState(null, "", targetUrl);
  }, [search, status, page, pageSize, sortBy]);

  // Deletion state
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();
  const { canWrite } = useAuthContext();

  const [sortField, sortOrder] = sortBy.split(":") as [string, "asc" | "desc"];

  const { data, isLoading, isError, error } = useCustomers({
    page,
    page_size: pageSize,
    search: search || undefined,
    status: status === "all" ? undefined : status,
    sort_by: sortField,
    sort_order: sortOrder,
  });

  const deleteMutation = useDeleteCustomer();

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((st: string) => {
    setStatus(st);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sb: string) => {
    setSortBy(sb);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearch("");
    setStatus("all");
    setSortBy("created_at:desc");
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(customerToDelete.id);
      success(
        "Customer Deleted",
        `Successfully deleted ${customerToDelete.name}.`
      );
      // If we deleted the only customer on this page and page > 1, navigate back one page
      if (data?.items && data.items.length === 1 && page > 1) {
        setPage(page - 1);
      }
      setCustomerToDelete(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete customer.";
      toastError("Failed to Delete Customer", message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCsv = () => {
    if (!data?.items || data.items.length === 0) {
      toastError("Export Failed", "No customers available to export.");
      return;
    }
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Status", "Created At"];
    const rows = data.items.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.phone}"`,
      `"${c.company}"`,
      c.status,
      c.created_at,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clientpulse_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success("Export Complete", "Customer records exported to CSV.");
  };

  return (
    <div className="px-2 sm:px-6 py-4 max-w-7xl mx-auto flex flex-col gap-6 w-full">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <Breadcrumbs items={[{ label: "Customers", active: true }]} />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight pt-1">
            Customers
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Manage, segment, and monitor your customer relationships.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportCsv}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          {canWrite && (
            <Link href="/dashboard/customers/new">
              <Button
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Customer
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 4 KPI Summary Metric Cards */}
      <CustomerKpiCards metrics={data?.metrics} isLoading={isLoading} />

      {/* Filtering Controls Bar with Multi-Select Status & Search */}
      <CustomerFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onReset={handleReset}
        totalCount={data?.total}
      />

      {/* Main Table View */}
      {isError ? (
        <div className="p-8 rounded-xl bg-rose-50 border border-rose-200 text-center space-y-2">
          <p className="font-headline-sm text-rose-900 font-semibold">
            Failed to Load Customers
          </p>
          <p className="text-rose-800 text-sm">
            {(error as Error)?.message || "Could not reach the backend API server."}
          </p>
        </div>
      ) : !isLoading && (!data?.items || data.items.length === 0) ? (
        <EmptyState
          title={search || status !== "all" ? "No Matching Customers" : "Customer Directory is Empty"}
          description={
            search || status !== "all"
              ? `No records found matching your filters. Try clearing or adjusting search.`
              : "Get started by creating your first customer profile."
          }
        />
      ) : (
        <CustomerTable
          customers={data?.items || []}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          total={data?.total || 0}
          totalPages={data?.total_pages || 1}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onDeleteClick={(cust) => setCustomerToDelete(cust)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteCustomerDialog
        customer={customerToDelete}
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function CustomersDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-6 max-w-7xl mx-auto flex flex-col gap-6 w-full">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <CustomersContent />
    </Suspense>
  );
}
