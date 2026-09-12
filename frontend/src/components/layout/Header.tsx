"use client";

import React from "react";
import { Search, Bell, Menu, HelpCircle, ChevronRight } from "lucide-react";
import { useAuthContext } from "@/providers/AuthProvider";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onOpenMobileMenu?: () => void;
}

export function Header({ onSearch, onOpenMobileMenu }: HeaderProps) {
  const { user } = useAuthContext();

  const userInitial = user?.email?.charAt(0).toUpperCase() || "J";

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-40 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
      {/* Mobile Hamburger & Workspace Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          {/* Logo icon */}
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs p-1.5">
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
          <nav className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-500">ClientPulse</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Workspace</span>
          </nav>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-lg mx-3 sm:mx-8">
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full h-9 pl-10 pr-12 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Action Strip */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Help button */}
        <button
          type="button"
          aria-label="Help and documentation"
          className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-100 cursor-pointer">
          {userInitial}
        </div>
      </div>
    </header>
  );
}
