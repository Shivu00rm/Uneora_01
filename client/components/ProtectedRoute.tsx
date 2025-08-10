import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredModule?: string;
  requiredAction?: string;
  requiredRole?: "owner" | "manager" | "cashier" | "staff";
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredModule,
  requiredAction,
  requiredRole,
  fallbackPath = "/login"
}: ProtectedRouteProps) {
  const { user, hasPermission } = useAuth();

  // Check if user is authenticated
  if (requireAuth && !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole && user?.role !== "owner") {
    return <AccessDenied reason="role" requiredRole={requiredRole} />;
  }

  // Check permission-based access
  if (requiredModule && !hasPermission(requiredModule, requiredAction)) {
    return <AccessDenied reason="permission" requiredModule={requiredModule} requiredAction={requiredAction} />;
  }

  return <>{children}</>;
}

interface AccessDeniedProps {
  reason: "role" | "permission";
  requiredRole?: string;
  requiredModule?: string;
  requiredAction?: string;
}

function AccessDenied({ reason, requiredRole, requiredModule, requiredAction }: AccessDeniedProps) {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-6">
              <div className="h-16 w-16 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Lock className="h-8 w-8 text-destructive" />
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
                    {reason === "role" 
                      ? `This page requires ${requiredRole} role or higher. Your current role: ${user?.role}`
                      : `This page requires ${requiredAction ? `${requiredAction} access to` : "access to"} ${requiredModule} module.`
                    }
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
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
                <Link to="/">
                  <Button>
                    Go to Home
                  </Button>
                </Link>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Need access? Contact your system administrator or business owner to update your permissions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Permission-aware component wrapper
interface PermissionGateProps {
  children: ReactNode;
  module: string;
  action?: string;
  role?: "owner" | "manager" | "cashier" | "staff";
  fallback?: ReactNode;
}

export function PermissionGate({ 
  children, 
  module, 
  action, 
  role, 
  fallback = null 
}: PermissionGateProps) {
  const { user, hasPermission } = useAuth();

  // Check role requirement
  if (role && user?.role !== role && user?.role !== "owner") {
    return <>{fallback}</>;
  }

  // Check permission requirement
  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
