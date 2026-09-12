export type CustomerStatus = "active" | "inactive" | "lead";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  created_at: string;
  updated_at: string;
}

export interface CustomerMetrics {
  total_customers: number;
  active_count: number;
  lead_count: number;
  inactive_count: number;
}

export interface PaginatedCustomersResponse {
  items: Customer[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  metrics?: CustomerMetrics;
}

export interface CustomerQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
}
