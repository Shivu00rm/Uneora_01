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
import { useSuperAdminData } from "@/hooks/useSuperAdminData";
import { format } from "date-fns";

// Types for analytics data
interface SalesMetrics {
  daily: number;
  weekly: number;
  monthly: number;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  store?: string;
  channel?: string;
}

interface InventoryAlert {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  storeId: string;
  storeName: string;
  severity: "critical" | "warning" | "low";
}

interface ActiveUserMetrics {
  role: string;
  count: number;
  lastActive: string;
  growth: number;
}

interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  organizationId: string;
  organizationName: string;
}

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
  const [loading, setLoading] = useState(false);
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
  const [retryCount, setRetryCount] = useState(0);

  // Mock data - replace with actual API calls
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics>({
    daily: 45000,
    weekly: 285000,
    monthly: 1245000,
    growth: { daily: 12.5, weekly: 8.3, monthly: 15.7 },
  });

  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { date: "2024-01-01", revenue: 42000, orders: 156 },
    { date: "2024-01-02", revenue: 38000, orders: 142 },
    { date: "2024-01-03", revenue: 51000, orders: 189 },
    { date: "2024-01-04", revenue: 47000, orders: 167 },
    { date: "2024-01-05", revenue: 54000, orders: 203 },
    { date: "2024-01-06", revenue: 62000, orders: 234 },
    { date: "2024-01-07", revenue: 59000, orders: 221 },
  ]);

  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([
    {
      id: "1",
      productName: "Samsung Galaxy A54",
      sku: "SAM-A54-128",
      currentStock: 5,
      reorderLevel: 20,
      storeId: "store-001",
      storeName: "Delhi Main Store",
      severity: "critical",
    },
    {
      id: "2",
      productName: "Apple iPhone 15",
      sku: "APL-IP15-256",
      currentStock: 12,
      reorderLevel: 25,
      storeId: "store-002",
      storeName: "Mumbai Central",
      severity: "warning",
    },
    {
      id: "3",
      productName: "OnePlus 11",
      sku: "OPL-11-256",
      currentStock: 8,
      reorderLevel: 15,
      storeId: "store-001",
      storeName: "Delhi Main Store",
      severity: "low",
    },
  ]);

  const [activeUsers, setActiveUsers] = useState<ActiveUserMetrics[]>([
    { role: "Super Admin", count: 12, lastActive: "2 minutes ago", growth: 5.2 },
    { role: "Org Admin", count: 156, lastActive: "5 minutes ago", growth: 12.8 },
    { role: "Store Manager", count: 489, lastActive: "1 minute ago", growth: 8.1 },
    { role: "Cashier", count: 1247, lastActive: "30 seconds ago", growth: 15.3 },
    { role: "Online Ops", count: 78, lastActive: "3 minutes ago", growth: -2.1 },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: "1",
      userId: "user-001",
      userName: "John Smith",
      role: "Org Admin",
      action: "CREATE_STORE",
      module: "Store Management",
      details: "Created new store: Bangalore Tech Hub",
      timestamp: "2024-01-15T10:30:00Z",
      organizationId: "org-001",
      organizationName: "TechCorp Solutions",
    },
    {
      id: "2",
      userId: "user-002",
      userName: "Sarah Johnson",
      role: "Super Admin",
      action: "SUSPEND_ORGANIZATION",
      module: "Organization Management",
      details: "Suspended organization due to payment failure",
      timestamp: "2024-01-15T09:45:00Z",
      organizationId: "org-002",
      organizationName: "RetailCorp Inc",
    },
    {
      id: "3",
      userId: "user-003",
      userName: "Mike Chen",
      role: "Store Manager",
      action: "INVENTORY_ADJUSTMENT",
      module: "Inventory Management",
      details: "Adjusted stock for iPhone 15: +50 units",
      timestamp: "2024-01-15T09:15:00Z",
      organizationId: "org-001",
      organizationName: "TechCorp Solutions",
    },
  ]);

  // Data fetching functions
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, fetch data based on filters
      // const response = await fetch('/api/super-admin/analytics', {
      //   method: 'POST',
      //   body: JSON.stringify({ dateRange, store: selectedStore, channel: selectedChannel })
      // });
      
      setRetryCount(0);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
      toast({
        title: "Failed to load analytics",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      // Simulate API call for audit logs
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Apply filters to audit logs
      let filteredLogs = auditLogs;
      
      if (auditFilters.search) {
        filteredLogs = filteredLogs.filter(log =>
          log.userName.toLowerCase().includes(auditFilters.search.toLowerCase()) ||
          log.action.toLowerCase().includes(auditFilters.search.toLowerCase()) ||
          log.module.toLowerCase().includes(auditFilters.search.toLowerCase())
        );
      }
      
      if (auditFilters.role !== "all") {
        filteredLogs = filteredLogs.filter(log => log.role === auditFilters.role);
      }
      
      // In real implementation, this would be server-side filtering
      
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    }
  };

  // Export functions
  const exportAnalyticsData = async (format: "csv" | "pdf") => {
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      
      if (format === "csv") {
        // Generate CSV
        const csvData = revenueData.map(item => ({
          Date: item.date,
          Revenue: item.revenue,
          Orders: item.orders,
        }));
        
        const csv = [
          Object.keys(csvData[0]).join(","),
          ...csvData.map(row => Object.values(row).join(","))
        ].join("\n");
        
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
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
        const csvData = auditLogs.map(log => ({
          "User ID": log.userId,
          "User Name": log.userName,
          Role: log.role,
          Action: log.action,
          Module: log.module,
          Details: log.details,
          Timestamp: log.timestamp,
          Organization: log.organizationName,
        }));
        
        const csv = [
          Object.keys(csvData[0]).join(","),
          ...csvData.map(row => Object.values(row).map(v => `"${v}"`).join(","))
        ].join("\n");
        
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
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

  // Effects
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedStore, selectedChannel]);

  useEffect(() => {
    fetchAuditLogs();
  }, [auditFilters]);

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

  if (loading && retryCount === 0) {
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
            onClick={() => fetchAnalyticsData()}
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

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderMetricCard(
              "Daily Sales",
              `₹${salesMetrics.daily.toLocaleString()}`,
              salesMetrics.growth.daily,
              <DollarSign className="h-4 w-4 text-green-600" />,
              "green",
              loading
            )}
            {renderMetricCard(
              "Weekly Revenue",
              `₹${salesMetrics.weekly.toLocaleString()}`,
              salesMetrics.growth.weekly,
              <TrendingUp className="h-4 w-4 text-green-600" />,
              "green",
              loading
            )}
            {renderMetricCard(
              "Monthly Revenue",
              `₹${salesMetrics.monthly.toLocaleString()}`,
              salesMetrics.growth.monthly,
              <ShoppingCart className="h-4 w-4 text-green-600" />,
              "green",
              loading
            )}
            {renderMetricCard(
              "Low Stock Alerts",
              inventoryAlerts.length,
              -5.2,
              <AlertTriangle className="h-4 w-4 text-orange-600" />,
              "orange",
              loading
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-80 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={CHART_COLORS.revenue}
                        fill={CHART_COLORS.revenue}
                        fillOpacity={0.3}
                        name="Revenue (₹)"
                      />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        stroke={CHART_COLORS.users}
                        fill={CHART_COLORS.users}
                        fillOpacity={0.3}
                        name="Orders"
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
                <Badge variant="outline">{auditLogs.length} entries</Badge>
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
                  Showing 1 to {auditLogs.length} of {auditLogs.length} entries
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
