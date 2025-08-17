import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import {
  Crown,
  Briefcase,
  User,
  LogOut,
  Minimize2,
  Maximize2,
  LogIn,
} from "lucide-react";

export function RoleSelector() {
  const { user, logout } = useSupabaseAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      // For development, we'll navigate to the login page
      // In a real scenario, you'd want to implement actual login
      window.location.href = '/login';
    } catch (error) {
      console.error('Login failed:', error);
    }
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
              <div className="text-xs text-muted-foreground text-center py-2">
                Production Mode - Use Supabase Auth
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => window.location.href = '/login'}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Switch User (Go to Login)
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
      <Card className="w-80 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-sm text-orange-800">
            DEV: Not Logged In
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground text-center py-2">
            Use real Supabase authentication
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => window.location.href = '/login'}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Go to Login Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
