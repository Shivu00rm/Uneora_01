import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Store,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Settings,
  Plus,
  Eye,
  BarChart3,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

// Mock data for demonstration
const mockDashboardData = {
  summary: {
    totalRevenue: 2850000,
    totalOrders: 3420,
    averageOrderValue: 833,
    totalStores: 3,
    activeEcommercePlatforms: 3,
    totalUsers: 24,
    criticalAlerts: 12
  },
  stores: [
    {
      id: "store-1",
      name: "Downtown Store",
      code: "DS001",
      type: "physical",
      status: "active",
      revenue: 1200000,
      orders: 1250,
      growth: 15.2,
      staff: 8,
      alerts: 3,
      manager: "Rajesh Kumar",
      lastActivity: "2024-01-15T10:30:00Z"
    },
    {
      id: "store-2", 
      name: "Mall Outlet",
      code: "MO001",
      type: "physical",
      status: "active",
      revenue: 720000,
      orders: 895,
      growth: 22.8,
      staff: 6,
      alerts: 1,
      manager: "Priya Sharma",
      lastActivity: "2024-01-15T09:45:00Z"
    },
    {
      id: "store-3",
      name: "Online Store",
      code: "OS001", 
      type: "online",
      status: "active",
      revenue: 930000,
      orders: 1275,
      growth: 35.4,
      staff: 4,
      alerts: 8,
      manager: "Amit Patel",
      lastActivity: "2024-01-15T11:00:00Z"
    }
  ],
  ecommercePlatforms: [
    {
      id: "platform-1",
      name: "Main Shopify Store",
      platform: "shopify",
      status: "connected",
      revenue: 520000,
      orders: 650,
      lastSync: "2024-01-15T10:30:00Z",
      errors: 0
    },
    {
      id: "platform-2",
      name: "Amazon Seller Account", 
      platform: "amazon",
      status: "connected",
      revenue: 280000,
      orders: 425,
      lastSync: "2024-01-15T09:00:00Z",
      errors: 1
    },
    {
      id: "platform-3",
      name: "Website Store",
      platform: "woocommerce",
      status: "error",
      revenue: 130000,
      orders: 200,
      lastSync: "2024-01-14T18:00:00Z",
      errors: 3
    }
  ],
  recentActivity: [
    {
      id: "1",
      type: "order",
      message: "New order #ORD-1234 received from Downtown Store",
      timestamp: "2024-01-15T11:30:00Z",
      storeId: "store-1"
    },
    {
      id: "2",
      type: "alert",
      message: "Low stock alert for Wireless Headphones in Mall Outlet",
      timestamp: "2024-01-15T11:15:00Z",
      storeId: "store-2"
    },
    {
      id: "3",
      type: "sync",
      message: "Shopify sync completed successfully",
      timestamp: "2024-01-15T11:00:00Z",
      storeId: "store-3"
    },
    {
      id: "4",
      type: "user",
      message: "New cashier added to Downtown Store",
      timestamp: "2024-01-15T10:45:00Z",
      storeId: "store-1"
    }
  ],
  quickStats: {
    todaysOrders: 127,
    pendingShipments: 43,
    lowStockItems: 25,
    syncErrors: 4
  }
};

type ViewMode = "cards" | "bar" | "pie";

