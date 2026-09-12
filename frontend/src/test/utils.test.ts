import { describe, it, expect } from "vitest";
import { formatDate, formatRelativeTime, cn } from "../lib/utils";

describe("Date Formatting Utilities", () => {
  it("should format date strings correctly", () => {
    const date = "2026-09-12T10:30:00Z";
    const formatted = formatDate(date);
    expect(formatted).toContain("Sep");
    expect(formatted).toContain("12");
    expect(formatted).toContain("2026");
  });

  it("should return em dash for undefined date", () => {
    expect(formatDate(undefined)).toBe("—");
  });

  it("should return em dash for empty string", () => {
    expect(formatDate("")).toBe("—");
  });

  it("should return original string if date parsing fails", () => {
    const invalidDate = "not-a-date";
    expect(formatDate(invalidDate)).toBe(invalidDate);
  });

  it("should format relative time for recent dates", () => {
    const now = new Date();
    const recent = new Date(now.getTime() - 30 * 1000).toISOString();
    expect(formatRelativeTime(recent)).toBe("just now");
  });

  it("should return em dash for undefined relative time", () => {
    expect(formatRelativeTime(undefined)).toBe("—");
  });
});

describe("ClassName Utility (cn)", () => {
  it("should merge class names correctly", () => {
    const result = cn("base-class", "additional-class");
    expect(result).toContain("base-class");
    expect(result).toContain("additional-class");
  });

  it("should handle conditional class names", () => {
    const isActive = true;
    const result = cn("base", isActive && "active");
    expect(result).toContain("base");
    expect(result).toContain("active");
  });

  it("should filter out false values", () => {
    const result = cn("base", false, null, undefined, "valid");
    expect(result).toContain("base");
    expect(result).toContain("valid");
    expect(result).not.toContain("false");
  });
});
