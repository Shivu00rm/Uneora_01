import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase, Tables } from "@/lib/supabase";

export type UserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  organizationId: string | null;
  organizationName?: string;
  permissions: Record<string, any>;
  lastLogin?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  hasPermission: (module: string, action?: string) => boolean;
  isSuperAdmin: () => boolean;
  isOrgAdmin: () => boolean;
  isOrgUser: () => boolean;
  canManageUsers: () => boolean;
  canAccessOrganizationData: (orgId: string) => boolean;
  getDefaultRoute: () => string;
  refreshUser: () => Promise<void>;
}

const SupabaseAuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from database (with mock fallback)
  const fetchUserProfile = async (
    supabaseUser: SupabaseUser,
  ): Promise<User | null> => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select(
          `
          *,
          organization:organizations(
            id,
            name,
            status
          )
        `,
        )
        .eq("id", supabaseUser.id)
        .single();

      // If we get an error (likely from mock), create a mock profile based on the user
      if (profileError) {
        console.log("Using mock user profile for development");
        return createMockUserProfile(supabaseUser);
      }

      if (!profile) {
        console.log("No user profile found, creating mock profile");
        return createMockUserProfile(supabaseUser);
      }

      // Update last login (will fail silently in mock mode)
      await supabase
        .from("user_profiles")
        .update({ last_login: new Date().toISOString() })
        .eq("id", supabaseUser.id);

      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        status: profile.status,
        organizationId: profile.organization_id,
        organizationName: profile.organization?.name,
        permissions: profile.permissions || {},
        lastLogin: profile.last_login,
        avatarUrl: profile.avatar_url,
      };
    } catch (error) {
      console.log("Error fetching profile, using mock data:", error);
      return createMockUserProfile(supabaseUser);
    }
  };

  // Create mock user profile for development
  const createMockUserProfile = (supabaseUser: SupabaseUser): User => {
    const email = supabaseUser.email;
    let role: UserRole = "ORG_USER";
    let organizationId: string | null = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    let organizationName = "TechCorp Solutions";

    // Determine role based on email
    if (email === "admin@uneora.com") {
      role = "SUPER_ADMIN";
      organizationId = null;
      organizationName = undefined;
    } else if (email === "admin@techcorp.com") {
      role = "ORG_ADMIN";
    }

    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || email.split("@")[0],
      email: email,
      role: role,
      status: "active",
      organizationId,
      organizationName,
      permissions: createMockPermissions(role),
      lastLogin: new Date().toISOString(),
      avatarUrl: null,
    };
  };

  // Create mock permissions based on role
  const createMockPermissions = (role: UserRole): Record<string, any> => {
    switch (role) {
      case "SUPER_ADMIN":
        return {
          system: ["view", "edit", "delete", "manage"],
          organizations: ["view", "create", "edit", "delete", "manage"],
          billing: ["view", "edit", "manage"],
          api_keys: ["view", "edit", "manage"],
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

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get initial session
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          return;
        }

        setSession(initialSession);

        if (initialSession?.user) {
          const userProfile = await fetchUserProfile(initialSession.user);
          setUser(userProfile);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError("Failed to initialize authentication");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.email);

      setSession(session);
      setError(null);

      if (event === "SIGNED_IN" && session?.user) {
        setLoading(true);
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);
        setLoading(false);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        // Optionally refresh user profile on token refresh
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      if (data.user && data.session) {
        // Persist session for mock mode
        localStorage.setItem(
          "mock-supabase-session",
          JSON.stringify(data.session),
        );

        const userProfile = await fetchUserProfile(data.user);
        if (!userProfile) {
          throw new Error(
            "Unable to load user profile. Please contact support.",
          );
        }
        setUser(userProfile);
        setSession(data.session);
      }
    } catch (error: any) {
      console.error("Login error:", error?.message || error?.error || error);
      const errorMessage =
        error?.message ||
        error?.error_description ||
        error?.error ||
        "Login failed";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clear mock session
      localStorage.removeItem("mock-supabase-session");

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError && !signOutError.message.includes("Mock")) {
        throw signOutError;
      }

      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error("Logout error:", error?.message || error?.error || error);
      const errorMessage =
        error?.message ||
        error?.error_description ||
        error?.error ||
        "Logout failed";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert({
            id: data.user.id,
            name: userData.name,
            email: userData.email,
            role: userData.role || "ORG_USER",
            organization_id: userData.organizationId,
            permissions: userData.permissions || {},
          });

        if (profileError) {
          throw profileError;
        }
      }
    } catch (error: any) {
      console.error("Sign up error:", error?.message || error?.error || error);
      const errorMessage =
        error?.message ||
        error?.error_description ||
        error?.error ||
        "Sign up failed";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      setLoading(true);
      const userProfile = await fetchUserProfile(session.user);
      setUser(userProfile);
      setLoading(false);
    }
  };

  const hasPermission = (module: string, action?: string): boolean => {
    if (!user) return false;

    // Super admin has all permissions
    if (user.role === "SUPER_ADMIN") return true;

    const permissions = user.permissions || {};
    const modulePermissions = permissions[module] || [];

    // If no specific action is required, check if user has any permission for the module
    if (!action)
      return Array.isArray(modulePermissions) && modulePermissions.length > 0;

    // Check for specific action permission
    return (
      Array.isArray(modulePermissions) && modulePermissions.includes(action)
    );
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

  const value = {
    user,
    session,
    loading,
    error,
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
    refreshUser,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error(
      "useSupabaseAuth must be used within a SupabaseAuthProvider",
    );
  }
  return context;
}
