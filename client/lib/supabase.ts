import { createClient } from "@supabase/supabase-js";

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
    "superadmin@uneora.com": {
      id: "00000000-0000-0000-0000-000000000000",
      email: "superadmin@uneora.com",
      user_metadata: { name: "Uneora Super Admin" },
    },
    "admin@uneora.com": {
      id: "00000000-0000-0000-0000-000000000001",
      email: "admin@uneora.com",
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
      signUp: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log(`Mock signUp attempt for ${email}`);

        // For super admin setup, simulate successful signup
        if (email === "superadmin@uneora.com") {
          const mockSuperAdminUser = {
            id: "00000000-0000-0000-0000-000000000000",
            email: "superadmin@uneora.com",
            user_metadata: { name: "Uneora Super Admin" },
          };

          return {
            data: {
              user: mockSuperAdminUser,
              session: {
                access_token: "mock-token",
                refresh_token: "mock-refresh-token",
                user: mockSuperAdminUser,
              },
            },
            error: null,
          };
        }

        // For other signups, simulate success but require email confirmation
        const newMockUser = {
          id: `mock-${Date.now()}`,
          email,
          user_metadata: { name: "New User" },
        };

        return {
          data: {
            user: newMockUser,
            session: null, // No session until email confirmed
          },
          error: null,
        };
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
