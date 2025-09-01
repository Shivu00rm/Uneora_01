import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSuperAdmin } from "@/contexts/SuperAdminContext";
import { InvoiceTemplate } from "@/components/InvoiceTemplate";
import { PlatformAlerts } from "@/components/PlatformAlerts";
import AdminUsers from "@/components/super-admin/AdminUsers";
import TenantIntegrations from "@/components/super-admin/TenantIntegrations";
import AuditCenter from "@/components/super-admin/AuditCenter";
import ErrorCenter from "@/components/super-admin/ErrorCenter";
import {
  Shield,
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Activity,
  Search,
  Settings,
  Eye,
  Ban,
  Crown,
  Zap,
  BarChart3,
  Globe,
  Clock,
  RefreshCw,
  RotateCcw,
  Mail,
  Download,
  History,
} from "lucide-react";

export default function SuperAdmin() {
  const {
    organizations,
    systemMetrics,
    isSuperAdmin,
    recentPlanChanges,
    updateOrganizationPlan,
    suspendOrganization,
    reactivateOrganization,
  } = useSuperAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [isOrgDetailsOpen, setIsOrgDetailsOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [planChangeMessage, setPlanChangeMessage] = useState("");

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = selectedPlan === "all" || org.plan === selectedPlan;
    const matchesStatus =
      selectedStatus === "all" || org.status === selectedStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "trial":
        return "secondary";
      case "suspended":
        return "destructive";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "starter":
        return "outline";
      case "growth":
        return "secondary";
      case "pro":
        return "default";
      case "enterprise":
        return "default";
      default:
        return "outline";
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-emerald-500";
      case "warning":
        return "text-yellow-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const handleViewOrganization = (org: any) => {
    setSelectedOrg(org);
    setIsOrgDetailsOpen(true);
  };

  const handleSendInvoice = (org: any) => {
    setSelectedOrg(org);
    setIsInvoiceDialogOpen(true);
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `FS-${year}${month}-${random}`;
  };

  const handlePlanChange = (orgId: string, newPlan: string) => {
    const org = organizations.find((o) => o.id === orgId);
    if (org) {
      updateOrganizationPlan(orgId, newPlan);
      setPlanChangeMessage(
        `Plan updated: ${org.name} changed from ${org.plan} to ${newPlan}`,
      );
      setTimeout(() => setPlanChangeMessage(""), 5000);
    }
  };

  const handleReactivateOrganization = (orgId: string) => {
    reactivateOrganization(orgId);
  };

  const downloadInvoicePDF = () => {
    // In a real implementation, this would generate and download a PDF
    window.print();
  };

  const sendInvoiceEmail = () => {
    // In a real implementation, this would send the invoice via email
    alert(`Invoice sent to ${selectedOrg?.billingEmail || selectedOrg?.name}`);
    setIsInvoiceDialogOpen(false);
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Crown className="h-8 w-8 text-primary" />
            FlowStock Super Admin
          </h1>
          <p className="text-muted-foreground">
            Platform management console - billing, organizations, and system
            administration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/org-flows">
              <Activity className="mr-2 h-4 w-4" />
              Organization Health
            </a>
          </Button>
        </div>
      </div>

      {/* Plan Change Notification */}
      {planChangeMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{planChangeMessage}</span>
          </div>
        </div>
      )}

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Organizations
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics.totalOrganizations}
            </div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics.activeUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
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
              ₹{(systemMetrics.monthlyRevenue / 100000).toFixed(1)}L
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {systemMetrics.uptime}%
            </div>
            <p className="text-xs text-muted-foreground">Uptime this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Alerts */}
      <div className="mb-8">
        <PlatformAlerts />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="organizations" className="space-y-6 enhanced-tabs">
        <TabsList className="grid w-full grid-cols-8 bg-slate-100">
          <TabsTrigger
            value="organizations"
            className="tab-organizations text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Organizations
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="tab-billing text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Billing & Plans
            {recentPlanChanges.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {recentPlanChanges.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="api-keys"
            className="tab-api-keys text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            API Keys
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="tab-team text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Admin Team
          </TabsTrigger>
          <TabsTrigger value="users" className="tab-team">Users</TabsTrigger>
          <TabsTrigger value="integrations" className="tab-team">Integrations</TabsTrigger>
          <TabsTrigger value="audit" className="tab-errors">Audit</TabsTrigger>
          <TabsTrigger value="errors" className="tab-errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent
          value="organizations"
          className="space-y-6 tab-content-watermark flowstock-watermark"
        >
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search organizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Plans" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Organizations Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Organizations ({filteredOrganizations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {org.domain}
                          </div>
                          {org.customDomain && (
                            <Badge variant="outline" className="text-xs">
                              <Globe className="h-3 w-3 mr-1" />
                              Custom Domain
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPlanColor(org.plan)}>
                          {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(org.status)}>
                          {org.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {org.users}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          ₹{org.monthlyRevenue.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center gap-1 ${getHealthColor(org.health)}`}
                        >
                          {org.health === "healthy" && (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          {org.health === "warning" && (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          {org.health === "critical" && (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          {org.health}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(org.lastActivity).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrganization(org)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {org.status === "suspended" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleReactivateOrganization(org.id)
                              }
                              className="text-emerald-600 hover:text-emerald-700"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => suspendOrganization(org.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="billing"
          className="space-y-6 tab-content-watermark flowstock-watermark"
        >
          {/* Recent Plan Changes */}
          {recentPlanChanges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Plan Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPlanChanges.slice(0, 5).map((change, index) => {
                    const org = organizations.find(
                      (o) => o.id === change.orgId,
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <div className="font-medium">{org?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Changed from{" "}
                            <Badge variant="outline">{change.oldPlan}</Badge> to{" "}
                            <Badge variant="default">{change.newPlan}</Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          <div>
                            {new Date(change.timestamp).toLocaleDateString()}
                          </div>
                          <div>by {change.adminName}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Enterprise Plans</span>
                    <span className="font-medium">₹3.2L (65%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Pro Plans</span>
                    <span className="font-medium">₹1.5L (30%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "30%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Growth Plans</span>
                    <span className="font-medium">₹25K (5%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: "5%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Fashion Boutique</div>
                      <div className="text-sm text-muted-foreground">
                        Payment overdue: ₹2,999
                      </div>
                    </div>
                    <Badge variant="destructive">15 days</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">StartupXYZ</div>
                      <div className="text-sm text-muted-foreground">
                        Trial expiring soon
                      </div>
                    </div>
                    <Badge variant="secondary">3 days</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6"><AdminUsers/></TabsContent>
        <TabsContent value="integrations" className="space-y-6"><TenantIntegrations/></TabsContent>
        <TabsContent value="audit" className="space-y-6"><AuditCenter/></TabsContent>
        <TabsContent value="errors" className="space-y-6"><ErrorCenter/></TabsContent>

        <TabsContent
          value="api-keys"
          className="space-y-6 tab-content-watermark flowstock-watermark"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                System API Keys & Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cloudflare-key">Cloudflare R2 API Key</Label>
                  <Input
                    id="cloudflare-key"
                    type="password"
                    placeholder="••••••••••••••••"
                    defaultValue="cf-key-abc123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="••••••••••••••••"
                    defaultValue="sk-abc123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razorpay-key">Razorpay API Key</Label>
                  <Input
                    id="razorpay-key"
                    type="password"
                    placeholder="••••••••••••••••"
                    defaultValue="rzp_live_abc123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-key">WhatsApp Business API</Label>
                  <Input
                    id="whatsapp-key"
                    type="password"
                    placeholder="••••••••••••••••"
                    defaultValue="wa-token-abc123"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-2">
                <Button>Update API Keys</Button>
                <Button variant="outline">Test Connections</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="team"
          className="space-y-6 tab-content-watermark flowstock-watermark"
        >
          <Card>
            <CardHeader>
              <CardTitle>Admin Team Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">System Owner</div>
                      <div className="text-sm text-muted-foreground">
                        owner@flowstock.com
                      </div>
                    </div>
                  </div>
                  <Badge variant="default">Super Admin</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">John Developer</div>
                      <div className="text-sm text-muted-foreground">
                        john@flowstock.com
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Platform Dev</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium">Sarah Data Engineer</div>
                      <div className="text-sm text-muted-foreground">
                        sarah@flowstock.com
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">Data Engineer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Organization Details Modal */}
      <Dialog open={isOrgDetailsOpen} onOpenChange={setIsOrgDetailsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Organization Details</DialogTitle>
            <DialogDescription>
              Complete overview and management for {selectedOrg?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedOrg && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Name:
                      </span>
                      <span className="font-medium">{selectedOrg.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Domain:
                      </span>
                      <span className="font-medium">{selectedOrg.domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Plan:
                      </span>
                      <Badge variant={getPlanColor(selectedOrg.plan)}>
                        {selectedOrg.plan}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Users:
                      </span>
                      <span className="font-medium">{selectedOrg.users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Monthly Revenue:
                      </span>
                      <span className="font-medium">
                        ₹{selectedOrg.monthlyRevenue.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Usage Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Data Usage:
                      </span>
                      <span className="font-medium">
                        {selectedOrg.dataUsage} GB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        API Calls:
                      </span>
                      <span className="font-medium">
                        {selectedOrg.apiCalls.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Health Status:
                      </span>
                      <Badge
                        variant={
                          selectedOrg.health === "healthy"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {selectedOrg.health}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Activity:
                      </span>
                      <span className="font-medium">
                        {new Date(
                          selectedOrg.lastActivity,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="plan-select">Change Plan:</Label>
                    <Select
                      defaultValue={selectedOrg.plan}
                      onValueChange={(value) =>
                        handlePlanChange(selectedOrg.id, value)
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">
                          Starter - ₹999/month
                        </SelectItem>
                        <SelectItem value="growth">
                          Growth - ₹2,999/month
                        </SelectItem>
                        <SelectItem value="pro">Pro - ₹9,999/month</SelectItem>
                        <SelectItem value="enterprise">
                          Enterprise - ₹25,000/month
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleSendInvoice(selectedOrg)}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invoice
                    </Button>
                    <Button variant="outline">Apply Credit</Button>
                    {selectedOrg.status === "suspended" ? (
                      <Button
                        variant="default"
                        onClick={() =>
                          handleReactivateOrganization(selectedOrg.id)
                        }
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reactivate Account
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => suspendOrganization(selectedOrg.id)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend Account
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Invoice - {selectedOrg?.name}</DialogTitle>
            <DialogDescription>
              Preview and send invoice to {selectedOrg?.billingEmail}
            </DialogDescription>
          </DialogHeader>

          {selectedOrg && (
            <div className="space-y-6">
              <InvoiceTemplate
                organization={{
                  ...selectedOrg,
                  billingEmail:
                    selectedOrg.billingEmail || `billing@${selectedOrg.domain}`,
                }}
                invoiceNumber={generateInvoiceNumber()}
                issueDate={new Date().toISOString()}
                dueDate={new Date(
                  Date.now() + 15 * 24 * 60 * 60 * 1000,
                ).toISOString()}
                adminName="System Owner"
              />

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={sendInvoiceEmail} className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invoice via Email
                </Button>
                <Button variant="outline" onClick={downloadInvoicePDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsInvoiceDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
