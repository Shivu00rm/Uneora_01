import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIIntegrations } from "@/components/APIIntegrations";
import { SuperAdminAPIKeys } from "@/components/SuperAdminAPIKeys";
import {
  PermissionGate,
  SuperAdminOnly,
  OrgAdminOnly,
} from "@/components/PermissionGates";
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Key,
  Shield,
  Bell,
  Database,
  Globe,
  Users,
  CreditCard,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect based on user role
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // For tenant users, redirect to the tenant settings
    if (user.role === "ORG_ADMIN" || user.role === "ORG_USER") {
      navigate("/app/settings");
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Super Admin Settings Page
  if (user.role === "SUPER_ADMIN") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Platform Settings
            </h1>
            <p className="text-muted-foreground">
              Manage global platform settings and configurations
            </p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Shield className="h-4 w-4" />
            Super Admin
          </Badge>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            <SuperAdminAPIKeys />
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organization Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-primary" />
                        <div>
                          <div className="text-lg font-semibold">127</div>
                          <div className="text-sm text-muted-foreground">
                            Total Organizations
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-green-500" />
                        <div>
                          <div className="text-lg font-semibold">2,847</div>
                          <div className="text-sm text-muted-foreground">
                            Total Users
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-blue-500" />
                        <div>
                          <div className="text-lg font-semibold">₹4.9L</div>
                          <div className="text-sm text-muted-foreground">
                            Monthly Revenue
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-6">
                  <Button onClick={() => navigate("/super-admin")}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Manage Organizations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Platform Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Health</span>
                        <Badge variant="default">Operational</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Uptime</span>
                        <span className="text-sm font-medium">99.9%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database</span>
                        <Badge variant="default">Connected</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Resources</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">CPU Usage</span>
                        <span className="text-sm font-medium">34%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Memory</span>
                        <span className="text-sm font-medium">62%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Storage</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        Two-Factor Authentication
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Require 2FA for all admin accounts
                      </div>
                    </div>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Session Timeout</div>
                      <div className="text-sm text-muted-foreground">
                        Auto-logout after inactivity
                      </div>
                    </div>
                    <span className="text-sm font-medium">8 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Audit Logging</div>
                      <div className="text-sm text-muted-foreground">
                        Log all admin actions
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Audit Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Default fallback (shouldn't reach here due to redirect)
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardContent className="p-6 text-center">
          <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Settings</h3>
          <p className="text-muted-foreground mb-4">
            Redirecting you to the appropriate settings page...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
