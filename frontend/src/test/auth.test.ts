import { describe, it, expect, beforeEach } from "vitest";
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  clearAuth,
} from "../lib/auth";

describe("Auth Utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should store and retrieve token", () => {
    const token = "test-jwt-token-abc123";
    setStoredToken(token);
    expect(getStoredToken()).toBe(token);
  });

  it("should remove stored token", () => {
    setStoredToken("test-token");
    removeStoredToken();
    expect(getStoredToken()).toBeNull();
  });

  it("should store and retrieve user object", () => {
    const user = {
      id: "123",
      email: "test@example.com",
      is_active: true,
      role: "admin" as const,
    };
    setStoredUser(user);
    const retrieved = getStoredUser();
    expect(retrieved).toEqual(user);
  });

  it("should return null for malformed user JSON", () => {
    localStorage.setItem("clientpulse_user_data", "not-valid-json");
    expect(getStoredUser()).toBeNull();
  });

  it("should remove stored user", () => {
    const user = {
      id: "123",
      email: "test@example.com",
      is_active: true,
      role: "viewer" as const,
    };
    setStoredUser(user);
    removeStoredUser();
    expect(getStoredUser()).toBeNull();
  });

  it("should clear all auth data", () => {
    setStoredToken("test-token");
    setStoredUser({
      id: "456",
      email: "admin@example.com",
      is_active: true,
      role: "admin",
    });
    clearAuth();
    expect(getStoredToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });
});
