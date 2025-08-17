import { createClient } from "@supabase/supabase-js";

<<<<<<< HEAD
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have real Supabase credentials
const hasValidSupabaseConfig =
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== "https://your-project-id.supabase.co" &&
  supabaseKey !== "your-anon-key-here" &&
  supabaseUrl.includes(".supabase.co");

let supabase: any = null;

if (hasValidSupabaseConfig) {
  // Use real Supabase client
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // Create mock Supabase client for development
  console.warn(
    "🔄 Using mock Supabase client - set real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for production",
  );

  // Mock user data for development
  const mockUsers = {
    "admin@flowstock.com": {
      id: "00000000-0000-0000-0000-000000000001",
      email: "admin@flowstock.com",
      user_metadata: { name: "System Owner" },
    },
    "admin@techcorp.com": {
      id: "00000000-0000-0000-0000-000000000002",
      email: "admin@techcorp.com",
      user_metadata: { name: "Rajesh Sharma" },
    },
    "user@techcorp.com": {
      id: "00000000-0000-0000-0000-000000000003",
      email: "user@techcorp.com",
      user_metadata: { name: "Priya Patel" },
    },
  };

  // Mock Supabase client
  supabase = {
    auth: {
      signInWithPassword: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser = mockUsers[email as keyof typeof mockUsers];
        if (mockUser && (password === "admin123" || password === "user123")) {
          return {
            data: {
              user: mockUser,
              session: {
                access_token: "mock-token",
                refresh_token: "mock-refresh-token",
                user: mockUser,
              },
            },
            error: null,
          };
        } else {
          return {
            data: { user: null, session: null },
            error: { message: "Invalid email or password" },
          };
        }
      },
      signOut: async () => {
        return { error: null };
      },
      getSession: async () => {
        // Check localStorage for persisted session
        const storedSession = localStorage.getItem("mock-supabase-session");
        if (storedSession) {
          try {
            const session = JSON.parse(storedSession);
            return { data: { session }, error: null };
          } catch {
            localStorage.removeItem("mock-supabase-session");
          }
        }
        return { data: { session: null }, error: null };
      },
      onAuthStateChange: (callback: Function) => {
        // Mock auth state listener
        const mockListener = {
          unsubscribe: () => {},
        };

        // Trigger initial state
        setTimeout(() => {
          const storedSession = localStorage.getItem("mock-supabase-session");
          if (storedSession) {
            try {
              const session = JSON.parse(storedSession);
              callback("SIGNED_IN", session);
            } catch {
              callback("SIGNED_OUT", null);
            }
          } else {
            callback("SIGNED_OUT", null);
          }
        }, 100);

        return { data: { subscription: mockListener } };
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: null,
            error: {
              message: "Mock database - configure Supabase for real data",
            },
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: null,
            error: {
              message: "Mock database - configure Supabase for real data",
            },
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({
              data: null,
              error: {
                message: "Mock database - configure Supabase for real data",
              },
            }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => ({ error: null }),
      }),
    }),
  };
}

export { supabase, hasValidSupabaseConfig };

// Database types for type safety
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          domain: string | null;
          status: "active" | "suspended" | "trial" | "overdue";
          subscription_plan: "starter" | "growth" | "pro" | "enterprise";
          billing_email: string | null;
          custom_domain: string | null;
          features: string[] | null;
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain?: string | null;
          status?: "active" | "suspended" | "trial" | "overdue";
          subscription_plan?: "starter" | "growth" | "pro" | "enterprise";
          billing_email?: string | null;
          custom_domain?: string | null;
          features?: string[] | null;
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string | null;
          status?: "active" | "suspended" | "trial" | "overdue";
          subscription_plan?: "starter" | "growth" | "pro" | "enterprise";
          billing_email?: string | null;
          custom_domain?: string | null;
          features?: string[] | null;
          settings?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          organization_id: string | null;
          role: "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER";
          name: string;
          email: string;
          avatar_url: string | null;
          status: string;
          permissions: Record<string, any>;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          organization_id?: string | null;
          role?: "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER";
          name: string;
          email: string;
          avatar_url?: string | null;
          status?: string;
          permissions?: Record<string, any>;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          role?: "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER";
          name?: string;
          email?: string;
          avatar_url?: string | null;
          status?: string;
          permissions?: Record<string, any>;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      api_integrations: {
        Row: {
          id: string;
          organization_id: string;
          service_name: string;
          service_type: string;
          credentials: Record<string, any>;
          config: Record<string, any>;
          status: string;
          last_sync: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          service_name: string;
          service_type: string;
          credentials: Record<string, any>;
          config?: Record<string, any>;
          status?: string;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          service_name?: string;
          service_type?: string;
          credentials?: Record<string, any>;
          config?: Record<string, any>;
          status?: string;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          organization_id: string | null;
          user_id: string | null;
          action: string;
          module: string;
          details: Record<string, any> | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id?: string | null;
          user_id?: string | null;
          action: string;
          module: string;
          details?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          user_id?: string | null;
          action?: string;
          module?: string;
          details?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      system_alerts: {
        Row: {
          id: string;
          alert_type: string;
          severity: string;
          title: string;
          message: string;
          affected_organizations: string[] | null;
          metadata: Record<string, any>;
          resolved: boolean;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          alert_type: string;
          severity?: string;
          title: string;
          message: string;
          affected_organizations?: string[] | null;
          metadata?: Record<string, any>;
          resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          alert_type?: string;
          severity?: string;
          title?: string;
          message?: string;
          affected_organizations?: string[] | null;
          metadata?: Record<string, any>;
          resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
=======
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
>>>>>>> refs/remotes/origin/main
