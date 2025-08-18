import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { APIIntegrations } from "@/components/APIIntegrations";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions, useAuditLog } from "@/hooks/usePermissions";
import { PermissionGate, OrgAdminOnly } from "@/components/PermissionGates";
import {
  Settings,
  Building2,
  User,
  Bell,
  Shield,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  Users,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  BarChart3,
} from "lucide-react";

export default function AppSettings() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const { logAction } = useAuditLog();
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Organization settings state
  const [orgSettings, setOrgSettings] = useState({
    name: user?.organizationName || "",
    description: "Technology solutions and consulting services",
    email: "admin@techcorp.com",
    phone: "+91 98765 43210",
    address: "123 Business Park, Mumbai, Maharashtra 400001",
    website: "https://techcorp.com",
    timezone: "Asia/Kolkata",
    currency: "INR",
    taxId: "GST123456789",
    plan: "Pro",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    paymentUpdates: true,
    systemAlerts: true,
    weeklyReports: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "8",
    passwordRequirement: "strong",
    apiAccess: true,
    webhookUrl: "https://api.techcorp.com/webhooks/uneora",
  });

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await logAction("organization_settings_updated", "org_management", {
        section,
        organizationId: user?.organizationId,
      });

      console.log(`${section} settings saved successfully`);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleSecurityToggle = (key: string, value: boolean) => {
    setSecurity((prev) => ({ ...prev, [key]: value }));
  };

  if (!can("org.settings")) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You don't have permission to access organization settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Organization Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your organization's preferences and configurations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <Building2 className="h-4 w-4" />
            {user?.organizationName}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            {user?.role?.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={orgSettings.name}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Primary Email</Label>
                  <Input
                    id="org-email"
                    type="email"
                    value={orgSettings.email}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-phone">Phone Number</Label>
                  <Input
                    id="org-phone"
                    value={orgSettings.phone}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-website">Website</Label>
                  <Input
                    id="org-website"
                    value={orgSettings.website}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-description">Description</Label>
                <Textarea
                  id="org-description"
                  value={orgSettings.description}
                  onChange={(e) =>
                    setOrgSettings((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of your organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-address">Address</Label>
                <Textarea
                  id="org-address"
                  value={orgSettings.address}
                  onChange={(e) =>
                    setOrgSettings((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Complete business address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={orgSettings.timezone}
                    onValueChange={(value) =>
                      setOrgSettings((prev) => ({ ...prev, timezone: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">
                        Asia/Kolkata (IST)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">
                        America/New_York (EST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={orgSettings.currency}
                    onValueChange={(value) =>
                      setOrgSettings((prev) => ({ ...prev, currency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID / GST</Label>
                  <Input
                    id="tax-id"
                    value={orgSettings.taxId}
                    onChange={(e) =>
                      setOrgSettings((prev) => ({
                        ...prev,
                        taxId: e.target.value,
                      }))
                    }
                    placeholder="GST123456789"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => handleSaveSettings("general")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Business Alerts</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Low Stock Alerts</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when inventory is running low
                      </div>
                    </div>
                    <Switch
                      checked={notifications.lowStock}
                      onCheckedChange={(checked) =>
                        handleNotificationToggle("lowStock", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">New Orders</div>
                      <div className="text-sm text-muted-foreground">
                        Notifications for new customer orders
                      </div>
                    </div>
                    <Switch
                      checked={notifications.newOrders}
                      onCheckedChange={(checked) =>
                        handleNotificationToggle("newOrders", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Payment Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Payment status and transaction alerts
                      </div>
                    </div>
                    <Switch
                      checked={notifications.paymentUpdates}
                      onCheckedChange={(checked) =>
                        handleNotificationToggle("paymentUpdates", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Weekly Reports</div>
                      <div className="text-sm text-muted-foreground">
                        Weekly business summary reports
                      </div>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        handleNotificationToggle("weeklyReports", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationToggle("emailNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive critical alerts via SMS
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationToggle("smsNotifications", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Browser push notifications
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationToggle("pushNotifications", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => handleSaveSettings("notifications")}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <OrgAdminOnly
            fallback={
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Admin Access Required
                  </h3>
                  <p className="text-muted-foreground">
                    Only organization administrators can access security
                    settings.
                  </p>
                </CardContent>
              </Card>
            }
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        handleSecurityToggle("twoFactorAuth", checked)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout</Label>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(value) =>
                        setSecurity((prev) => ({
                          ...prev,
                          sessionTimeout: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">API Access</div>
                      <div className="text-sm text-muted-foreground">
                        Allow third-party API integrations
                      </div>
                    </div>
                    <Switch
                      checked={security.apiAccess}
                      onCheckedChange={(checked) =>
                        handleSecurityToggle("apiAccess", checked)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-url"
                        value={security.webhookUrl}
                        onChange={(e) =>
                          setSecurity((prev) => ({
                            ...prev,
                            webhookUrl: e.target.value,
                          }))
                        }
                        placeholder="https://your-domain.com/webhooks/uneora"
                      />
                      <Button variant="outline" size="sm">
                        Test
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => handleSaveSettings("security")}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Security Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </OrgAdminOnly>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <APIIntegrations />
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {orgSettings.plan}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current Plan
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">₹9,999</div>
                      <div className="text-sm text-muted-foreground">
                        Monthly
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">28</div>
                      <div className="text-sm text-muted-foreground">
                        Days left
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Plan Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>Up to 50 users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-green-500" />
                      <span>Advanced API integrations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Priority support</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-green-500" />
                      <span>Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span>Automation workflows</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>24/7 support</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline">Upgrade Plan</Button>
                <Button variant="outline">Billing History</Button>
                <Button variant="outline">Download Invoice</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
