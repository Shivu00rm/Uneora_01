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
import { Textarea } from "./ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { usePermissions, useAuditLog } from "@/hooks/usePermissions";
import { SuperAdminOnly } from "./PermissionGates";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Key,
  Globe,
  Database,
  CreditCard,
  Mail,
  BarChart3,
  Cloud,
  FileText,
  RefreshCw,
} from "lucide-react";

interface APIKey {
  id: string;
  name: string;
  service: string;
  type:
    | "database"
    | "ai"
    | "payment"
    | "email"
    | "analytics"
    | "storage"
    | "accounting"
    | "other";
  key: string;
  scope: "global" | "organization";
  organizationIds?: string[];
  status: "active" | "expired" | "disabled";
  lastUsed: Date;
  usageCount: number;
  errorCount: number;
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string;
  description?: string;
  permissions: string[];
}

interface APIUsageLog {
  id: string;
  apiKeyId: string;
  timestamp: Date;
  endpoint: string;
  status: "success" | "error";
  responseTime: number;
  organizationId?: string;
  errorMessage?: string;
}

interface OrganizationIntegration {
  organizationId: string;
  organizationName: string;
  enabledServices: string[];
  lastActivity: Date;
  totalCalls: number;
}

export function SuperAdminAPIKeys() {
  const { can, isSuperAdmin } = usePermissions();
  const { logAction } = useAuditLog();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [usageLogs, setUsageLogs] = useState<APIUsageLog[]>([]);
  const [orgIntegrations, setOrgIntegrations] = useState<
    OrganizationIntegration[]
  >([]);
  const [isAddKeyOpen, setIsAddKeyOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set());
  const [newKey, setNewKey] = useState({
    name: "",
    service: "",
    type: "other" as APIKey["type"],
    key: "",
    scope: "global" as APIKey["scope"],
    description: "",
    permissions: [] as string[],
  });

  // Mock data initialization
  useEffect(() => {
    const mockAPIKeys: APIKey[] = [
      {
        id: "key-1",
        name: "OpenAI GPT-4",
        service: "OpenAI",
        type: "ai",
        key: "sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
        scope: "global",
        status: "active",
        lastUsed: new Date(Date.now() - 300000),
        usageCount: 1247,
        errorCount: 3,
        expiresAt: new Date(Date.now() + 86400000 * 90),
        createdAt: new Date(Date.now() - 86400000 * 30),
        createdBy: "System Owner",
        description: "AI integration for sales forecasting and insights",
        permissions: ["read", "write"],
      },
      {
        id: "key-2",
        name: "Stripe Global",
        service: "Stripe",
        type: "payment",
        key: "sk_live_51Abc123Def456Ghi789Jkl012Mno345Pqr678Stu901Vwx234Yz567",
        scope: "global",
        status: "active",
        lastUsed: new Date(Date.now() - 600000),
        usageCount: 892,
        errorCount: 12,
        createdAt: new Date(Date.now() - 86400000 * 60),
        createdBy: "System Owner",
        description: "Global payment processing for all organizations",
        permissions: ["payments", "customers", "subscriptions"],
      },
      {
        id: "key-3",
        name: "SendGrid Email",
        service: "SendGrid",
        type: "email",
        key: "SG.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
        scope: "organization",
        organizationIds: ["org-1", "org-3"],
        status: "active",
        lastUsed: new Date(Date.now() - 1800000),
        usageCount: 2341,
        errorCount: 8,
        createdAt: new Date(Date.now() - 86400000 * 45),
        createdBy: "System Owner",
        description: "Email delivery for selected organizations",
        permissions: ["send_email", "templates"],
      },
      {
        id: "key-4",
        name: "Google Analytics",
        service: "Google Analytics",
        type: "analytics",
        key: "AIzaSyAbc123Def456Ghi789Jkl012Mno345Pqr678Stu901",
        scope: "global",
        status: "expired",
        lastUsed: new Date(Date.now() - 86400000 * 7),
        usageCount: 156,
        errorCount: 45,
        expiresAt: new Date(Date.now() - 86400000),
        createdAt: new Date(Date.now() - 86400000 * 120),
        createdBy: "System Owner",
        description: "Analytics integration - EXPIRED",
        permissions: ["read_analytics"],
      },
    ];

    const mockUsageLogs: APIUsageLog[] = [
      {
        id: "log-1",
        apiKeyId: "key-1",
        timestamp: new Date(Date.now() - 300000),
        endpoint: "/api/ai/forecast",
        status: "success",
        responseTime: 1240,
        organizationId: "org-1",
      },
      {
        id: "log-2",
        apiKeyId: "key-2",
        timestamp: new Date(Date.now() - 600000),
        endpoint: "/api/payments/process",
        status: "success",
        responseTime: 890,
        organizationId: "org-2",
      },
      {
        id: "log-3",
        apiKeyId: "key-2",
        timestamp: new Date(Date.now() - 900000),
        endpoint: "/api/payments/process",
        status: "error",
        responseTime: 0,
        organizationId: "org-3",
        errorMessage: "Invalid payment method",
      },
    ];

    const mockOrgIntegrations: OrganizationIntegration[] = [
      {
        organizationId: "org-1",
        organizationName: "TechCorp",
        enabledServices: ["OpenAI", "Stripe", "SendGrid"],
        lastActivity: new Date(Date.now() - 300000),
        totalCalls: 1247,
      },
      {
        organizationId: "org-2",
        organizationName: "Fashion Boutique",
        enabledServices: ["Stripe", "SendGrid"],
        lastActivity: new Date(Date.now() - 600000),
        totalCalls: 892,
      },
      {
        organizationId: "org-3",
        organizationName: "StartupXYZ",
        enabledServices: ["SendGrid"],
        lastActivity: new Date(Date.now() - 1800000),
        totalCalls: 234,
      },
    ];

    setApiKeys(mockAPIKeys);
    setUsageLogs(mockUsageLogs);
    setOrgIntegrations(mockOrgIntegrations);
  }, []);

  const handleCreateKey = async () => {
    if (!newKey.name || !newKey.service || !newKey.key) return;

    const apiKey: APIKey = {
      id: `key-${Date.now()}`,
      ...newKey,
      status: "active",
      lastUsed: new Date(),
      usageCount: 0,
      errorCount: 0,
      createdAt: new Date(),
      createdBy: "System Owner",
    };

    await logAction("api_key_created", "system_config", {
      service: newKey.service,
      scope: newKey.scope,
    });

    setApiKeys((prev) => [...prev, apiKey]);
    setNewKey({
      name: "",
      service: "",
      type: "other",
      key: "",
      scope: "global",
      description: "",
      permissions: [],
    });
    setIsAddKeyOpen(false);
  };

  const handleDeleteKey = async (keyId: string) => {
    const key = apiKeys.find((k) => k.id === keyId);
    if (!key) return;

    await logAction("api_key_deleted", "system_config", {
      service: key.service,
      keyId,
    });

    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
  };

  const handleToggleKeyStatus = async (keyId: string) => {
    const key = apiKeys.find((k) => k.id === keyId);
    if (!key) return;

    const newStatus = key.status === "active" ? "disabled" : "active";

    await logAction("api_key_status_changed", "system_config", {
      service: key.service,
      keyId,
      oldStatus: key.status,
      newStatus,
    });

    setApiKeys((prev) =>
      prev.map((k) => (k.id === keyId ? { ...k, status: newStatus } : k)),
    );
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTypeIcon = (type: APIKey["type"]) => {
    switch (type) {
      case "database":
        return <Database className="h-4 w-4" />;
      case "ai":
        return <BarChart3 className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "analytics":
        return <BarChart3 className="h-4 w-4" />;
      case "storage":
        return <Cloud className="h-4 w-4" />;
      case "accounting":
        return <FileText className="h-4 w-4" />;
      default:
        return <Key className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: APIKey["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "expired":
        return "destructive";
      case "disabled":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (!can("system.api_keys")) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You don't have permission to access API key management.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <SuperAdminOnly>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">API Key Management</h2>
            <p className="text-muted-foreground">
              Manage global API keys and monitor usage across the platform
            </p>
          </div>
          <Dialog open={isAddKeyOpen} onOpenChange={setIsAddKeyOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New API Key</DialogTitle>
                <DialogDescription>
                  Configure a new API key for system integrations
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newKey.name}
                    onChange={(e) =>
                      setNewKey((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., OpenAI GPT-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Service</Label>
                  <Input
                    value={newKey.service}
                    onChange={(e) =>
                      setNewKey((prev) => ({
                        ...prev,
                        service: e.target.value,
                      }))
                    }
                    placeholder="e.g., OpenAI, Stripe, SendGrid"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newKey.type}
                    onValueChange={(value) =>
                      setNewKey((prev) => ({
                        ...prev,
                        type: value as APIKey["type"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI/Machine Learning</SelectItem>
                      <SelectItem value="payment">Payment Gateway</SelectItem>
                      <SelectItem value="email">Email Service</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="storage">Cloud Storage</SelectItem>
                      <SelectItem value="accounting">Accounting</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Textarea
                    value={newKey.key}
                    onChange={(e) =>
                      setNewKey((prev) => ({ ...prev, key: e.target.value }))
                    }
                    placeholder="Paste your API key here..."
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scope</Label>
                  <Select
                    value={newKey.scope}
                    onValueChange={(value) =>
                      setNewKey((prev) => ({
                        ...prev,
                        scope: value as APIKey["scope"],
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">
                        Global (All Organizations)
                      </SelectItem>
                      <SelectItem value="organization">
                        Organization Specific
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newKey.description}
                    onChange={(e) =>
                      setNewKey((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Optional description..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleCreateKey}
                    disabled={!newKey.name || !newKey.service || !newKey.key}
                  >
                    Create API Key
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddKeyOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Key className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{apiKeys.length}</div>
                  <div className="text-sm text-muted-foreground">
                    Total Keys
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {apiKeys.filter((k) => k.status === "active").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {apiKeys.reduce((sum, k) => sum + k.usageCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Calls
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {
                      apiKeys.filter(
                        (k) => k.status === "expired" || k.errorCount > 10,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Issues</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="keys" className="space-y-4">
          <TabsList>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="usage">Usage Logs</TabsTrigger>
            <TabsTrigger value="organizations">Organization Access</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getTypeIcon(key.type)}
                            <div>
                              <div className="font-medium">{key.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {key.service}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {key.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {key.scope === "global" ? (
                              <Globe className="h-3 w-3" />
                            ) : (
                              <div className="h-3 w-3 rounded-full bg-blue-500" />
                            )}
                            <span className="capitalize">{key.scope}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(key.status)}>
                            {key.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{key.usageCount.toLocaleString()} calls</div>
                            {key.errorCount > 0 && (
                              <div className="text-red-500">
                                {key.errorCount} errors
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {key.lastUsed.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(key.id)}
                            >
                              {showKeys.has(key.id) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(key.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleKeyStatus(key.id)}
                            >
                              {key.status === "active" ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteKey(key.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* API Key Details */}
            {showKeys.size > 0 && (
              <div className="space-y-4">
                {apiKeys
                  .filter((key) => showKeys.has(key.id))
                  .map((key) => (
                    <Card key={key.id} className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          {key.name} - API Key
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="font-mono text-sm p-3 bg-muted rounded break-all">
                          {key.key}
                        </div>
                        {key.description && (
                          <p className="text-sm text-muted-foreground">
                            {key.description}
                          </p>
                        )}
                        <div className="flex gap-4 text-sm">
                          <div>
                            Created: {key.createdAt.toLocaleDateString()}
                          </div>
                          <div>By: {key.createdBy}</div>
                          {key.expiresAt && (
                            <div>
                              Expires: {key.expiresAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent API Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {usageLogs.map((log) => {
                      const apiKey = apiKeys.find((k) => k.id === log.apiKeyId);
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
                                {apiKey?.service}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {log.endpoint} • {log.responseTime}ms
                              </div>
                              {log.errorMessage && (
                                <div className="text-sm text-red-600">
                                  {log.errorMessage}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div>{log.timestamp.toLocaleString()}</div>
                            {log.organizationId && (
                              <div>Org: {log.organizationId}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization API Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orgIntegrations.map((org) => (
                    <div
                      key={org.organizationId}
                      className="flex items-center justify-between p-4 border rounded"
                    >
                      <div>
                        <div className="font-medium">
                          {org.organizationName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {org.enabledServices.join(", ")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {org.totalCalls} total calls • Last activity:{" "}
                          {org.lastActivity.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {org.enabledServices.length} services
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminOnly>
  );
}
