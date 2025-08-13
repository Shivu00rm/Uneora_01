import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/lib/permissions";

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

export const OrgAdminOrSuperAdmin: React.FC<{ 
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
