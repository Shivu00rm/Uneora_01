import { supabase, Company, Profile, SalesOrder, Integration } from './supabase'

// Database service layer for FlowStock
export class DatabaseService {
  // Company operations
  static async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getCompany(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  }

  static async createCompany(company: Omit<Company, 'id' | 'created_at'>): Promise<Company> {
    console.log('Creating company:', company);
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select()
      .single()

    if (error) {
      console.error('Company creation error:', error);
      throw new Error(`Failed to create company: ${error.message}`);
    }

    console.log('Company created successfully:', data);
    return data
  }

  // Profile operations
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) return null
    return data
  }

  static async createProfile(profile: Profile): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async upsertProfile(profile: Profile): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getCompanyProfiles(companyId: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Sales orders operations
  static async getSalesOrders(companyId: string): Promise<SalesOrder[]> {
    const { data, error } = await supabase
      .from('sales_orders')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async createSalesOrder(order: Omit<SalesOrder, 'id' | 'created_at'>): Promise<SalesOrder> {
    const { data, error } = await supabase
      .from('sales_orders')
      .insert(order)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateSalesOrder(id: string, updates: Partial<SalesOrder>): Promise<SalesOrder> {
    const { data, error } = await supabase
      .from('sales_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Integration operations
  static async getIntegrations(companyId: string): Promise<Integration[]> {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('company_id', companyId)
      .order('connected_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async createIntegration(integration: Omit<Integration, 'id' | 'connected_at'>): Promise<Integration> {
    const { data, error } = await supabase
      .from('integrations')
      .insert(integration)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteIntegration(id: string): Promise<void> {
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Analytics operations
  static async getDashboardStats(companyId: string) {
    const [orders, integrations] = await Promise.all([
      this.getSalesOrders(companyId),
      this.getIntegrations(companyId)
    ])

    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0)
    const pendingOrders = orders.filter(order => order.status === 'pending').length
    const completedOrders = orders.filter(order => order.status === 'completed').length

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      connectedPlatforms: integrations.length,
      recentOrders: orders.slice(0, 5)
    }
  }

  // Real-time subscriptions
  static subscribeToSalesOrders(companyId: string, callback: (payload: any) => void) {
    return supabase
      .channel('sales_orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales_orders',
          filter: `company_id=eq.${companyId}`
        },
        callback
      )
      .subscribe()
  }

  static subscribeToIntegrations(companyId: string, callback: (payload: any) => void) {
    return supabase
      .channel('integrations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'integrations',
          filter: `company_id=eq.${companyId}`
        },
        callback
      )
      .subscribe()
  }
}
