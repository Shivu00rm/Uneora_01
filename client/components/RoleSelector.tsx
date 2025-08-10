import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useMockLogin, useAuth } from "@/contexts/AuthContext";
import { Crown, Briefcase, User, LogOut } from "lucide-react";

export function RoleSelector() {
  const { user, logout } = useAuth();
  const { loginAsSuperAdmin, loginAsOrgAdmin, loginAsOrgUser } = useMockLogin();

  if (user) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Current User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {user.role === "SUPER_ADMIN" && <Crown className="h-4 w-4 text-primary" />}
                {user.role === "ORG_ADMIN" && <Briefcase className="h-4 w-4 text-primary" />}
                {user.role === "ORG_USER" && <User className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
                {user.organizationName && (
                  <div className="text-xs text-muted-foreground">{user.organizationName}</div>
                )}
              </div>
              <Badge variant={
                user.role === "SUPER_ADMIN" ? "default" :
                user.role === "ORG_ADMIN" ? "secondary" : "outline"
              }>
                {user.role.replace('_', ' ')}
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
                onClick={logout}
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
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-sm">Login as Different Roles</CardTitle>
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
