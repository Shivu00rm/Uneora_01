import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import RBACEditor from "@/components/super-admin/RBACEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  Activity,
  Building2,
  Users,
  Database,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Eye,
  Search,
  RefreshCw,
  Server,
  BarChart3,
  Globe,
  Store,
  ShoppingCart,
  CreditCard,
  Settings,
  Ban,
  Play,
  Pause,
  Edit,
  Key,
  UserCheck,
  DollarSign,
  Package,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Filter,
  Calendar,
  Bell,
  Smartphone,
  Monitor,
  PlusCircle,
} from "lucide-react";

// Types for Super Admin data structures
interface Organization {
  id: string;
  name: string;
  domain?: string;
  subscriptionTier: "free" | "pro" | "enterprise";
  status: "active" | "suspended" | "trial" | "overdue";
  industry: "retail" | "fnb" | "pharma" | "manufacturing" | "services";
  storeCount: number;
  userCount: number;
  activeIntegrations: string[];
  usage: {
    skus: number;
    skuLimit: number;
    transactions: number;
    transactionLimit: number;
    apiCalls: number;
    apiCallLimit: number;
  };
  billing: {
    mrr: number;
    lastPayment: string;
    nextBilling: string;
    status: "paid" | "overdue" | "failed";
  };
  createdAt: string;
  lastActivity: string;
  health: "healthy" | "warning" | "critical" | "offline";
}

interface GlobalKPIs {
  totalOrgs: number;
  activeOrgs: number;
  totalStores: number;
  totalRevenue: number;
  monthlyGrowth: number;
  integrationUsage: {
    shopify: number;
    woocommerce: number;
    amazon: number;
    flipkart: number;
  };
  systemHealth: {
    uptime: number;
    avgResponseTime: number;
    errorRate: number;
    activeIncidents: number;
  };
}

interface SystemAlert {
  id: string;
  type: "system" | "organization" | "integration" | "billing";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  affectedOrgs: string[];
  timestamp: string;
  resolved: boolean;
}

