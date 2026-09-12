"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Users,
  Search,
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Activity,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks";
import { useToast } from "@/providers/ToastProvider";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const { login, isLoggingIn } = useAuth();
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "sarah.jenkins@technicorp.com",
      password: "ClientPulse#2026!",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      await login(values);
      success("Authenticated Successfully", "Welcome back to ClientPulse CRM.");
    } catch (err: any) {
      const msg =
        err.message ||
        "Invalid email or password. Please try again.";
      setApiError(msg);
      toastError("Authentication failed", msg);
    }
  };

  const handleQuickFill = (
    email = "sarah.jenkins@technicorp.com",
    password = "ClientPulse#2026!"
  ) => {
    setValue("email", email);
    setValue("password", password);
    clearErrors();
    setApiError(null);
    success("Credentials Populated", `Filled credentials for ${email}`);
  };

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row bg-white">
      {/* LEFT PANE: Light Grid Blueprint Hero */}
      <div
        className="lg:w-[54%] xl:w-[56%] p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-blue-100"
        style={{
          backgroundColor: "#f4f8ff",
          backgroundImage: `
            linear-gradient(to right, rgba(37, 99, 235, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(37, 99, 235, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      >
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 p-2">
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
            <span className="font-bold text-xl tracking-tight text-slate-900">
              ClientPulse
            </span>
          </div>

          {/* Support Link */}
          <div className="text-xs text-slate-500">
            <span>Don&apos;t have an account? </span>
            <button
              type="button"
              onClick={() => handleQuickFill()}
              className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Contact support
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="my-10 lg:my-auto max-w-xl z-10 flex flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-100/90 text-blue-700 text-xs font-bold uppercase tracking-wider">
              Customer Management CRM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Build stronger <br />
              customer relationships
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg">
              Stay organized, keep your customers happy, and grow your business with ClientPulse.
            </p>
          </div>

          {/* 3 Feature Items */}
          <div className="flex flex-col gap-4">
            {/* Feature 1 */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white border border-blue-100 shadow-2xs flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm text-slate-900">Manage Customers</h3>
                <p className="text-xs text-slate-500">
                  Keep all your customer information in one place.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white border border-blue-100 shadow-2xs flex items-center justify-center text-blue-600 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm text-slate-900">Boost Productivity</h3>
                <p className="text-xs text-slate-500">
                  Save time with powerful search and filtering.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white border border-blue-100 shadow-2xs flex items-center justify-center text-blue-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm text-slate-900">Grow Your Business</h3>
                <p className="text-xs text-slate-500">
                  Better relationships lead to more opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Visual Preview Cards */}
        <div className="z-10 pt-4 flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
          {/* Card 1: Live Activity */}
          <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-xl shadow-blue-900/5 flex flex-col gap-3 min-w-[260px] flex-1 max-w-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-800">Live Activity</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px]">
                +24.8%
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Row 1 */}
              <div className="flex items-center justify-between gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    OM
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      Olivia Martin
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      Northstar Labs
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold shrink-0">
                  Active
                </span>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    EW
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      Ethan Williams
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      Vertex Systems
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold shrink-0">
                  Lead
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Growth Trend */}
          <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-xl shadow-blue-900/5 flex flex-col justify-between w-full sm:w-44 h-[118px]">
            <div>
              <span className="text-[11px] font-medium text-slate-400">Growth Trend</span>
              <p className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                84.2%
              </p>
            </div>

            {/* Sparkline Curve */}
            <div className="w-full h-8 relative mt-1">
              <svg
                viewBox="0 0 120 30"
                className="w-full h-full overflow-visible"
                fill="none"
              >
                <path
                  d="M 2 26 C 25 24, 45 18, 65 14 C 85 10, 100 8, 115 6"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="115" cy="6" r="3.5" fill="#2563eb" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Elevated Card Login Form */}
      <div className="lg:w-[46%] xl:w-[44%] bg-[#fcfdff] p-6 sm:p-10 lg:p-12 flex items-center justify-center overflow-y-auto">
        {/* Floating Elevated Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/60 p-7 sm:p-9 max-w-[420px] w-full flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Icon Badge & Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100/80">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-blue-600"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-3.5">
              Welcome back
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to your account to manage your customers.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email Address */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="email" className="text-xs font-semibold text-slate-800">
                Email address <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register("email")}
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-white text-slate-900 border border-slate-300 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition"
                />
              </div>
              {errors.email && (
                <span className="text-xs text-rose-600">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="password" className="text-xs font-semibold text-slate-800">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-white text-slate-900 border border-slate-300 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-rose-600">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => handleQuickFill()}
                className="text-blue-600 hover:text-blue-700 font-semibold transition cursor-pointer"
                title="Populate test account credentials"
              >
                Demo Autofill ↗
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-1"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-0.5">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 font-normal absolute">
              or
            </span>
          </div>

          {/* Quick Demo Fill Action */}
          <button
            type="button"
            onClick={() => handleQuickFill()}
            className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center justify-center gap-2.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Fill Demo Credentials (1-Click)</span>
          </button>

          {/* Error Message */}
          {apiError && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-medium animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Interview Demo Autofill Shortcut */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Demo: <strong className="text-slate-600">sarah.jenkins@technicorp.com</strong></span>
            <button
              type="button"
              onClick={() => handleQuickFill()}
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Autofill
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
