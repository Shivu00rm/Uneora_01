import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://givoiztfugawvmkvsprb.supabase.co'
// Note: In production, get this from your Supabase project settings > API
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpdm9penRmdWdhd3Zta3ZzcHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODQzNzMsImV4cCI6MjA3MDY2MDM3M30.iReKXgOidYGUqPJwmD-4jvPZDRJJTjNyOy5rkKb8G8s'

console.log('Supabase config:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey,
  keyLength: supabaseKey?.length
})

if (!supabaseKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

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
