"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, Settings } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isCustomers = pathname.startsWith("/dashboard/customers");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Responsive Sidebar (Drawer on Mobile, Fixed on Desktop) */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="w-full lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />
        <main className="w-full pt-20 px-2 sm:px-6 lg:px-8 flex-1 pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Stitch Mobile Spec) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 px-6 flex items-center justify-around shadow-lg">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            !isCustomers ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Overview</span>
        </Link>
        <Link
          href="/dashboard/customers"
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            isCustomers ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Customers</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-400 cursor-not-allowed">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </div>
      </nav>
    </div>
  );
}
