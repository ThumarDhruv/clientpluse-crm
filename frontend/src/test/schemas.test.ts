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


  it("should trim and lowercase email addresses", () => {
    const data = {
      name: "Jane Doe",
      email: "  Jane.Doe@Example.COM  ",
      phone: "+15551234567",
      company: "Acme",
      status: "active" as const,
    };

    const result = customerFormSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("jane.doe@example.com");
    }
  });

  it("should trim whitespace from name and company", () => {
    const data = {
      name: "  Marcus Vance  ",
      email: "marcus@test.com",
      phone: "+15551234567",
      company: "  Vanguard Corp  ",
      status: "lead" as const,
    };

    const result = customerFormSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Marcus Vance");
      expect(result.data.company).toBe("Vanguard Corp");
    }
  });

  it("should reject phone with insufficient digits", () => {
    const data = {
      name: "Test User",
      email: "test@example.com",
      phone: "123",
      company: "Test Corp",
      status: "active" as const,
    };

    const result = customerFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should accept international phone formats", () => {
    const testCases = [
      "+1 (555) 123-4567",
      "+44 20 7946 0958",
      "+91 98765 43210",
      "5551234567",
    ];

    testCases.forEach((phone) => {
      const result = customerFormSchema.safeParse({
        name: "Test User",
        email: "test@example.com",
        phone,
        company: "Test Corp",
        status: "active" as const,
      });
      expect(result.success).toBe(true);
    });
  });
