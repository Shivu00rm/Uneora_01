import { supabase } from "./supabase";

// Local type definitions matching usage in this file
export interface Organization {
  id: string;
  name: string;
  slug?: string;
  industry?: string | null;
  subscription_plan?: "starter" | "growth" | "pro" | "enterprise";
  domain?: string | null;
  status?: "active" | "suspended" | "trial" | "overdue";
  billing_email?: string | null;
  custom_domain?: string | null;
  features?: string[] | null;
  settings?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  organization_id: string | null;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER";
  name: string;
  email: string;
  avatar_url?: string | null;
  status?: string;
  permissions?: Record<string, any>;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SalesOrder {
  id: string;
  organization_id: string;
  status: string;
  total_amount: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface Integration {
  id: string;
  organization_id: string;
  service_name?: string;
  service_type?: string;
  config?: Record<string, any>;
  credentials?: Record<string, any>;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Database service layer for Uneora
export class DatabaseService {
  // Organization operations (renamed from Company)
  static async getOrganizations(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Organization[]) || [];
  }

  static async getOrganization(id: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as Organization;
  }

  static async createOrganization(
    org: Omit<Organization, "id" | "created_at" | "updated_at">,
  ): Promise<Organization> {
    console.log("Creating organization:", org);

    // Generate slug from name if not provided
    const slug =
      org.slug ||
      org.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const { data, error } = await supabase
      .from("organizations")
      .insert({ ...org, slug })
      .select()
      .single();

    if (error) {
      console.error("Organization creation error:", error);
      let errorMessage = "Failed to create organization";
      if ((error as any).message) {
        errorMessage = `Failed to create organization: ${(error as any).message}`;
      } else if ((error as any).details) {
        errorMessage = `Failed to create organization: ${(error as any).details}`;
      } else if (typeof error === "string") {
        errorMessage = `Failed to create organization: ${error}`;
      }
      throw new Error(errorMessage);
    }

    console.log("Organization created successfully:", data);
    return data as Organization;
  }

  // Legacy method alias for backward compatibility
  static async getCompany(id: string): Promise<Organization | null> {
    return this.getOrganization(id);
  }

  static async createCompany(company: {
    name: string;
    industry?: string;
  }): Promise<Organization> {
    return this.createOrganization({
      name: company.name,
      industry: company.industry,
      slug: company.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      subscription_plan: "starter",
    });
  }

  // Profile operations (table: user_profiles)
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data as Profile;
  }

  static async createProfile(profile: Profile): Promise<Profile> {
    console.log("Creating profile:", profile);
    const { data, error } = await supabase
      .from("user_profiles")
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error("Profile creation error:", error);
      let errorMessage = "Failed to create profile";
      if ((error as any).message) {
        errorMessage = `Failed to create profile: ${(error as any).message}`;
      } else if ((error as any).details) {
        errorMessage = `Failed to create profile: ${(error as any).details}`;
      } else if (typeof error === "string") {
        errorMessage = `Failed to create profile: ${error}`;
      }
      throw new Error(errorMessage);
    }

    console.log("Profile created successfully:", data);
    return data as Profile;
  }

  static async updateProfile(
    userId: string,
    updates: Partial<Profile>,
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  static async upsertProfile(profile: Profile): Promise<Profile> {
    console.log("Upserting profile:", profile);
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(profile)
      .select()
      .single();

    if (error) {
      console.error("Profile upsert error:", error);
      let errorMessage = "Failed to upsert profile";
      if ((error as any).message) {
        errorMessage = `Failed to upsert profile: ${(error as any).message}`;
      } else if ((error as any).details) {
        errorMessage = `Failed to upsert profile: ${(error as any).details}`;
      } else if (typeof error === "string") {
        errorMessage = `Failed to upsert profile: ${error}`;
      }
      throw new Error(errorMessage);
    }

    console.log("Profile upserted successfully:", data);
    return data as Profile;
  }

  static async getOrganizationProfiles(
    organizationId: string,
  ): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Profile[]) || [];
  }

  // Legacy method alias
  static async getCompanyProfiles(companyId: string): Promise<Profile[]> {
    return this.getOrganizationProfiles(companyId);
  }

  // Sales orders operations
  static async getSalesOrders(organizationId: string): Promise<SalesOrder[]> {
    const { data, error } = await supabase
      .from("sales_orders")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as SalesOrder[]) || [];
  }

  static async createSalesOrder(
    order: Omit<SalesOrder, "id" | "created_at" | "updated_at">,
  ): Promise<SalesOrder> {
    const { data, error } = await supabase
      .from("sales_orders")
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data as SalesOrder;
  }

  static async updateSalesOrder(
    id: string,
    updates: Partial<SalesOrder>,
  ): Promise<SalesOrder> {
    const { data, error } = await supabase
      .from("sales_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as SalesOrder;
  }

  // Integration operations
  static async getIntegrations(organizationId: string): Promise<Integration[]> {
    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Integration[]) || [];
  }

  static async createIntegration(
    integration: Omit<Integration, "id" | "created_at" | "updated_at">,
  ): Promise<Integration> {
    const { data, error } = await supabase
      .from("integrations")
      .insert(integration)
      .select()
      .single();

    if (error) throw error;
    return data as Integration;
  }

  static async deleteIntegration(id: string): Promise<void> {
    const { error } = await supabase.from("integrations").delete().eq("id", id);

    if (error) throw error;
  }

  // Analytics operations
  static async getDashboardStats(organizationId: string) {
    const [orders, integrations] = await Promise.all([
      this.getSalesOrders(organizationId),
      this.getIntegrations(organizationId),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (Number(order.total_amount) || 0),
      0,
    );
    const pendingOrders = orders.filter(
      (order) => order.status === "pending",
    ).length;
    const deliveredOrders = orders.filter(
      (order) => order.status === "delivered",
    ).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      deliveredOrders,
      connectedPlatforms: integrations.length,
      recentOrders: orders.slice(0, 5),
    };
  }

  // Real-time subscriptions
  static subscribeToSalesOrders(
    organizationId: string,
    callback: (payload: any) => void,
  ) {
    return supabase
      .channel("sales_orders_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales_orders",
          filter: `organization_id=eq.${organizationId}`,
        },
        callback,
      )
      .subscribe();
  }

  static subscribeToIntegrations(
    organizationId: string,
    callback: (payload: any) => void,
  ) {
    return supabase
      .channel("integrations_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "integrations",
          filter: `organization_id=eq.${organizationId}`,
        },
        callback,
      )
      .subscribe();
  }
}
