import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "owner" | "manager" | "cashier" | "staff";
  status: "active" | "inactive";
  permissions: Record<string, string[]>;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (module: string, action?: string) => boolean;
  isOwner: () => boolean;
  canManageUsers: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock current user - in real app this would come from authentication
const mockCurrentUser: User = {
  id: 1,
  name: "Rajesh Sharma",
  email: "rajesh@flowstock.in",
  role: "owner",
  status: "active",
  permissions: {
    dashboard: ["view"],
    inventory: ["view", "create", "edit", "delete", "export"],
    stock_movements: ["view", "create", "edit"],
    pos: ["view", "create", "refund"],
    vendors: ["view", "create", "edit", "delete"],
    purchase_orders: ["view", "create", "edit", "approve", "delete"],
    analytics: ["view", "export"],
    users: ["view", "create", "edit", "delete", "permissions"],
    files: ["view", "upload", "delete"],
    settings: ["view", "edit"]
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockCurrentUser);

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
    
    // Owner has all permissions
    if (user.role === "owner") return true;
    
    const modulePermissions = user.permissions[module] || [];
    
    // If no specific action is required, check if user has any permission for the module
    if (!action) return modulePermissions.length > 0;
    
    // Check for specific action permission
    return modulePermissions.includes(action);
  };

  const isOwner = (): boolean => {
    return user?.role === "owner" || false;
  };

  const canManageUsers = (): boolean => {
    return hasPermission("users", "permissions") || isOwner();
  };

  useEffect(() => {
    // In real app, this would validate the stored token and fetch user data
    const storedUser = localStorage.getItem("flowstock_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
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
    isOwner,
    canManageUsers
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

// Permission checking hook for components
export function usePermissions() {
  const { hasPermission, isOwner, canManageUsers } = useAuth();
  
  return {
    hasPermission,
    isOwner,
    canManageUsers,
    // Specific permission helpers
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
    canManageSettings: () => hasPermission("settings", "edit")
  };
}
