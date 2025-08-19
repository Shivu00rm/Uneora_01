import React, { createContext, useContext, ReactNode } from "react";
import { useSupabaseAuth } from "./SupabaseAuthContext";

export type UserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  organizationId: string | null; // null for SUPER_ADMIN
  organizationName?: string;
  permissions: Record<string, string[]>;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  hasPermission: (module: string, action?: string) => boolean;
  isSuperAdmin: () => boolean;
  isOrgAdmin: () => boolean;
  isOrgUser: () => boolean;
  canManageUsers: () => boolean;
  canAccessOrganizationData: (orgId: string) => boolean;
  canManageStore: (storeId: string) => boolean;
  getDefaultRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bridge provider that uses Supabase auth under the hood
export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseAuth = useSupabaseAuth();

  // Convert Supabase user to legacy user format
  const legacyUser: User | null = supabaseAuth.user
    ? {
        id: parseInt(supabaseAuth.user.id.substring(0, 8), 16), // Convert UUID to number for compatibility
        name: supabaseAuth.user.name,
        email: supabaseAuth.user.email,
        role: supabaseAuth.user.role,
        status: supabaseAuth.user.status as "active" | "inactive",
        organizationId: supabaseAuth.user.organizationId,
        organizationName: supabaseAuth.user.organizationName,
        permissions: convertPermissions(supabaseAuth.user.permissions),
        lastLogin: supabaseAuth.user.lastLogin,
      }
    : null;

  // Convert new permission format to legacy format
  function convertPermissions(
    newPermissions: Record<string, any>,
  ): Record<string, string[]> {
    const legacyPermissions: Record<string, string[]> = {};

    // Convert the new flat permission structure to the old nested one
    for (const [module, actions] of Object.entries(newPermissions)) {
      if (Array.isArray(actions)) {
        legacyPermissions[module] = actions;
      }
    }

    // Add default permissions based on role
    if (supabaseAuth.user?.role === "SUPER_ADMIN") {
      legacyPermissions.system = ["view", "edit", "delete", "manage"];
      legacyPermissions.organizations = [
        "view",
        "create",
        "edit",
        "delete",
        "manage",
      ];
      legacyPermissions.billing = ["view", "edit", "manage"];
      legacyPermissions.api_keys = ["view", "edit", "manage"];
      legacyPermissions.admin_team = ["view", "create", "edit", "delete"];
      legacyPermissions.impersonation = ["use"];
    } else if (supabaseAuth.user?.role === "ORG_ADMIN") {
      legacyPermissions.dashboard = ["view"];
      legacyPermissions.inventory = [
        "view",
        "create",
        "edit",
        "delete",
        "export",
      ];
      legacyPermissions.stock_movements = ["view", "create", "edit"];
      legacyPermissions.pos = ["view", "create", "refund"];
      legacyPermissions.vendors = ["view", "create", "edit", "delete"];
      legacyPermissions.purchase_orders = [
        "view",
        "create",
        "edit",
        "approve",
        "delete",
      ];
      legacyPermissions.analytics = ["view", "export"];
      legacyPermissions.users = ["view", "create", "edit", "delete"];
      legacyPermissions.files = ["view", "upload", "delete"];
      legacyPermissions.settings = ["view", "edit"];
    } else if (supabaseAuth.user?.role === "ORG_USER") {
      legacyPermissions.dashboard = ["view"];
      legacyPermissions.inventory = ["view", "edit"];
      legacyPermissions.stock_movements = ["view", "create"];
      legacyPermissions.pos = ["view", "create"];
      legacyPermissions.vendors = ["view"];
      legacyPermissions.purchase_orders = ["view", "create"];
      legacyPermissions.analytics = ["view"];
      legacyPermissions.files = ["view", "upload"];
    }

    return legacyPermissions;
  }

  const login = async (email: string, password: string) => {
    return supabaseAuth.login(email, password);
  };

  const signUp = async (email: string, password: string, userData: any) => {
    return supabaseAuth.signUp(email, password, userData);
  };

  const logout = async () => {
    return supabaseAuth.logout();
  };

  const hasPermission = (module: string, action?: string): boolean => {
    return supabaseAuth.hasPermission(module, action);
  };

  const isSuperAdmin = (): boolean => {
    return supabaseAuth.isSuperAdmin();
  };

  const isOrgAdmin = (): boolean => {
    return supabaseAuth.isOrgAdmin();
  };

  const isOrgUser = (): boolean => {
    return supabaseAuth.isOrgUser();
  };

  const canManageUsers = (): boolean => {
    return supabaseAuth.canManageUsers();
  };

  const canAccessOrganizationData = (orgId: string): boolean => {
    return supabaseAuth.canAccessOrganizationData(orgId);
  };

  const canManageStore = (storeId: string): boolean => {
    return supabaseAuth.canManageStore(storeId);
  };

  const getDefaultRoute = (): string => {
    return supabaseAuth.getDefaultRoute();
  };

  const value = {
    user: legacyUser,
    login,
    signUp,
    logout,
    loading: supabaseAuth.loading,
    hasPermission,
    isSuperAdmin,
    isOrgAdmin,
    isOrgUser,
    canManageUsers,
    canAccessOrganizationData,
    getDefaultRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Permission checking hook for components with organization context
export function usePermissions() {
  const {
    hasPermission,
    isSuperAdmin,
    isOrgAdmin,
    isOrgUser,
    canManageUsers,
    canAccessOrganizationData,
  } = useAuth();

  return {
    hasPermission,
    isSuperAdmin,
    isOrgAdmin,
    isOrgUser,
    canManageUsers,
    canAccessOrganizationData,
    // Specific permission helpers for tenant operations
    canViewDashboard: () => hasPermission("dashboard", "view"),
    canManageInventory: () => hasPermission("inventory", "edit"),
    canCreateProducts: () => hasPermission("inventory", "create"),
    canDeleteProducts: () => hasPermission("inventory", "delete"),
    canUsePOS: () => hasPermission("pos", "create"),
    canManageVendors: () => hasPermission("vendors", "edit"),
    canApprovePOs: () => hasPermission("purchase_orders", "approve"),
    canViewAnalytics: () => hasPermission("analytics", "view"),
    canExportData: () =>
      hasPermission("analytics", "export") ||
      hasPermission("inventory", "export"),
    canManageFiles: () => hasPermission("files", "upload"),
    canManageOrgSettings: () => hasPermission("settings", "edit"),
    // Super admin specific permissions
    canManageSystem: () => hasPermission("system", "manage"),
    canManageOrganizations: () => hasPermission("organizations", "manage"),
    canManageBilling: () => hasPermission("billing", "manage"),
    canManageAPIKeys: () => hasPermission("api_keys", "manage"),
    canImpersonate: () => hasPermission("impersonation", "use"),
    // Simple permission check
    can: (module: string, action?: string) => hasPermission(module, action),
  };
}

// Mock function that now redirects to real login
export function useMockLogin() {
  return {
    loginAsSuperAdmin: () => {
      window.location.href = "/login";
    },
    loginAsOrgAdmin: () => {
      window.location.href = "/login";
    },
    loginAsOrgUser: () => {
      window.location.href = "/login";
    },
  };
}
