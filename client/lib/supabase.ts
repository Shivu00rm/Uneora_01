import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://givoiztfugawvmkvsprb.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types based on your schema
export interface Company {
  id: string
  name: string
  industry?: string
  created_at?: string
}

export interface Profile {
  id: string
  name?: string
  role?: string
  company_id?: string
  created_at?: string
}

export interface SalesOrder {
  id: string
  company_id?: string
  customer_name?: string
  platform?: string
  total_amount?: number
  status?: string
  created_at?: string
}

export interface Integration {
  id: string
  company_id?: string
  type?: string
  api_key?: string
  connected_at?: string
}
