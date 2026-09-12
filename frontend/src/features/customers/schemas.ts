import { z } from "zod";

export const customerFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must not exceed 150 characters")
    .transform((v) => v.trim()),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z
        .string()
        .email("Please enter a valid email address (e.g. name@company.com)")
        .max(255, "Email must not exceed 255 characters")
    ),
  phone: z
    .string()
    .min(5, "Phone number must be at least 5 characters")
    .max(30, "Phone number must not exceed 30 characters")
    .refine(
      (v) => {
        const digits = v.replace(/\D/g, "");
        return digits.length >= 5 && digits.length <= 20;
      },
      { message: "Please provide a valid phone format with 5 to 20 digits" }
    )
    .transform((v) => v.trim()),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name must not exceed 150 characters")
    .transform((v) => v.trim()),
  status: z.enum(["active", "inactive", "lead"], {
    errorMap: () => ({ message: "Status must be active, inactive, or lead" }),
  }),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
