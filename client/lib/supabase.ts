import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for type safety
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          domain: string | null
          status: 'active' | 'suspended' | 'trial' | 'overdue'
          subscription_plan: 'starter' | 'growth' | 'pro' | 'enterprise'
          billing_email: string | null
          custom_domain: string | null
          features: string[] | null
          settings: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          status?: 'active' | 'suspended' | 'trial' | 'overdue'
          subscription_plan?: 'starter' | 'growth' | 'pro' | 'enterprise'
          billing_email?: string | null
          custom_domain?: string | null
          features?: string[] | null
          settings?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          status?: 'active' | 'suspended' | 'trial' | 'overdue'
          subscription_plan?: 'starter' | 'growth' | 'pro' | 'enterprise'
          billing_email?: string | null
          custom_domain?: string | null
          features?: string[] | null
          settings?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          organization_id: string | null
          role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'ORG_USER'
          name: string
          email: string
          avatar_url: string | null
          status: string
          permissions: Record<string, any>
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          role?: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'ORG_USER'
          name: string
          email: string
          avatar_url?: string | null
          status?: string
          permissions?: Record<string, any>
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          role?: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'ORG_USER'
          name?: string
          email?: string
          avatar_url?: string | null
          status?: string
          permissions?: Record<string, any>
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      api_integrations: {
        Row: {
          id: string
          organization_id: string
          service_name: string
          service_type: string
          credentials: Record<string, any>
          config: Record<string, any>
          status: string
          last_sync: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          service_name: string
          service_type: string
          credentials: Record<string, any>
          config?: Record<string, any>
          status?: string
          last_sync?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          service_name?: string
          service_type?: string
          credentials?: Record<string, any>
          config?: Record<string, any>
          status?: string
          last_sync?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          action: string
          module: string
          details: Record<string, any> | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          action: string
          module: string
          details?: Record<string, any> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          action?: string
          module?: string
          details?: Record<string, any> | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      system_alerts: {
        Row: {
          id: string
          alert_type: string
          severity: string
          title: string
          message: string
          affected_organizations: string[] | null
          metadata: Record<string, any>
          resolved: boolean
          resolved_by: string | null
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          alert_type: string
          severity?: string
          title: string
          message: string
          affected_organizations?: string[] | null
          metadata?: Record<string, any>
          resolved?: boolean
          resolved_by?: string | null
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          alert_type?: string
          severity?: string
          title?: string
          message?: string
          affected_organizations?: string[] | null
          metadata?: Record<string, any>
          resolved?: boolean
          resolved_by?: string | null
          resolved_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
