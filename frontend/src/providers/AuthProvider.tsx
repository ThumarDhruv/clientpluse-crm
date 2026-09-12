"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, UserRole } from "@/features/auth/types";
import { getStoredToken, getStoredUser, clearAuth } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  isManager: boolean;
  isViewer: boolean;
  /** True if the user can create or update customers (admin or manager). */
  canWrite: boolean;
  /** True if only the admin can perform the action (e.g. delete). */
  canDelete: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser as User);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const token = getStoredToken();
    if (!token && pathname.startsWith("/dashboard")) {
      router.replace("/login");
    } else if (token && pathname.startsWith("/login")) {
      router.replace("/dashboard/customers");
    }
  }, [pathname, isLoading, router]);

  const logout = () => {
    clearAuth();
    setUser(null);
    router.replace("/login");
  };

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        role,
        isAdmin: role === "admin",
        isManager: role === "manager",
        isViewer: role === "viewer",
        canWrite: role === "admin" || role === "manager",
        canDelete: role === "admin",
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
