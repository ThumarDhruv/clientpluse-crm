export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const TOKEN_STORAGE_KEY = "clientpulse_auth_token";
export const USER_STORAGE_KEY = "clientpulse_user_data";

export const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "lead", label: "Lead" },
  { value: "inactive", label: "Inactive" },
] as const;

export const SORT_OPTIONS = [
  { value: "created_at:desc", label: "Newest First" },
  { value: "created_at:asc", label: "Oldest First" },
  { value: "name:asc", label: "Name (A-Z)" },
  { value: "name:desc", label: "Name (Z-A)" },
  { value: "company:asc", label: "Company (A-Z)" },
] as const;
