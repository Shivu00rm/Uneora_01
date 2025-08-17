<<<<<<< HEAD
import React, { createContext, useContext, ReactNode } from "react";
import { useSupabaseAuth } from "./SupabaseAuthContext";
=======
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { DatabaseService } from "../lib/database";
>>>>>>> refs/remotes/origin/main

export type UserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER";

interface User {
  id: string;
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
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    companyNameOrId?: string,
  ) => Promise<void>;
  hasPermission: (module: string, action?: string) => boolean;
  isSuperAdmin: () => boolean;
  isOrgAdmin: () => boolean;
  isOrgUser: () => boolean;
  canManageUsers: () => boolean;
  canAccessOrganizationData: (orgId: string) => boolean;
  getDefaultRoute: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

<<<<<<< HEAD
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

  const login = async (userData: User) => {
    // This is now handled by Supabase auth
    console.warn("Legacy login called - use Supabase auth instead");
  };

  const logout = async () => {
    return supabaseAuth.logout();
  };

  const hasPermission = (module: string, action?: string): boolean => {
    return supabaseAuth.hasPermission(module, action);
=======
// Role-based permissions mapping
const getRolePermissions = (role: UserRole) => {
  switch (role) {
    case "SUPER_ADMIN":
      return {
        system: ["view", "edit", "delete", "manage"],
        organizations: ["view", "create", "edit", "delete", "manage"],
        billing: ["view", "edit", "manage"],
        api_keys: ["view", "edit", "manage"],
        admin_team: ["view", "create", "edit", "delete"],
        impersonation: ["use"],
      };
    case "ORG_ADMIN":
      return {
        dashboard: ["view"],
        inventory: ["view", "create", "edit", "delete", "export"],
        stock_movements: ["view", "create", "edit"],
        pos: ["view", "create", "refund"],
        vendors: ["view", "create", "edit", "delete"],
        purchase_orders: ["view", "create", "edit", "approve", "delete"],
        analytics: ["view", "export"],
        users: ["view", "create", "edit", "delete"],
        files: ["view", "upload", "delete"],
        settings: ["view", "edit"],
      };
    case "ORG_USER":
      return {
        dashboard: ["view"],
        inventory: ["view", "edit"],
        stock_movements: ["view", "create"],
        pos: ["view", "create"],
        vendors: ["view"],
        purchase_orders: ["view", "create"],
        analytics: ["view"],
        files: ["view", "upload"],
      };
    default:
      return {};
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);

      // Test Supabase connection first
      try {
        const { data: testData, error: testError } = await supabase.from('profiles').select('count').limit(1);
        console.log('Supabase connection test:', { success: !testError, error: testError?.message });
      } catch (connectionError) {
        console.error('Supabase connection failed:', connectionError);
        throw new Error('Database connection failed. Please try again.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Supabase auth error:", error);
        throw new Error(error.message || "Login failed");
      }

      if (data.user) {
        console.log('Login successful, loading profile...');
        await loadUserProfile(data.user.id);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    companyNameOrId?: string,
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("Supabase signup error:", error);
        throw new Error(error.message || "Signup failed");
      }

      if (data.user) {
        console.log("User created successfully:", data.user.id);

        try {
          let companyId: string | null = null;

          // Create organization if needed (for org admins with company name)
          if (
            role === "ORG_ADMIN" &&
            companyNameOrId &&
            !companyNameOrId.includes("-")
          ) {
            console.log(
              "Creating organization for org admin:",
              companyNameOrId,
            );
            try {
              const slug = companyNameOrId
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
              const organization = await DatabaseService.createOrganization({
                name: companyNameOrId,
                industry: "Technology",
                slug: slug,
                subscription_plan: "starter",
              });
              companyId = organization.id;
              console.log(
                "Organization created successfully with ID:",
                companyId,
              );
            } catch (orgError: any) {
              console.error("Organization creation failed:", orgError);

              let errorMessage = "Failed to create organization";
              if (orgError.message) {
                errorMessage = orgError.message;
              } else if (typeof orgError === "string") {
                errorMessage = orgError;
              }

              throw new Error(errorMessage);
            }
          } else if (companyNameOrId && companyNameOrId.includes("-")) {
            // Assume it's an organization ID if it contains dashes (UUID format)
            companyId = companyNameOrId;
            console.log("Using existing organization ID:", companyId);
          }

          // Create profile with email
          const profileData = {
            id: data.user.id,
            name,
            email: data.user.email || email,
            role,
            organization_id: companyId,
          };

          console.log("Creating profile with data:", profileData);
          try {
            await DatabaseService.createProfile(profileData);
            console.log("Profile created successfully");
          } catch (profileError: any) {
            console.error("Profile creation failed:", profileError);
            throw new Error(
              `Failed to create profile: ${profileError.message}`,
            );
          }

          // Load the profile to set user state
          console.log("Loading user profile...");
          await loadUserProfile(data.user.id);
          console.log("Signup process completed successfully");
        } catch (setupError: any) {
          console.error("Setup error during signup:", setupError);

          // Extract meaningful error message
          let errorMessage = "Account created but setup failed.";
          if (setupError.message) {
            if (setupError.message.includes("duplicate key")) {
              errorMessage = "Profile already exists. Try signing in instead.";
            } else if (setupError.message.includes("row-level security")) {
              errorMessage =
                "Permission error during setup. Please contact support.";
            } else if (setupError.message.includes("violates")) {
              errorMessage =
                "Database constraint violation. Please contact support.";
            } else {
              errorMessage = setupError.message;
            }
          }

          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await DatabaseService.getProfile(userId);
      if (profile) {
        let organizationName = undefined;
        if (profile.organization_id) {
          try {
            const organization = await DatabaseService.getOrganization(
              profile.organization_id,
            );
            organizationName = organization?.name;
          } catch (orgError) {
            console.warn("Failed to load organization data:", orgError);
          }
        }

        // Get email from profile or auth
        let userEmail = profile.email;
        if (!userEmail) {
          try {
            const {
              data: { user },
            } = await supabase.auth.getUser();
            userEmail = user?.email || "";
          } catch (emailError) {
            console.warn("Failed to get user email from auth");
            userEmail = "";
          }
        }

        const userData: User = {
          id: profile.id,
          name: profile.name || "Unknown User",
          email: userEmail || "",
          role: (profile.role as UserRole) || "ORG_USER",
          status: "active",
          organizationId: profile.organization_id || null,
          organizationName,
          permissions: getRolePermissions(
            (profile.role as UserRole) || "ORG_USER",
          ),
        };

        setUser(userData);
      } else {
        console.warn("No profile found for user:", userId);
        // Get email from auth for new profile
        let userEmail = "";
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          userEmail = user?.email || "";
        } catch (emailError) {
          console.warn("Failed to get user email from auth");
        }

        // Create a basic profile if none exists
        try {
          await DatabaseService.upsertProfile({
            id: userId,
            name: "New User",
            email: userEmail,
            role: "ORG_USER",
          });
          // Retry loading
          await loadUserProfile(userId);
        } catch (createError: any) {
          console.error("Failed to create basic profile:", createError);

          // Better error handling
          let errorMessage = "Failed to create basic profile";
          if (createError.message) {
            errorMessage = createError.message;
          } else if (typeof createError === "string") {
            errorMessage = createError;
          }

          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      throw new Error("Failed to load user profile. Please try again.");
    }
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
>>>>>>> refs/remotes/origin/main
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
<<<<<<< HEAD
    return supabaseAuth.canAccessOrganizationData(orgId);
  };

  const getDefaultRoute = (): string => {
    return supabaseAuth.getDefaultRoute();
  };

  const value = {
    user: legacyUser,
=======
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
    // Get initial session from Supabase
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          loadUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Supabase session error:", error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
>>>>>>> refs/remotes/origin/main
    login,
    logout,
    signUp,
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
<<<<<<< HEAD
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
=======
>>>>>>> refs/remotes/origin/main
  };
}
