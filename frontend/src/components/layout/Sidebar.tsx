"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Settings,
  LogOut,
  X,
  MoreVertical,
} from "lucide-react";
import { useAuthContext } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuthContext();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutGrid,
      active: pathname === "/dashboard",
    },
    {
      label: "Customers",
      href: "/dashboard/customers",
      icon: Users,
      active: pathname.startsWith("/dashboard/customers"),
    },
    {
      label: "Settings",
      href: "#",
      icon: Settings,
      disabled: true,
    },
  ];

  const userEmail = user?.email || "john@company.com";
  const userName =
    user?.email?.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "John Doe";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-150"
        />
      )}

      {/* Main Sidebar (Light Stitch SaaS Design) */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between select-none text-slate-800 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-5 flex items-center justify-between">
            <Link
              href="/dashboard/customers"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 p-1.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full text-white"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                ClientPulse
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3 mt-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-400 cursor-not-allowed text-xs font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                    item.active
                      ? "bg-blue-100/70 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        item.active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Card */}
        <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200/80 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {userInitials}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {userName}
                </span>
                <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                  {userEmail}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User options"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* User Options Popover */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl border border-slate-200 shadow-lg p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100 z-50">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
