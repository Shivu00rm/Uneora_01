import React from "react";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Crown, Shield, Building2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="mx-auto mb-6">
                <div className="h-16 w-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Super Admin Access Required
              </h2>
              <p className="text-muted-foreground mb-6">
                This area is restricted to Uneora platform administrators only.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  If you're a regular user, you can access your organization
                  dashboard:
                </p>
                <Button variant="outline" asChild>
                  <a href="/app/dashboard">
                    <Building2 className="mr-2 h-4 w-4" />
                    Go to Organization Dashboard
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Super Admin Header Strip */}
      <div className="bg-primary/5 border-b border-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-primary">
                  Uneora Platform Administration
                </h1>
                <p className="text-xs text-muted-foreground">
                  Logged in as Super Admin • {user.name}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary">
              Super Admin Access
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Notice */}
      <Alert className="mx-4 sm:mx-6 lg:mx-8 mt-6 mb-6 border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Platform Mode:</strong> You're in the super admin console.
          Organization-specific features are available through the{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-blue-600 underline"
            asChild
          >
            <a href="/org-flows">Organization Health Monitor</a>
          </Button>{" "}
          where you can access individual organization dashboards when needed.
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
