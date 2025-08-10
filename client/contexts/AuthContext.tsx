import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (module: string, action?: string) => boolean;
  isSuperAdmin: () => boolean;
  isOrgAdmin: () => boolean;
  isOrgUser: () => boolean;
  canManageUsers: () => boolean;
  canAccessOrganizationData: (orgId: string) => boolean;
  getDefaultRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for different roles and organizations
const mockUsers = {
  superAdmin: {
    id: 1,
    name: "System Owner",
    email: "owner@flowstock.com",
    role: "SUPER_ADMIN" as UserRole,
    status: "active" as const,
    organizationId: null,
    permissions: {
      // Super admin has all permissions across all modules
      system: ["view", "edit", "delete", "manage"],
      organizations: ["view", "create", "edit", "delete", "manage"],
      billing: ["view", "edit", "manage"],
      api_keys: ["view", "edit", "manage"],
      admin_team: ["view", "create", "edit", "delete"],
      impersonation: ["use"]
    }
  },
  orgAdmin: {
    id: 2,
    name: "Rajesh Sharma",
    email: "rajesh@techcorp.com",
    role: "ORG_ADMIN" as UserRole,
    status: "active" as const,
    organizationId: "org-1",
    organizationName: "TechCorp Solutions",
    permissions: {
      dashboard: ["view"],
      inventory: ["view", "create", "edit", "delete", "export"],
      stock_movements: ["view", "create", "edit"],
      pos: ["view", "create", "refund"],
      vendors: ["view", "create", "edit", "delete"],
      purchase_orders: ["view", "create", "edit", "approve", "delete"],
      analytics: ["view", "export"],
      users: ["view", "create", "edit", "delete"], // Can manage users in their org
      files: ["view", "upload", "delete"],
      settings: ["view", "edit"] // Org settings only
    }
  },
  orgUser: {
    id: 3,
    name: "Priya Patel",
    email: "priya@techcorp.com",
    role: "ORG_USER" as UserRole,
    status: "active" as const,
    organizationId: "org-1", 
    organizationName: "TechCorp Solutions",
    permissions: {
      dashboard: ["view"],
      inventory: ["view", "edit"],
      stock_movements: ["view", "create"],
      pos: ["view", "create"],
      vendors: ["view"],
      purchase_orders: ["view", "create"],
      analytics: ["view"],
      files: ["view", "upload"]
      // No user management or settings access
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // For demo, start with super admin. In real app, this would be null initially
  const [user, setUser] = useState<User | null>(mockUsers.superAdmin);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("flowstock_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("flowstock_user");
  };

  const hasPermission = (module: string, action?: string): boolean => {
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.role === "SUPER_ADMIN") return true;
    
    const modulePermissions = user.permissions[module] || [];
    
    // If no specific action is required, check if user has any permission for the module
    if (!action) return modulePermissions.length > 0;
    
    // Check for specific action permission
    return modulePermissions.includes(action);
  };

  const isSuperAdmin = (): boolean => {
    return user?.role === "SUPER_ADMIN" || false;
  };

  const isOrgAdmin = (): boolean => {
    return user?.role === "ORG_ADMIN" || false;
  };

  const isOrgUser = (): boolean => {
    return user?.role === "ORG_USER" || false;
  };

  const canManageUsers = (): boolean => {
    return isSuperAdmin() || (isOrgAdmin() && hasPermission("users", "create"));
  };

  const canAccessOrganizationData = (orgId: string): boolean => {
    if (!user) return false;
    
    // Super admin can access all organization data
    if (user.role === "SUPER_ADMIN") return true;
    
    // Organization users can only access their own organization's data
    return user.organizationId === orgId;
  };

  const getDefaultRoute = (): string => {
    if (!user) return "/login";
    
    switch (user.role) {
      case "SUPER_ADMIN":
        return "/super-admin";
      case "ORG_ADMIN":
      case "ORG_USER":
        return "/app/dashboard";
      default:
        return "/login";
    }
  };

  useEffect(() => {
    // In real app, this would validate the stored token and fetch user data
    const storedUser = localStorage.getItem("flowstock_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse stored user data");
        logout();
      }
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    hasPermission,
    isSuperAdmin,
    isOrgAdmin,
    isOrgUser,
    canManageUsers,
    canAccessOrganizationData,
    getDefaultRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
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
  const { hasPermission, isSuperAdmin, isOrgAdmin, isOrgUser, canManageUsers, canAccessOrganizationData } = useAuth();
  
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
    canExportData: () => hasPermission("analytics", "export") || hasPermission("inventory", "export"),
    canManageFiles: () => hasPermission("files", "upload"),
    canManageOrgSettings: () => hasPermission("settings", "edit"),
    // Super admin specific permissions
    canManageSystem: () => hasPermission("system", "manage"),
    canManageOrganizations: () => hasPermission("organizations", "manage"),
    canManageBilling: () => hasPermission("billing", "manage"),
    canManageAPIKeys: () => hasPermission("api_keys", "manage"),
    canImpersonate: () => hasPermission("impersonation", "use")
  };
}

// Mock function to switch between different user types for testing
export function useMockLogin() {
  const { login } = useAuth();
  
  return {
    loginAsSuperAdmin: () => login(mockUsers.superAdmin),
    loginAsOrgAdmin: () => login(mockUsers.orgAdmin),
    loginAsOrgUser: () => login(mockUsers.orgUser)
  };
}
