"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, RotateCcw, ArrowUpDown, X, ChevronDown, Check } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  totalCount?: number;
}

export function CustomerFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortChange,
  onReset,
  totalCount,
}: CustomerFiltersProps) {
  const [searchInput, setSearchInput] = useState(search);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal search input if external search prop changes (e.g. on reset or URL param update)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce search updates ONLY when searchInput actually differs from search prop
  useEffect(() => {
    if (searchInput === search) return;

    const handler = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, search, onSearchChange]);

  // Handle click outside to close multi-select status dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Parse active selected statuses
  const selectedStatuses =
    status === "all" || !status
      ? []
      : status
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);

  const isAllSelected = selectedStatuses.length === 0;

  const handleToggleStatus = (val: string) => {
    if (val === "all") {
      onStatusChange("all");
      return;
    }

    let updated: string[];
    if (selectedStatuses.includes(val)) {
      updated = selectedStatuses.filter((s) => s !== val);
    } else {
      updated = [...selectedStatuses, val];
    }

    if (updated.length === 0 || updated.length === 3) {
      onStatusChange("all");
    } else {
      onStatusChange(updated.join(","));
    }
  };

  // Human readable label for the dropdown button
  const getStatusLabel = () => {
    if (isAllSelected) return "All Statuses";
    if (selectedStatuses.length === 1) {
      const s = selectedStatuses[0];
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    return selectedStatuses
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(", ");
  };

  const hasActiveFilters = search.trim() !== "" || status !== "all";

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-20">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by customer name, email, or company..."
          className="w-full h-9 pl-10 pr-10 rounded-lg bg-slate-50 hover:bg-slate-100/70 text-slate-900 placeholder:text-slate-400 text-sm border border-slate-200 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              onSearchChange("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Controls: Multi-Select Status Dropdown & Sorting & Reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Multi-Select Status Dropdown */}
        <div className="relative" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 transition cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Status:</span>
            <span className="text-blue-700 max-w-[150px] truncate">
              {getStatusLabel()}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                isStatusOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Multi-select Popover Menu */}
          {isStatusOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-xl p-2 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Filter by Status
              </div>

              {/* Option: All Statuses */}
              <button
                type="button"
                onClick={() => {
                  handleToggleStatus("all");
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isAllSelected
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>All Statuses</span>
                {isAllSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <div className="border-t border-slate-100 my-0.5" />

              {/* Option: Active */}
              <button
                type="button"
                onClick={() => handleToggleStatus("active")}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Active</span>
                </div>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedStatuses.includes("active")
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {selectedStatuses.includes("active") && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>

              {/* Option: Lead */}
              <button
                type="button"
                onClick={() => handleToggleStatus("lead")}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Lead</span>
                </div>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedStatuses.includes("lead")
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {selectedStatuses.includes("lead") && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>

              {/* Option: Inactive */}
              <button
                type="button"
                onClick={() => handleToggleStatus("inactive")}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Inactive</span>
                </div>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedStatuses.includes("inactive")
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {selectedStatuses.includes("inactive") && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              onReset();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