export default function SuperAdminConsole() {
  const [selectedView, setSelectedView] = useState("organizations");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showOrgDetails, setShowOrgDetails] = useState(false);
  const [filterTier, setFilterTier] = useState("all");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const mockOrganizations: Organization[] = [
    {
      id: "tech-corp-001",
      name: "TechCorp Solutions",
      domain: "techcorp.com",
      subscriptionTier: "enterprise",
      status: "active",
      industry: "manufacturing",
      storeCount: 15,
      userCount: 48,
      activeIntegrations: ["shopify", "amazon", "woocommerce"],
      usage: {
        skus: 25000,
        skuLimit: 50000,
        transactions: 125000,
        transactionLimit: 250000,
        apiCalls: 450000,
        apiCallLimit: 1000000,
      },
      billing: {
        mrr: 2500,
        lastPayment: "2024-01-15",
        nextBilling: "2024-02-15",
        status: "paid",
      },
      createdAt: "2023-06-15",
      lastActivity: "2024-01-18T10:30:00Z",
      health: "healthy",
    },
    {
      id: "fashion-boutique-002",
      name: "Fashion Boutique Chain",
      domain: "fashionboutique.in",
      subscriptionTier: "pro",
      status: "active",
      industry: "retail",
      storeCount: 8,
      userCount: 22,
      activeIntegrations: ["shopify", "woocommerce"],
      usage: {
        skus: 12000,
        skuLimit: 25000,
        transactions: 45000,
        transactionLimit: 100000,
        apiCalls: 180000,
        apiCallLimit: 500000,
      },
      billing: {
        mrr: 1200,
        lastPayment: "2024-01-12",
        nextBilling: "2024-02-12",
        status: "paid",
      },
      createdAt: "2023-09-22",
      lastActivity: "2024-01-18T14:20:00Z",
      health: "warning",
    },
    {
      id: "foodie-chain-003",
      name: "Foodie Express Chain",
      domain: "foodieexpress.com",
      subscriptionTier: "free",
      status: "trial",
      industry: "fnb",
      storeCount: 3,
      userCount: 8,
      activeIntegrations: ["shopify"],
      usage: {
        skus: 850,
        skuLimit: 1000,
        transactions: 2400,
        transactionLimit: 5000,
        apiCalls: 12000,
        apiCallLimit: 25000,
      },
      billing: {
        mrr: 0,
        lastPayment: "",
        nextBilling: "2024-01-25",
        status: "paid",
      },
      createdAt: "2024-01-10",
      lastActivity: "2024-01-18T16:45:00Z",
      health: "healthy",
    },
    {
      id: "pharma-plus-004",
      name: "PharmaCare Plus",
      domain: "pharmacareplus.in",
      subscriptionTier: "pro",
      status: "overdue",
      industry: "pharma",
      storeCount: 12,
      userCount: 35,
      activeIntegrations: ["amazon", "flipkart"],
      usage: {
        skus: 18500,
        skuLimit: 25000,
        transactions: 68000,
        transactionLimit: 100000,
        apiCalls: 285000,
        apiCallLimit: 500000,
      },
      billing: {
        mrr: 1200,
        lastPayment: "2023-12-12",
        nextBilling: "2024-01-12",
        status: "overdue",
      },
      createdAt: "2023-04-08",
      lastActivity: "2024-01-17T09:15:00Z",
      health: "critical",
    },
    {
      id: "startup-xyz-005",
      name: "StartupXYZ",
      domain: "startupxyz.io",
      subscriptionTier: "free",
      status: "suspended",
      industry: "services",
      storeCount: 1,
      userCount: 3,
      activeIntegrations: [],
      usage: {
        skus: 1200,
        skuLimit: 1000,
        transactions: 8500,
        transactionLimit: 5000,
        apiCalls: 35000,
        apiCallLimit: 25000,
      },
      billing: {
        mrr: 0,
        lastPayment: "",
        nextBilling: "",
        status: "failed",
      },
      createdAt: "2023-11-20",
      lastActivity: "2024-01-10T12:00:00Z",
      health: "offline",
    },
  ];

  const mockGlobalKPIs: GlobalKPIs = {
    totalOrgs: 1247,
    activeOrgs: 1156,
    totalStores: 8934,
    totalRevenue: 145000,
    monthlyGrowth: 23.5,
    integrationUsage: {
      shopify: 45.2,
      woocommerce: 28.7,
      amazon: 15.8,
      flipkart: 10.3,
    },
    systemHealth: {
      uptime: 99.97,
      avgResponseTime: 245,
      errorRate: 0.02,
      activeIncidents: 2,
    },
  };

  const mockSystemAlerts: SystemAlert[] = [
    {
      id: "alert-001",
      type: "system",
      severity: "high",
      title: "API Rate Limit Approaching",
      description: "Global API rate limit at 85% capacity",
      affectedOrgs: ["All"],
      timestamp: "2024-01-18T15:30:00Z",
      resolved: false,
    },
    {
      id: "alert-002",
      type: "integration",
      severity: "medium",
      title: "Shopify Sync Delays",
      description:
        "Shopify integration experiencing 15% higher than normal sync times",
      affectedOrgs: ["tech-corp-001", "fashion-boutique-002"],
      timestamp: "2024-01-18T14:45:00Z",
      resolved: false,
    },
    {
      id: "alert-003",
      type: "billing",
      severity: "critical",
      title: "Payment Failures Spike",
      description: "45% increase in payment failures in last 24 hours",
      affectedOrgs: ["pharma-plus-004", "startup-xyz-005"],
      timestamp: "2024-01-18T12:20:00Z",
      resolved: true,
    },
  ];

  const getSubscriptionTierColor = (tier: string) => {
    switch (tier) {
      case "free":
        return "bg-gray-500";
      case "pro":
        return "bg-blue-500";
      case "enterprise":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "trial":
        return "bg-blue-500";
      case "suspended":
        return "bg-red-500";
      case "overdue":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredOrganizations = mockOrganizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.domain?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier =
      filterTier === "all" || org.subscriptionTier === filterTier;
    const matchesIndustry =
      filterIndustry === "all" || org.industry === filterIndustry;
    const matchesStatus = filterStatus === "all" || org.status === filterStatus;

    return matchesSearch && matchesTier && matchesIndustry && matchesStatus;
  });

  const handleOrgAction = (action: string, orgId: string) => {
    console.log(`Action: ${action} for org: ${orgId}`);
    // TODO: Implement actual actions
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="p-6 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Super Admin Console
          </h1>
          <p className="text-gray-600">
            Complete visibility and control across all organizations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search organizations, stores, or integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterTier} onValueChange={setFilterTier}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterIndustry} onValueChange={setFilterIndustry}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="fnb">F&B</SelectItem>
            <SelectItem value="pharma">Pharma</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="services">Services</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="analytics">Global Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">System Health</TabsTrigger>
          <TabsTrigger value="billing">Billing & Usage</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="rbac">RBAC</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-6">
          {/* Global KPIs Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Organizations
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(mockGlobalKPIs.totalOrgs)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockGlobalKPIs.activeOrgs} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Stores
                </CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(mockGlobalKPIs.totalStores)}
                </div>
                <p className="text-xs text-muted-foreground">Across all orgs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(mockGlobalKPIs.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{mockGlobalKPIs.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Uptime
                </CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockGlobalKPIs.systemHealth.uptime}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockGlobalKPIs.systemHealth.activeIncidents} incidents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Integration
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Shopify</div>
                <p className="text-xs text-muted-foreground">
                  {mockGlobalKPIs.integrationUsage.shopify}% usage
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Response Time
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockGlobalKPIs.systemHealth.avgResponseTime}ms
                </div>
                <p className="text-xs text-muted-foreground">Average global</p>
              </CardContent>
            </Card>
          </div>

          {/* Organizations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Management</CardTitle>
              <CardDescription>
                Complete overview of all organizations with subscription details
                and health status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Stores</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Integrations</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>MRR</TableHead>
                      <TableHead>Health</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{org.name}</div>
                            <div className="text-sm text-gray-500">
                              {org.domain}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className={`${getStatusColor(org.status)} text-white border-none text-xs`}
                              >
                                {org.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {org.industry}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getSubscriptionTierColor(org.subscriptionTier)} text-white`}
                          >
                            {org.subscriptionTier.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-gray-500" />
                            {org.storeCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            {org.userCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {org.activeIntegrations.map((integration) => (
                              <Badge
                                key={integration}
                                variant="secondary"
                                className="text-xs"
                              >
                                {integration}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              SKUs: {formatNumber(org.usage.skus)}/
                              {formatNumber(org.usage.skuLimit)}
                            </div>
                            <Progress
                              value={
                                (org.usage.skus / org.usage.skuLimit) * 100
                              }
                              className="h-1"
                            />
                            <div className="text-xs text-gray-500">
                              API:{" "}
                              {Math.round(
                                (org.usage.apiCalls / org.usage.apiCallLimit) *
                                  100,
                              )}
                              %
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {org.billing.mrr > 0
                              ? formatCurrency(org.billing.mrr)
                              : "Free"}
                          </div>
                          <div
                            className={`text-xs ${org.billing.status === "paid" ? "text-green-600" : "text-red-600"}`}
                          >
                            {org.billing.status}
                          </div>
                        </TableCell>
                        <TableCell>{getHealthIcon(org.health)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleOrgAction("view", org.id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOrgAction("impersonate", org.id)
                                }
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Impersonate Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOrgAction("edit-subscription", org.id)
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Subscription
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOrgAction("reset-api-keys", org.id)
                                }
                              >
                                <Key className="h-4 w-4 mr-2" />
                                Reset API Keys
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {org.status === "active" ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOrgAction("suspend", org.id)
                                  }
                                  className="text-red-600"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend Org
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOrgAction("activate", org.id)
                                  }
                                  className="text-green-600"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate Org
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Integration Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Usage Distribution</CardTitle>
                <CardDescription>
                  Platform adoption across organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Shopify
                    </span>
                    <span className="font-medium">
                      {mockGlobalKPIs.integrationUsage.shopify}%
                    </span>
                  </div>
                  <Progress value={mockGlobalKPIs.integrationUsage.shopify} />

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      WooCommerce
                    </span>
                    <span className="font-medium">
                      {mockGlobalKPIs.integrationUsage.woocommerce}%
                    </span>
                  </div>
                  <Progress
                    value={mockGlobalKPIs.integrationUsage.woocommerce}
                  />

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Amazon
                    </span>
                    <span className="font-medium">
                      {mockGlobalKPIs.integrationUsage.amazon}%
                    </span>
                  </div>
                  <Progress value={mockGlobalKPIs.integrationUsage.amazon} />

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Flipkart
                    </span>
                    <span className="font-medium">
                      {mockGlobalKPIs.integrationUsage.flipkart}%
                    </span>
                  </div>
                  <Progress value={mockGlobalKPIs.integrationUsage.flipkart} />
                </div>
              </CardContent>
            </Card>

            {/* Industry Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
                <CardDescription>Organizations by vertical</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Retail</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <Progress value={35} />

                  <div className="flex justify-between items-center">
                    <span>Manufacturing</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <Progress value={28} />

                  <div className="flex justify-between items-center">
                    <span>F&B</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <Progress value={20} />

                  <div className="flex justify-between items-center">
                    <span>Pharma</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <Progress value={12} />

                  <div className="flex justify-between items-center">
                    <span>Services</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <Progress value={5} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>
                Monthly recurring revenue and growth trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(mockGlobalKPIs.totalRevenue)}
                  </div>
                  <div className="text-sm text-gray-600">Total MRR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    +{mockGlobalKPIs.monthlyGrowth}%
                  </div>
                  <div className="text-sm text-gray-600">Monthly Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(116)}
                  </div>
                  <div className="text-sm text-gray-600">ARPU</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    92.5%
                  </div>
                  <div className="text-sm text-gray-600">Retention Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Uptime
                </CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockGlobalKPIs.systemHealth.uptime}%
                </div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Response Time
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockGlobalKPIs.systemHealth.avgResponseTime}ms
                </div>
                <p className="text-xs text-muted-foreground">Average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Error Rate
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockGlobalKPIs.systemHealth.errorRate}%
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Incidents
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {mockGlobalKPIs.systemHealth.activeIncidents}
                </div>
                <p className="text-xs text-muted-foreground">Ongoing</p>
              </CardContent>
            </Card>
          </div>

          {/* Service Status */}
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>
                Real-time status of all system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">API Gateway</div>
                      <div className="text-sm text-gray-600">
                        All regions operational
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">Operational</Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Database Cluster</div>
                      <div className="text-sm text-gray-600">
                        Primary and replica healthy
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">Operational</Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Integration Services</div>
                      <div className="text-sm text-gray-600">
                        Shopify sync experiencing delays
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500 text-white">Degraded</Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">File Storage</div>
                      <div className="text-sm text-gray-600">
                        CDN performing normally
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white">Operational</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* Billing Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total MRR</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(mockGlobalKPIs.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{mockGlobalKPIs.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overdue Accounts
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">23</div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(12400)} at risk
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trial Conversions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">78.5%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Churn Rate
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">7.5%</div>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Limit Alerts</CardTitle>
              <CardDescription>
                Organizations approaching or exceeding their plan limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrganizations
                  .filter((org) => org.usage.skus / org.usage.skuLimit > 0.8)
                  .map((org) => (
                    <div
                      key={org.id}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{org.name}</div>
                        <div className="text-sm text-gray-600">
                          {Math.round(
                            (org.usage.skus / org.usage.skuLimit) * 100,
                          )}
                          % of SKU limit used
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-yellow-50">
                          Upsell Opportunity
                        </Badge>
                        <Button size="sm">Contact</Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Alerts Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Alerts
                </CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {mockSystemAlerts.filter((alert) => !alert.resolved).length}
                </div>
                <p className="text-xs text-muted-foreground">Unresolved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {
                    mockSystemAlerts.filter(
                      (alert) =>
                        alert.severity === "critical" && !alert.resolved,
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">High priority</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Resolved Today
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockSystemAlerts.filter((alert) => alert.resolved).length}
                </div>
                <p className="text-xs text-muted-foreground">Fixed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Resolution
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.5h</div>
                <p className="text-xs text-muted-foreground">Time to resolve</p>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Real-time alerts across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSystemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex justify-between items-start p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Badge
                        className={`${getSeverityColor(alert.severity)} text-white mt-1`}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {alert.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Affected: {alert.affectedOrgs.join(", ")} •
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {alert.resolved ? (
                        <Badge className="bg-green-500 text-white">
                          Resolved
                        </Badge>
                      ) : (
                        <Button size="sm">Resolve</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Audit Logs
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3M</div>
                <p className="text-xs text-muted-foreground">
                  Events logged today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Data Exports
                </CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Compliance Score
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">98.5%</div>
                <p className="text-xs text-muted-foreground">GDPR compliant</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Compliance Activity</CardTitle>
              <CardDescription>
                Latest data access and export requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Data Export Request</div>
                    <div className="text-sm text-gray-600">
                      TechCorp Solutions - Full user data
                    </div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                  <Badge className="bg-blue-500 text-white">Processing</Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Account Deletion</div>
                    <div className="text-sm text-gray-600">
                      StartupXYZ - Complete data removal
                    </div>
                    <div className="text-xs text-gray-500">Yesterday</div>
                  </div>
                  <Badge className="bg-green-500 text-white">Completed</Badge>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Audit Trail Access</div>
                    <div className="text-sm text-gray-600">
                      Fashion Boutique - 6 month history
                    </div>
                    <div className="text-xs text-gray-500">3 days ago</div>
                  </div>
                  <Badge className="bg-green-500 text-white">Delivered</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rbac" className="space-y-6">
          <RBACEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
