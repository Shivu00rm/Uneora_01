// Comprehensive Role-Based Access Control (RBAC) System

export type Role = "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER";

export type Permission =
  // Organization Management (Super Admin only)
  | "organizations.create"
  | "organizations.delete"
  | "organizations.edit"
  | "organizations.view_all"
  | "organizations.suspend"
  | "organizations.assign_admin"

  // System Management (Super Admin only)
  | "system.global_settings"
  | "system.audit_logs"
  | "system.api_keys"
  | "system.platform_alerts"
  | "system.cross_org_analytics"
  | "system.user_management"

  // Organization Scope (Org Admin within their org)
  | "org.settings"
  | "org.users.create"
  | "org.users.edit"
  | "org.users.delete"
  | "org.users.view"
  | "org.audit_logs"
  | "org.analytics"
  | "org.api_integrations"
  | "org.billing"

  // Inventory & Operations (Org Admin + Org User within their org)
  | "inventory.view"
  | "inventory.create"
  | "inventory.edit"
  | "inventory.delete"
  | "pos.view"
  | "pos.process"
  | "vendors.view"
  | "vendors.create"
  | "vendors.edit"
  | "purchase_orders.view"
  | "purchase_orders.create"
  | "purchase_orders.edit"
  | "analytics.view"

  // Reports & Export (Role-dependent scope)
  | "reports.generate"
  | "reports.export"
  | "data.export";

// Role-Permission Matrix
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    // Full system access
    "organizations.create",
    "organizations.delete",
    "organizations.edit",
    "organizations.view_all",
    "organizations.suspend",
    "organizations.assign_admin",
    "system.global_settings",
    "system.audit_logs",
    "system.api_keys",
    "system.platform_alerts",
    "system.cross_org_analytics",
    "system.user_management",
    "reports.generate",
    "reports.export",
    "data.export",
  ],

  ORG_ADMIN: [
    // Organization scope only
    "org.settings",
    "org.users.create",
    "org.users.edit",
    "org.users.delete",
    "org.users.view",
    "org.audit_logs",
    "org.analytics",
    "org.api_integrations",
    "org.billing",
    // Plus all operational permissions
    "inventory.view",
    "inventory.create",
    "inventory.edit",
    "inventory.delete",
    "pos.view",
    "pos.process",
    "vendors.view",
    "vendors.create",
    "vendors.edit",
    "purchase_orders.view",
    "purchase_orders.create",
    "purchase_orders.edit",
    "analytics.view",
    "reports.generate",
    "reports.export",
    "data.export",
  ],

  ORG_USER: [
    // Limited operational access
    "inventory.view",
    "inventory.create",
    "inventory.edit",
    "pos.view",
    "pos.process",
    "vendors.view",
    "purchase_orders.view",
    "analytics.view",
  ],
};

// Permission checking functions
export const hasPermission = (
  userRole: Role,
  permission: Permission,
): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
};

export const hasAnyPermission = (
  userRole: Role,
  permissions: Permission[],
): boolean => {
  return permissions.some((permission) => hasPermission(userRole, permission));
};

export const hasAllPermissions = (
  userRole: Role,
  permissions: Permission[],
): boolean => {
  return permissions.every((permission) => hasPermission(userRole, permission));
};

// Organization scope validation
export const canAccessOrganization = (
  userRole: Role,
  userOrgId: string,
  targetOrgId: string,
): boolean => {
  // Super Admin can access any organization
  if (userRole === "SUPER_ADMIN") return true;

  // Org Admin and Org User can only access their own organization
  return userOrgId === targetOrgId;
};

// High-impact actions requiring secondary confirmation
export const HIGH_IMPACT_ACTIONS = [
  "organizations.delete",
  "organizations.suspend",
  "system.global_settings",
  "org.users.delete",
  "system.api_keys",
] as const;

export const requiresSecondaryAuth = (permission: Permission): boolean => {
  return HIGH_IMPACT_ACTIONS.includes(permission as any);
};

// Data scope filters
export const getDataScope = (userRole: Role, userOrgId: string) => {
  switch (userRole) {
    case "SUPER_ADMIN":
      return { scope: "global" as const };
    case "ORG_ADMIN":
    case "ORG_USER":
      return { scope: "organization" as const, organizationId: userOrgId };
    default:
      return { scope: "none" as const };
  }
};

// UI visibility helpers
export const shouldShowComponent = (
  userRole: Role,
  requiredPermissions: Permission[],
  userOrgId?: string,
  targetOrgId?: string,
): boolean => {
  // Check permissions
  const hasRequiredPermissions = hasAnyPermission(
    userRole,
    requiredPermissions,
  );

  // Check organization access if applicable
  if (targetOrgId && userOrgId) {
    const hasOrgAccess = canAccessOrganization(
      userRole,
      userOrgId,
      targetOrgId,
    );
    return hasRequiredPermissions && hasOrgAccess;
  }

  return hasRequiredPermissions;
};

// Audit log categories
export const AUDIT_CATEGORIES = {
  AUTHENTICATION: "authentication",
  AUTHORIZATION: "authorization",
  USER_MANAGEMENT: "user_management",
  ORGANIZATION: "organization",
  SYSTEM_CONFIG: "system_config",
  DATA_ACCESS: "data_access",
  API_ACCESS: "api_access",
  BILLING: "billing",
} as const;

export type AuditCategory =
  (typeof AUDIT_CATEGORIES)[keyof typeof AUDIT_CATEGORIES];

// Security event types
export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  PERMISSION_DENIED: "permission_denied",
  UNAUTHORIZED_ACCESS: "unauthorized_access",
  PRIVILEGE_ESCALATION: "privilege_escalation",
  API_KEY_CREATED: "api_key_created",
  API_KEY_DELETED: "api_key_deleted",
  ORGANIZATION_CREATED: "organization_created",
  ORGANIZATION_DELETED: "organization_deleted",
  USER_ROLE_CHANGED: "user_role_changed",
} as const;

export type SecurityEvent =
  (typeof SECURITY_EVENTS)[keyof typeof SECURITY_EVENTS];
