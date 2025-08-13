import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://givoiztfugawvmkvsprb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpdm9penRmdWdhd3Zta3ZzcHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODE0OTMsImV4cCI6MjA3MDY1NzQ5M30.NGbpLpPoJWkFeLEK0cX8EvfMC-ir1blCpaR5I_HMEXs";

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase configuration missing");
  throw new Error("Supabase configuration is incomplete");
}

console.log("Supabase configured:", {
  url: supabaseUrl,
  keyValid: supabaseKey.length > 100
});

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types based on new comprehensive schema
export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  logo_url?: string;
  website?: string;
  phone?: string;
  address?: any;
  billing_email?: string;
  subscription_plan?: "starter" | "professional" | "enterprise";
  subscription_status?: "active" | "suspended" | "cancelled";
  max_users?: number;
  settings?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  organization_id?: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: "super_admin" | "org_admin" | "org_user";
  permissions?: any;
  last_login?: string;
  is_active?: boolean;
  invited_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  organization_id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  brand?: string;
  unit_price: number;
  cost_price?: number;
  stock_quantity: number;
  min_stock_level?: number;
  max_stock_level?: number;
  unit_of_measure?: string;
  barcode?: string;
  images?: any[];
  attributes?: any;
  is_active?: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface SalesOrder {
  id: string;
  organization_id: string;
  order_number: string;
  customer_id?: string;
  customer_name?: string;
  status?:
    | "draft"
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
  order_date?: string;
  due_date?: string;
  subtotal: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  payment_status?: "pending" | "partial" | "paid" | "overdue";
  payment_method?: string;
  platform?: string;
  notes?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Integration {
  id: string;
  organization_id: string;
  platform: string;
  name: string;
  api_url?: string;
  api_key_encrypted?: string;
  api_secret_encrypted?: string;
  webhook_url?: string;
  settings?: any;
  last_sync?: string;
  sync_status?: "active" | "inactive" | "error";
  error_message?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}
