import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, AlertTriangle, ArrowLeft, Shield, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  requiredModule?: string;
  requiredAction?: string;
  requireOrganizationAccess?: boolean;
  organizationId?: string;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles,
  requiredModule,
  requiredAction,
  requireOrganizationAccess = false,
  organizationId,
  fallbackPath
}: ProtectedRouteProps) {
  const { user, hasPermission, canAccessOrganizationData, getDefaultRoute } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no fallbackPath provided, use role-based default
  const redirectPath = fallbackPath || getDefaultRoute();

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check super admin access for super admin routes
  if (location.pathname.startsWith('/super-admin') && user?.role !== "SUPER_ADMIN") {
    return <Navigate to={redirectPath} replace />;
  }

  // Check tenant access for app routes
  if (location.pathname.startsWith('/app') && user?.role === "SUPER_ADMIN") {
    return <Navigate to="/super-admin" replace />;
  }

  // Check organization-specific access
  if (requireOrganizationAccess && organizationId && user && !canAccessOrganizationData(organizationId)) {
    return <AccessDenied reason="organization" requiredOrgId={organizationId} />;
  }

  // Check permission-based access
  if (requiredModule && user && !hasPermission(requiredModule, requiredAction)) {
    return <AccessDenied reason="permission" requiredModule={requiredModule} requiredAction={requiredAction} />;
  }

  return <>{children}</>;
}

interface AccessDeniedProps {
  reason: "role" | "permission" | "organization";
  requiredRole?: string;
  requiredModule?: string;
  requiredAction?: string;
  requiredOrgId?: string;
}

function AccessDenied({ reason, requiredRole, requiredModule, requiredAction, requiredOrgId }: AccessDeniedProps) {
  const { user, getDefaultRoute } = useAuth();

  const getErrorMessage = () => {
    switch (reason) {
      case "role":
        return `This page requires ${requiredRole} role or higher. Your current role: ${user?.role}`;
      case "permission":
        return `This page requires ${requiredAction ? `${requiredAction} access to` : "access to"} ${requiredModule} module.`;
      case "organization":
        return `You don't have access to this organization's data. Organization ID: ${requiredOrgId}`;
      default:
        return "You don't have permission to access this page.";
    }
  };

  const getErrorIcon = () => {
    switch (reason) {
      case "organization":
        return Building2;
      case "role":
        return Shield;
      default:
        return Lock;
    }
  };

  const ErrorIcon = getErrorIcon();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-6">
              <div className="h-16 w-16 bg-destructive/10 rounded-lg flex items-center justify-center">
                <ErrorIcon className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-2">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="text-left">
                  <p className="font-medium text-destructive">Insufficient Permissions</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getErrorMessage()}
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground">
              You don't have the necessary permissions to access this page. 
              Please contact your administrator to request access.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="text-sm text-muted-foreground">
                <p><strong>Current user:</strong> {user?.name} ({user?.email})</p>
                <p><strong>Current role:</strong> {user?.role}</p>
                {user?.organizationName && (
                  <p><strong>Organization:</strong> {user.organizationName}</p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={getDefaultRoute()}>
                  <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline">
                    Go to Home
                  </Button>
                </Link>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Need access? Contact your system administrator or organization admin to update your permissions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Permission-aware component wrapper with organization context
interface PermissionGateProps {
  children: ReactNode;
  module: string;
  action?: string;
  role?: UserRole;
  organizationId?: string;
  fallback?: ReactNode;
}

export function PermissionGate({ 
  children, 
  module, 
  action, 
  role,
  organizationId,
  fallback = null 
}: PermissionGateProps) {
  const { user, hasPermission, canAccessOrganizationData } = useAuth();

  // Check role requirement
  if (role && user?.role !== role && user?.role !== "SUPER_ADMIN") {
    return <>{fallback}</>;
  }

  // Check organization access if specified
  if (organizationId && user && !canAccessOrganizationData(organizationId)) {
    return <>{fallback}</>;
  }

  // Check permission requirement
  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Super Admin only wrapper
interface SuperAdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function SuperAdminOnly({ children, fallback = null }: SuperAdminOnlyProps) {
  const { user } = useAuth();
  
  if (user?.role !== "SUPER_ADMIN") {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Organization Admin only wrapper
interface OrgAdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function OrgAdminOnly({ children, fallback = null }: OrgAdminOnlyProps) {
  const { user } = useAuth();
  
  if (user?.role !== "ORG_ADMIN" && user?.role !== "SUPER_ADMIN") {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Role-based route middleware component
interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { user, getDefaultRoute } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRoute()} replace />;
  }
  
  return <>{children}</>;
}
