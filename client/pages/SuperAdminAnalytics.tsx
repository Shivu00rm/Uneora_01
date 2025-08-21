import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  FileText,
  Eye,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  useAnalyticsData,
  useAuditLogs,
  exportAnalyticsCSV,
  exportAuditLogsCSV,
  type SalesMetrics,
  type RevenueData,
  type InventoryAlert,
  type ActiveUserMetrics,
  type AuditLogEntry,
} from "@/hooks/useAnalyticsData";
import { format } from "date-fns";

// Color schemes for charts
const CHART_COLORS = {
  sales: "#10B981", // Green
  revenue: "#059669", // Dark green
  inventory: {
    critical: "#DC2626", // Red
    warning: "#D97706", // Orange
    normal: "#10B981", // Green
  },
  users: "#3B82F6", // Blue
  growth: "#8B5CF6", // Purple
};

const SEVERITY_COLORS = {
  critical: "destructive",
  warning: "secondary",
  low: "outline",
} as const;

export default function SuperAdminAnalytics() {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [auditFilters, setAuditFilters] = useState({
    search: "",
    role: "all",
    action: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Use custom hooks for data
  const {
    loading,
    error,
    salesMetrics,
    revenueData,
    inventoryAlerts,
    activeUsers,
    refetch: refetchAnalytics,
  } = useAnalyticsData({
    dateRange,
    store: selectedStore,
    channel: selectedChannel,
  });

  const {
    loading: auditLoading,
    auditLogs,
    totalCount: auditTotalCount,
    refetch: refetchAuditLogs,
  } = useAuditLogs(auditFilters);

  // Refresh function
  const handleRefresh = () => {
    refetchAnalytics();
    refetchAuditLogs();
  };

  // Export functions
  const exportAnalyticsData = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

      if (format === "csv") {
        exportAnalyticsCSV(revenueData, `analytics-${format(new Date(), "yyyy-MM-dd")}.csv`);
      } else {
        // For PDF, you would typically use a library like jsPDF
        toast({
          title: "PDF Export",
          description: "PDF export functionality would be implemented here with jsPDF or similar library.",
        });
      }

      toast({
        title: "Export successful",
        description: `Analytics data exported to ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please retry or contact support.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const exportAuditLogs = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (format === "csv") {
        exportAuditLogsCSV(auditLogs, `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`);
      } else {
        toast({
          title: "PDF Export",
          description: "PDF export functionality would be implemented here with jsPDF or similar library.",
        });
      }

      toast({
        title: "Audit logs exported",
        description: `Audit logs exported to ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please retry or contact support.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // Handle error state
  if (error && !loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load analytics data. Please try refreshing the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Date: ${label}`}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} style={{ color: item.color }}>
              {`${item.dataKey}: ${item.dataKey === 'revenue' ? '₹' : ''}${item.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderMetricCard = (
    title: string,
    value: string | number,
    growth: number,
    icon: React.ReactNode,
    color: string,
    isLoading: boolean = false
  ) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md bg-${color}-100`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {growth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={growth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(growth)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  if (loading && !salesMetrics) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Comprehensive business intelligence and compliance dashboard
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAnalyticsData("csv")}
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Preparing..." : "Export CSV"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAnalyticsData("pdf")}
            disabled={exporting}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="audit">Audit & Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <DatePickerWithRange
                    date={dateRange}
                    onDateChange={setDateRange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Store</Label>
                  <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      <SelectItem value="store-001">Delhi Main Store</SelectItem>
                      <SelectItem value="store-002">Mumbai Central</SelectItem>
                      <SelectItem value="store-003">Bangalore Tech Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="physical">Physical Stores</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Platform Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderMetricCard(
              "Customer Lifetime Value",
              "₹18,450",
              12.8,
              <Users className="h-4 w-4 text-blue-600" />,
              "blue",
              loading
            )}
            {renderMetricCard(
              "API Performance Score",
              "97.2%",
              2.1,
              <Zap className="h-4 w-4 text-green-600" />,
              "green",
              loading
            )}
            {renderMetricCard(
              "Data Storage Growth",
              "2.4TB",
              15.6,
              <Database className="h-4 w-4 text-purple-600" />,
              "purple",
              loading
            )}
            {renderMetricCard(
              "Feature Adoption Rate",
              "78.3%",
              8.4,
              <BarChart3 className="h-4 w-4 text-orange-600" />,
              "orange",
              loading
            )}
          </div>

          {/* Strategic Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Growth Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Platform Growth & Retention Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                      { month: "Jan", newOrgs: 42, churnedOrgs: 5, retentionRate: 94.2 },
                      { month: "Feb", newOrgs: 38, churnedOrgs: 3, retentionRate: 95.1 },
                      { month: "Mar", newOrgs: 51, churnedOrgs: 7, retentionRate: 93.8 },
                      { month: "Apr", newOrgs: 47, churnedOrgs: 4, retentionRate: 94.7 },
                      { month: "May", newOrgs: 54, churnedOrgs: 6, retentionRate: 94.1 },
                      { month: "Jun", newOrgs: 62, churnedOrgs: 8, retentionRate: 93.5 },
                      { month: "Jul", newOrgs: 59, churnedOrgs: 5, retentionRate: 94.3 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="newOrgs"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.3}
                        name="New Organizations"
                      />
                      <Area
                        type="monotone"
                        dataKey="churnedOrgs"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.3}
                        name="Churned Organizations"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Active Users Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Users by Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={activeUsers}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {activeUsers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Inventory Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{alert.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {alert.storeName} • Stock: {alert.currentStock}
                        </div>
                      </div>
                      <Badge variant={SEVERITY_COLORS[alert.severity]}>
                        {alert.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          {/* Audit Log Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Audit Log Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    placeholder="Search users, actions..."
                    value={auditFilters.search}
                    onChange={(e) => setAuditFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={auditFilters.role}
                    onValueChange={(value) => setAuditFilters(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Org Admin">Org Admin</SelectItem>
                      <SelectItem value="Store Manager">Store Manager</SelectItem>
                      <SelectItem value="Cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select
                    value={auditFilters.action}
                    onValueChange={(value) => setAuditFilters(prev => ({ ...prev, action: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="CREATE_STORE">Create Store</SelectItem>
                      <SelectItem value="SUSPEND_ORGANIZATION">Suspend Org</SelectItem>
                      <SelectItem value="INVENTORY_ADJUSTMENT">Inventory Adj</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportAuditLogs("csv")}
                    disabled={exporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportAuditLogs("pdf")}
                    disabled={exporting}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Log Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Audit Logs
                </span>
                <Badge variant="outline">{auditTotalCount} entries</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">User</th>
                      <th className="text-left p-3 font-medium">Role</th>
                      <th className="text-left p-3 font-medium">Action</th>
                      <th className="text-left p-3 font-medium">Module</th>
                      <th className="text-left p-3 font-medium">Details</th>
                      <th className="text-left p-3 font-medium">Timestamp</th>
                      <th className="text-left p-3 font-medium">Organization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, index) => (
                      <tr key={log.id} className={`border-b ${index % 2 === 0 ? 'bg-muted/5' : ''}`}>
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{log.userName}</div>
                            <div className="text-sm text-muted-foreground">{log.userId}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{log.role}</Badge>
                        </td>
                        <td className="p-3 font-mono text-sm">{log.action}</td>
                        <td className="p-3">{log.module}</td>
                        <td className="p-3 max-w-xs truncate" title={log.details}>
                          {log.details}
                        </td>
                        <td className="p-3 text-sm">
                          {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                        </td>
                        <td className="p-3 text-sm">{log.organizationName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing 1 to {auditLogs.length} of {auditTotalCount} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Loading/Error States */}
      {exporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <div>
                <div className="font-medium">Preparing file...</div>
                <div className="text-sm text-muted-foreground">
                  This may take a few moments for large datasets
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
