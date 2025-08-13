import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Crown,
  Briefcase,
  User,
  LogOut,
  Minimize2,
  Maximize2,
} from "lucide-react";

export function RoleSelector() {
  const { user, logout } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  // Mock login functions
  const loginAsSuperAdmin = () => {
    const mockUser = {
      id: 'mock-super-admin',
      name: 'System Admin',
      email: 'admin@flowstock.com',
      role: 'SUPER_ADMIN' as const,
      status: 'active' as const,
      organizationId: null,
      organizationName: undefined,
      permissions: {}
    };
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    window.location.reload();
  };

  const loginAsOrgAdmin = () => {
    const mockUser = {
      id: 'mock-org-admin',
      name: 'Organization Admin',
      email: 'orgadmin@company.com',
      role: 'ORG_ADMIN' as const,
      status: 'active' as const,
      organizationId: 'mock-org-1',
      organizationName: 'Demo Company',
      permissions: {}
    };
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    window.location.reload();
  };

  const loginAsOrgUser = () => {
    const mockUser = {
      id: 'mock-org-user',
      name: 'Regular User',
      email: 'user@company.com',
      role: 'ORG_USER' as const,
      status: 'active' as const,
      organizationId: 'mock-org-1',
      organizationName: 'Demo Company',
      permissions: {}
    };
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    window.location.reload();
  };

  if (user) {
    if (isMinimized) {
      return (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsMinimized(false)}
            size="sm"
            className="h-10 w-10 rounded-full bg-orange-100 hover:bg-orange-200 border border-orange-200"
            variant="ghost"
          >
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              {user.role === "SUPER_ADMIN" && (
                <Crown className="h-3 w-3 text-primary" />
              )}
              {user.role === "ORG_ADMIN" && (
                <Briefcase className="h-3 w-3 text-primary" />
              )}
              {user.role === "ORG_USER" && (
                <User className="h-3 w-3 text-primary" />
              )}
            </div>
          </Button>
        </div>
      );
    }

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80 border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-orange-800">
                DEV: Current User
              </CardTitle>
              <Button
                onClick={() => setIsMinimized(true)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-orange-200"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {user.role === "SUPER_ADMIN" && (
                  <Crown className="h-4 w-4 text-primary" />
                )}
                {user.role === "ORG_ADMIN" && (
                  <Briefcase className="h-4 w-4 text-primary" />
                )}
                {user.role === "ORG_USER" && (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
                {user.organizationName && (
                  <div className="text-xs text-muted-foreground">
                    {user.organizationName}
                  </div>
                )}
              </div>
              <Badge
                variant={
                  user.role === "SUPER_ADMIN"
                    ? "default"
                    : user.role === "ORG_ADMIN"
                      ? "secondary"
                      : "outline"
                }
              >
                {user.role.replace("_", " ")}
              </Badge>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={loginAsSuperAdmin}
                disabled={user.role === "SUPER_ADMIN"}
              >
                <Crown className="mr-2 h-4 w-4" />
                Switch to Super Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={loginAsOrgAdmin}
                disabled={user.role === "ORG_ADMIN"}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Switch to Org Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={loginAsOrgUser}
                disabled={user.role === "ORG_USER"}
              >
                <User className="mr-2 h-4 w-4" />
                Switch to Org User
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => {
                  localStorage.removeItem('mock_user');
                  logout();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-sm text-orange-800">
            DEV: Login as Different Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={loginAsSuperAdmin}
          >
            <Crown className="mr-2 h-4 w-4" />
            Login as Super Admin
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={loginAsOrgAdmin}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Login as Org Admin
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={loginAsOrgUser}
          >
            <User className="mr-2 h-4 w-4" />
            Login as Org User
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
