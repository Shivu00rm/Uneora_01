import React from "react";
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
  Role,
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
      return shouldShowComponent(
        userRole,
        requiredPermissions,
        userOrgId,
        targetOrgId,
      );
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
    user,
  };
};

// Audit logging hook
export const useAuditLog = () => {
  const { user } = useAuth();

  const logAction = async (
    action: string,
    category: string,
    details: object = {},
    targetOrgId?: string,
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
      userAgent: navigator.userAgent,
    };

    // In a real app, this would send to audit logging service
    console.log("AUDIT LOG:", auditEntry);

    // Store in session storage for demo purposes
    const existingLogs = JSON.parse(
      sessionStorage.getItem("auditLogs") || "[]",
    );
    existingLogs.unshift(auditEntry);
    sessionStorage.setItem(
      "auditLogs",
      JSON.stringify(existingLogs.slice(0, 100)),
    );
  };

  return { logAction };
};