export default function OrgAdminDashboard() {
  const { isOrgAdmin, hasPermission } = useAuth();
  const [data] = useState(mockDashboardData);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [storesView, setStoresView] = useState<ViewMode>("cards");
  const [channelsView, setChannelsView] = useState<ViewMode>("cards");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        {Math.abs(growth).toFixed(1)}%
      </span>
    );
  };

  const getStoreStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'shopify': return <ShoppingCart className="h-5 w-5 text-green-600" />;
      case 'amazon': return <Package className="h-5 w-5 text-orange-600" />;
      case 'woocommerce': return <Globe className="h-5 w-5 text-purple-600" />;
      default: return <Globe className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'sync': return <RefreshCw className="h-4 w-4 text-green-500" />;
      case 'user': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isOrgAdmin()) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">You don't have permission to view the organization dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Dashboard</h1>
          <p className="text-gray-600">Multi-store overview and management</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link to="/app/stores">
              <Settings className="h-4 w-4 mr-2" />
              Manage Stores
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +18.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalStores}</div>
            <p className="text-xs text-muted-foreground">
              All operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Channels</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.activeEcommercePlatforms}</div>
            <p className="text-xs text-muted-foreground">
              E-commerce platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.quickStats.todaysOrders}</div>
            <p className="text-xs text-muted-foreground">
              Active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Across all stores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data.summary.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stores" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stores">Store Performance</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce Channels</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-6">
          {/* Store Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.stores.map((store) => (
              <Card key={store.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {store.type === "physical" ? <Store className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                          {store.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{store.code}</span>
                          {getStoreStatusIcon(store.status)}
                          <Badge variant="outline" className="capitalize">
                            {store.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/app/store/${store.id}/dashboard`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(store.revenue)}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                      <div className="text-sm">{formatGrowth(store.growth)}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{store.orders}</div>
                      <div className="text-sm text-gray-600">Orders</div>
                      <div className="text-sm text-green-600">
                        AOV: {formatCurrency(store.revenue / store.orders)}
                      </div>
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manager</span>
                      <span className="font-medium">{store.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Staff</span>
                      <span className="font-medium">{store.staff} members</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alerts</span>
                      <span className={`font-medium ${store.alerts > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {store.alerts} active
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Activity</span>
                      <span className="font-medium">
                        {new Date(store.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/app/store/${store.id}/inventory`}>
                        Inventory
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/app/store/${store.id}/analytics`}>
                        Analytics
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Store */}
          <Card className="border-dashed border-2 hover:border-gray-400 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Store className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Store</h3>
              <p className="text-gray-500 text-center mb-4">
                Expand your business by adding a new physical or online store location
              </p>
              <Button asChild>
                <Link to="/app/stores/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Store
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-6">
          {/* E-commerce Platform Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.ecommercePlatforms.map((platform) => (
              <Card key={platform.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(platform.platform)}
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{platform.platform}</span>
                          <Badge
                            variant={platform.status === "connected" ? "default" : "destructive"}
                          >
                            {platform.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xl font-bold">{formatCurrency(platform.revenue)}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{platform.orders}</div>
                      <div className="text-sm text-gray-600">Orders</div>
                    </div>
                  </div>

                  {/* Sync Status */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Sync</span>
                      <span className="font-medium">
                        {new Date(platform.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sync Errors</span>
                      <span className={`font-medium ${platform.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {platform.errors} errors
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Platform */}
          <Card className="border-dashed border-2 hover:border-gray-400 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect E-commerce Platform</h3>
              <p className="text-gray-500 text-center mb-4">
                Integrate with Shopify, Amazon, WooCommerce, or other platforms
              </p>
              <Button asChild>
                <Link to="/app/ecommerce/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Platform
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest events across all stores and channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.message}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {data.stores.find(s => s.id === activity.storeId)?.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Store className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">Manage Stores</h3>
                <p className="text-sm text-gray-600 mb-4">Add, edit, or configure store locations</p>
                <Button asChild className="w-full">
                  <Link to="/app/stores">Manage</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="font-semibold mb-2">Team Management</h3>
                <p className="text-sm text-gray-600 mb-4">Manage users and permissions</p>
                <Button asChild className="w-full">
                  <Link to="/app/team">Manage Team</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Globe className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">E-commerce</h3>
                <p className="text-sm text-gray-600 mb-4">Manage online platform integrations</p>
                <Button asChild className="w-full">
                  <Link to="/app/ecommerce">Manage</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center text-center p-6">
                <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-gray-600 mb-4">View consolidated performance data</p>
                <Button asChild className="w-full">
                  <Link to="/app/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>At-a-glance metrics for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.quickStats.todaysOrders}</div>
                  <div className="text-sm text-gray-600">Today's Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{data.quickStats.pendingShipments}</div>
                  <div className="text-sm text-gray-600">Pending Shipments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{data.quickStats.lowStockItems}</div>
                  <div className="text-sm text-gray-600">Low Stock Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{data.quickStats.syncErrors}</div>
                  <div className="text-sm text-gray-600">Sync Errors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
