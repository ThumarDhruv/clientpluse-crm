import React from "react";
import { Users, CheckCircle2, UserCheck, UserX, TrendingUp } from "lucide-react";
import { CustomerMetrics } from "@/features/customers/types";

interface CustomerKpiCardsProps {
  metrics?: CustomerMetrics;
  isLoading?: boolean;
}

export function CustomerKpiCards({
  metrics,
  isLoading = false,
}: CustomerKpiCardsProps) {
  const total = metrics?.total_customers || 0;
  const active = metrics?.active_count || 0;
  const leads = metrics?.lead_count || 0;
  const inactive = metrics?.inactive_count || 0;

  const activeRatio = total > 0 ? ((active / total) * 100).toFixed(0) : "0";
  const inactiveRatio = total > 0 ? ((inactive / total) * 100).toFixed(0) : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Customers */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Customers
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {isLoading ? "..." : total.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <TrendingUp className="w-3 h-3" />
            +12%
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          All registered enterprise records
        </p>
      </div>

      {/* 2. Active Accounts */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Accounts
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {isLoading ? "..." : active.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {activeRatio}% of total
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Contracted & actively operational
        </p>
      </div>

      {/* 3. Qualified Leads */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Qualified Leads
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {isLoading ? "..." : leads.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Pipeline
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Prospective customer accounts
        </p>
      </div>

      {/* 4. Inactive */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Inactive Accounts
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <UserX className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            {isLoading ? "..." : inactive.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {inactiveRatio}% churn
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Archived or dormant profiles
        </p>
      </div>
    </div>
  );
}
