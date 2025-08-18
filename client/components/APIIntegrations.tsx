import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";
import { usePermissions, useAuditLog } from "@/hooks/usePermissions";
import { PermissionGate } from "./PermissionGates";
import {
  Zap,
  Plus,
  Settings,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Link as LinkIcon,
  Unlink,
  Eye,
  EyeOff,
  Copy,
  Trash2,
} from "lucide-react";

interface APIIntegration {
  id: string;
  name: string;
  type: "sales" | "payment" | "email" | "analytics" | "storage" | "accounting";
  platform: string;
  status: "connected" | "disconnected" | "error" | "syncing";
  lastSync: Date;
  dataVolume: {
    orders: number;
    products: number;
    customers: number;
  };
  syncInterval: "realtime" | "hourly" | "daily" | "manual";
  credentials?: {
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    webhook?: string;
  };
  permissions: string[];
  errorMessage?: string;
}

interface SyncLog {
  id: string;
  integrationId: string;
  timestamp: Date;
  status: "success" | "error" | "partial";
  recordsProcessed: number;
  errorDetails?: string;
}

export function APIIntegrations() {
  const { can, isSuperAdmin, isOrgAdmin } = usePermissions();
  const { logAction } = useAuditLog();
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] =
    useState<APIIntegration | null>(null);
  const [showCredentials, setShowCredentials] = useState<Set<string>>(
    new Set(),
  );

  // Mock data initialization
  useEffect(() => {
    const mockIntegrations: APIIntegration[] = [
      {
        id: "shopify-1",
        name: "Shopify Store",
        type: "sales",
        platform: "Shopify",
        status: "connected",
        lastSync: new Date(Date.now() - 300000), // 5 mins ago
        dataVolume: { orders: 245, products: 89, customers: 156 },
        syncInterval: "hourly",
        credentials: {
          apiKey: "sk_****_****_****_1234",
          webhook: "https://api.uneora.com/webhooks/shopify",
        },
        permissions: ["read_orders", "read_products", "read_customers"],
      },
      {
        id: "woocommerce-1",
        name: "WooCommerce Store",
        type: "sales",
        platform: "WooCommerce",
        status: "error",
        lastSync: new Date(Date.now() - 7200000), // 2 hours ago
        dataVolume: { orders: 0, products: 0, customers: 0 },
        syncInterval: "daily",
        errorMessage: "Authentication failed - API key expired",
      },
      {
        id: "stripe-1",
        name: "Stripe Payments",
        type: "payment",
        platform: "Stripe",
        status: "connected",
        lastSync: new Date(Date.now() - 600000), // 10 mins ago
        dataVolume: { orders: 89, products: 0, customers: 67 },
        syncInterval: "realtime",
        credentials: {
          clientId: "ca_****_****_****_5678",
          clientSecret: "sk_****_****_****_abcd",
        },
        permissions: ["read_payments", "read_customers"],
      },
    ];

    const mockLogs: SyncLog[] = [
      {
        id: "log-1",
        integrationId: "shopify-1",
        timestamp: new Date(Date.now() - 300000),
        status: "success",
        recordsProcessed: 15,
      },
      {
        id: "log-2",
        integrationId: "woocommerce-1",
        timestamp: new Date(Date.now() - 7200000),
        status: "error",
        recordsProcessed: 0,
        errorDetails: "API key expired",
      },
      {
        id: "log-3",
        integrationId: "stripe-1",
        timestamp: new Date(Date.now() - 600000),
        status: "success",
        recordsProcessed: 23,
      },
    ];

    setIntegrations(mockIntegrations);
    setSyncLogs(mockLogs);
  }, []);

  const handleConnect = async (platform: string, credentials: any) => {
    setIsConnecting(platform);

    await logAction("api_integration_connect", "api_access", {
      platform,
      timestamp: new Date().toISOString(),
    });

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newIntegration: APIIntegration = {
      id: `${platform.toLowerCase()}-${Date.now()}`,
      name: `${platform} Integration`,
      type: "sales",
      platform,
      status: "connected",
      lastSync: new Date(),
      dataVolume: { orders: 0, products: 0, customers: 0 },
      syncInterval: "hourly",
      credentials,
      permissions: ["read_orders", "read_products"],
    };

    setIntegrations((prev) => [...prev, newIntegration]);
    setIsConnecting(null);
  };

  const handleDisconnect = async (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    await logAction("api_integration_disconnect", "api_access", {
      platform: integration.platform,
      integrationId,
    });

    setIntegrations((prev) => prev.filter((i) => i.id !== integrationId));
  };

  const handleSync = async (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    // Update status to syncing
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId ? { ...i, status: "syncing" as const } : i,
      ),
    );

    await logAction("api_integration_sync", "api_access", {
      platform: integration.platform,
      integrationId,
    });

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update with sync results
    const recordsProcessed = Math.floor(Math.random() * 50) + 10;
    const newLog: SyncLog = {
      id: `log-${Date.now()}`,
      integrationId,
      timestamp: new Date(),
      status: "success",
      recordsProcessed,
    };

    setSyncLogs((prev) => [newLog, ...prev]);

    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId
          ? {
              ...i,
              status: "connected" as const,
              lastSync: new Date(),
              dataVolume: {
                orders:
                  i.dataVolume.orders + Math.floor(recordsProcessed * 0.6),
                products:
                  i.dataVolume.products + Math.floor(recordsProcessed * 0.3),
                customers:
                  i.dataVolume.customers + Math.floor(recordsProcessed * 0.1),
              },
            }
          : i,
      ),
    );
  };

  const handleExportData = async (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    await logAction("data_export", "data_access", {
      platform: integration.platform,
      integrationId,
    });

    // Simulate CSV export
    const csvData = `Order ID,Product,Customer,Amount,Date\n1,Product A,John Doe,100,2024-01-15\n2,Product B,Jane Smith,150,2024-01-16`;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${integration.platform}-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "default";
      case "syncing":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  };

  const toggleCredentialVisibility = (integrationId: string) => {
    setShowCredentials((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(integrationId)) {
        newSet.delete(integrationId);
      } else {
        newSet.add(integrationId);
      }
      return newSet;
    });
  };

  if (!can("org.api_integrations")) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You don't have permission to access API integrations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">API Integrations</h2>
          <p className="text-muted-foreground">
            Connect external platforms to sync data automatically
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
                <DialogDescription>
                  Connect a new platform to sync your data
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Shopify",
                    "WooCommerce",
                    "Amazon",
                    "Flipkart",
                    "BigCommerce",
                    "Magento",
                  ].map((platform) => (
                    <Button
                      key={platform}
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() =>
                        handleConnect(platform, { apiKey: "demo_key" })
                      }
                      disabled={isConnecting === platform}
                    >
                      {isConnecting === platform ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                      <span className="text-sm">{platform}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <LinkIcon className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{integrations.length}</div>
                <div className="text-sm text-muted-foreground">Connected</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {integrations.filter((i) => i.status === "connected").length}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {integrations.reduce(
                    (sum, i) => sum + i.dataVolume.orders,
                    0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Orders Synced
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {
                    syncLogs.filter(
                      (l) => l.timestamp > new Date(Date.now() - 86400000),
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Last 24h Syncs
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Connected Platforms</TabsTrigger>
          <TabsTrigger value="logs">Sync History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Badge variant={getStatusColor(integration.status)}>
                            {getStatusIcon(integration.status)}
                            {integration.status}
                          </Badge>
                          <Badge variant="outline">
                            {integration.platform}
                          </Badge>
                        </div>

                        {integration.errorMessage && (
                          <div className="text-sm text-red-600 mb-2">
                            {integration.errorMessage}
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                          <div>
                            <span className="font-medium">
                              {integration.dataVolume.orders}
                            </span>{" "}
                            orders
                          </div>
                          <div>
                            <span className="font-medium">
                              {integration.dataVolume.products}
                            </span>{" "}
                            products
                          </div>
                          <div>
                            <span className="font-medium">
                              {integration.dataVolume.customers}
                            </span>{" "}
                            customers
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Last sync: {integration.lastSync.toLocaleString()} •
                          Interval: {integration.syncInterval}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                        disabled={integration.status === "syncing"}
                      >
                        <RefreshCw
                          className={`h-4 w-4 mr-2 ${integration.status === "syncing" ? "animate-spin" : ""}`}
                        />
                        Sync Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportData(integration.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedIntegration(integration)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {syncLogs.map((log) => {
                    const integration = integrations.find(
                      (i) => i.id === log.integrationId,
                    );
                    return (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div className="flex items-center gap-3">
                          {log.status === "success" ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <div>
                            <div className="font-medium">
                              {integration?.platform}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {log.recordsProcessed} records •{" "}
                              {log.timestamp.toLocaleString()}
                            </div>
                            {log.errorDetails && (
                              <div className="text-sm text-red-600">
                                {log.errorDetails}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            log.status === "success" ? "default" : "destructive"
                          }
                        >
                          {log.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-sync enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data based on configured intervals
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Webhook notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive instant updates when data changes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Default sync interval</Label>
                <Select defaultValue="hourly">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="manual">Manual only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Details Modal */}
      {selectedIntegration && (
        <Dialog
          open={!!selectedIntegration}
          onOpenChange={() => setSelectedIntegration(null)}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedIntegration.name} Settings</DialogTitle>
              <DialogDescription>
                Configure integration settings and credentials
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sync Interval</Label>
                  <Select defaultValue={selectedIntegration.syncInterval}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="manual">Manual only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusIcon(selectedIntegration.status)}
                    <span className="capitalize">
                      {selectedIntegration.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedIntegration.credentials && (
                <div className="space-y-3">
                  <Label>Credentials</Label>
                  {Object.entries(selectedIntegration.credentials).map(
                    ([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Label className="w-24 capitalize">{key}:</Label>
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            type={
                              showCredentials.has(selectedIntegration.id)
                                ? "text"
                                : "password"
                            }
                            value={value}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleCredentialVisibility(selectedIntegration.id)
                            }
                          >
                            {showCredentials.has(selectedIntegration.id) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button>Save Changes</Button>
                <Button variant="outline">Test Connection</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDisconnect(selectedIntegration.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
