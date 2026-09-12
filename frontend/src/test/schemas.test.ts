import { describe, it, expect } from "vitest";
import { customerFormSchema } from "../features/customers/schemas";

describe("Customer Zod Schema Validation", () => {
  it("should validate a correct customer payload", () => {
    const validData = {
      name: "Marcus Vance",
      email: "marcus.vance@vanguard.io",
      phone: "+1 (555) 342-9811",
      company: "Vanguard Logistics",
      status: "active" as const,
    };

    const result = customerFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Marcus Vance");
      expect(result.data.email).toBe("marcus.vance@vanguard.io");
    }
  });

  it("should reject customer with name shorter than 2 characters", () => {
    const invalidData = {
      name: "A",
      email: "valid@email.com",
      phone: "+15551234567",
      company: "Acme",
      status: "lead" as const,
    };

    const result = customerFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject malformed email address", () => {
    const invalidData = {
      name: "Jane Doe",
      email: "not-an-email",
      phone: "+15551234567",
      company: "Acme",
      status: "active" as const,
    };

    const result = customerFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject invalid customer status", () => {
    const invalidData = {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+15551234567",
      company: "Acme",
      status: "unknown_status" as any,
    };

    const result = customerFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
