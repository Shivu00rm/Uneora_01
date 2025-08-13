import { useAuth } from "@/contexts/AuthContext";
import { 
  Permission, 
  hasPermission, 
  hasAnyPermission,
  hasAllPermissions,
  canAccessOrganization,
  shouldShowComponent,
  getDataScope,
  requiresSecondaryAuth,
  Role
} from "@/lib/permissions";

export const usePermissions = () => {
  const { user } = useAuth();
  
  const userRole = user?.role as Role;
  const userOrgId = user?.organizationId || "";
  
  return {
    // Basic permission checks
    can: (permission: Permission) => {
      if (!userRole) return false;
      return hasPermission(userRole, permission);
    },
    
    canAny: (permissions: Permission[]) => {
      if (!userRole) return false;
      return hasAnyPermission(userRole, permissions);
    },
    
    canAll: (permissions: Permission[]) => {
      if (!userRole) return false;
      return hasAllPermissions(userRole, permissions);
    },
    
    // Organization access
    canAccessOrg: (targetOrgId: string) => {
      if (!userRole || !userOrgId) return false;
      return canAccessOrganization(userRole, userOrgId, targetOrgId);
    },
    
    // UI visibility
    shouldShow: (requiredPermissions: Permission[], targetOrgId?: string) => {
      if (!userRole) return false;
      return shouldShowComponent(userRole, requiredPermissions, userOrgId, targetOrgId);
    },
    
    // Data scope
    getScope: () => {
      if (!userRole || !userOrgId) return { scope: "none" as const };
      return getDataScope(userRole, userOrgId);
    },
    
    // Security checks
    needsSecondaryAuth: (permission: Permission) => {
      return requiresSecondaryAuth(permission);
    },
    
    // Role checks
    isSuperAdmin: () => userRole === "SUPER_ADMIN",
    isOrgAdmin: () => userRole === "ORG_ADMIN", 
    isOrgUser: () => userRole === "ORG_USER",
    
    // Current user info
    role: userRole,
    organizationId: userOrgId,
    user
  };
};

// Higher-order component for permission-based rendering
export const withPermissions = <T extends object>(
  Component: React.ComponentType<T>,
  requiredPermissions: Permission[],
  fallback?: React.ComponentType | null
) => {
  return (props: T) => {
    const { shouldShow } = usePermissions();
    
    if (!shouldShow(requiredPermissions)) {
      return fallback ? React.createElement(fallback) : null;
    }
    
    return React.createElement(Component, props);
  };
};

// Permission gate component
export const PermissionGate: React.FC<{
  permissions: Permission[];
  organizationId?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permissions, organizationId, fallback = null, children }) => {
  const { shouldShow } = usePermissions();
  
  if (!shouldShow(permissions, organizationId)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Role-specific gates
export const SuperAdminOnly: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => (
  <PermissionGate 
    permissions={["system.global_settings"]} 
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

export const OrgAdminOnly: React.FC<{ 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback = null }) => (
  <PermissionGate 
    permissions={["org.settings", "system.global_settings"]} 
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

// Audit logging hook
export const useAuditLog = () => {
  const { user } = useAuth();
  
  const logAction = async (
    action: string,
    category: string,
    details: object = {},
    targetOrgId?: string
  ) => {
    if (!user) return;
    
    const auditEntry = {
      userId: user.id,
      userRole: user.role,
      userOrganizationId: user.organizationId,
      action,
      category,
      details,
      targetOrganizationId: targetOrgId,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1", // Would be captured from request in real app
      userAgent: navigator.userAgent
    };
    
    // In a real app, this would send to audit logging service
    console.log("AUDIT LOG:", auditEntry);
    
    // Store in session storage for demo purposes
    const existingLogs = JSON.parse(sessionStorage.getItem("auditLogs") || "[]");
    existingLogs.unshift(auditEntry);
    sessionStorage.setItem("auditLogs", JSON.stringify(existingLogs.slice(0, 100)));
  };
  
  return { logAction };
};