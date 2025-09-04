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
  BarChart3,
  TrendingUp,
  Store,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  Calendar,
  Eye,
  Globe,
  Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { ConsolidatedKPIs, StoreKPIs } from "@shared/api";

// Mock data for demonstration
const mockConsolidatedKPIs: ConsolidatedKPIs = {
  organizationId: "org-1",
  period: {
    start: "2024-01-01T00:00:00Z",
    end: "2024-01-31T23:59:59Z"
  },
  overall: {
    totalRevenue: 2850000,
    totalOrders: 3420,
    averageOrderValue: 833,
    totalStores: 3,
    activeEcommercePlatforms: 3
  },
  channels: {
    physical: {
      revenue: 1920000,
      orders: 2145,
      stores: 2
    },
    online: {
      revenue: 930000,
      orders: 1275,
      platforms: [
        { platform: "Shopify", revenue: 520000, orders: 650 },
        { platform: "Amazon", revenue: 280000, orders: 425 },
        { platform: "WooCommerce", revenue: 130000, orders: 200 }
      ]
    }
  },
  storePerformance: [
    {
      storeId: "store-1",
      storeName: "Downtown Store",
      period: { start: "2024-01-01T00:00:00Z", end: "2024-01-31T23:59:59Z" },
      sales: {
        revenue: 1200000,
        orders: 1250,
        averageOrderValue: 960,
        growth: { revenueGrowth: 15.2, ordersGrowth: 8.5 }
      },
      inventory: {
        totalProducts: 2500,
        totalValue: 1200000,
        lowStockItems: 45,
        outOfStockItems: 12,
        turnoverRate: 4.2
      },
      performance: {
        topSellingProducts: [
          { productId: "p1", name: "Wireless Headphones", quantity: 120, revenue: 48000 },
          { productId: "p2", name: "Smartphone Case", quantity: 180, revenue: 36000 },
          { productId: "p3", name: "Power Bank", quantity: 95, revenue: 28500 }
        ],
        hourlyPerformance: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          sales: Math.random() * 50000,
          orders: Math.floor(Math.random() * 25)
        }))
      }
    },
    {
      storeId: "store-2",
      storeName: "Mall Outlet",
      period: { start: "2024-01-01T00:00:00Z", end: "2024-01-31T23:59:59Z" },
      sales: {
        revenue: 720000,
        orders: 895,
        averageOrderValue: 805,
        growth: { revenueGrowth: 22.8, ordersGrowth: 18.2 }
      },
      inventory: {
        totalProducts: 1800,
        totalValue: 850000,
        lowStockItems: 23,
        outOfStockItems: 5,
        turnoverRate: 3.8
      },
      performance: {
        topSellingProducts: [
          { productId: "p4", name: "Fitness Tracker", quantity: 85, revenue: 34000 },
          { productId: "p5", name: "Bluetooth Speaker", quantity: 72, revenue: 28800 },
          { productId: "p6", name: "Tablet Stand", quantity: 110, revenue: 22000 }
        ],
        hourlyPerformance: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          sales: Math.random() * 35000,
          orders: Math.floor(Math.random() * 18)
        }))
      }
    },
    {
      storeId: "store-3",
      storeName: "Online Store",
      period: { start: "2024-01-01T00:00:00Z", end: "2024-01-31T23:59:59Z" },
      sales: {
        revenue: 930000,
        orders: 1275,
        averageOrderValue: 729,
        growth: { revenueGrowth: 35.4, ordersGrowth: 42.1 }
      },
      inventory: {
        totalProducts: 3200,
        totalValue: 1450000,
        lowStockItems: 67,
        outOfStockItems: 8,
        turnoverRate: 5.1
      },
      performance: {
        topSellingProducts: [
          { productId: "p7", name: "Laptop Sleeve", quantity: 245, revenue: 73500 },
          { productId: "p8", name: "USB-C Cable", quantity: 380, revenue: 38000 },
          { productId: "p9", name: "Webcam", quantity: 125, revenue: 62500 }
        ],
        hourlyPerformance: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          sales: Math.random() * 45000,
          orders: Math.floor(Math.random() * 30)
        }))
      }
    }
  ],
  inventory: {
    totalProducts: 7500,
    totalValue: 3500000,
    criticalStockAlerts: 135,
    syncStatus: {
      inSync: 7365,
      syncPending: 100,
      syncErrors: 35
    }
  }
};

export default function MultiStoreAnalytics() {
  const { hasPermission } = useAuth();
  const [kpis] = useState<ConsolidatedKPIs>(mockConsolidatedKPIs);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");

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

  const getStoreData = () => {
    if (selectedStore === "all") {
      return kpis.storePerformance;
    }
    return kpis.storePerformance.filter(store => store.storeId === selectedStore);
  };

  if (!hasPermission("multi_store_analytics", "view")) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">You don't have permission to view multi-store analytics.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Multi-Store Analytics</h1>
          <p className="text-gray-600">Consolidated performance insights across all channels</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {kpis.storePerformance.map(store => (
                <SelectItem key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stores">Store Performance</TabsTrigger>
          <TabsTrigger value="channels">Channel Analysis</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(kpis.overall.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatGrowth(18.5)} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.overall.totalOrders.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {formatGrowth(12.3)} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(kpis.overall.averageOrderValue)}</div>
                <p className="text-xs text-muted-foreground">
                  {formatGrowth(5.2)} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpis.overall.totalStores}</div>
                <p className="text-xs text-muted-foreground">
                  {kpis.overall.activeEcommercePlatforms} online channels
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(kpis.inventory.totalValue)}</div>
                <p className="text-xs text-muted-foreground">
                  {kpis.inventory.criticalStockAlerts} critical alerts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Channel Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Channel</CardTitle>
                <CardDescription>Physical vs Online performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        Physical Stores
                      </span>
                      <span className="font-medium">{formatCurrency(kpis.channels.physical.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(kpis.channels.physical.revenue / kpis.overall.totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">{kpis.channels.physical.orders} orders</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Online Channels
                      </span>
                      <span className="font-medium">{formatCurrency(kpis.channels.online.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(kpis.channels.online.revenue / kpis.overall.totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">{kpis.channels.online.orders} orders</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Online Platform Performance</CardTitle>
                <CardDescription>Revenue breakdown by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kpis.channels.online.platforms.map((platform, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span>{platform.platform}</span>
                        <span className="font-medium">{formatCurrency(platform.revenue)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(platform.revenue / kpis.channels.online.revenue) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600">{platform.orders} orders</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Store Performance Quick View */}
          <Card>
            <CardHeader>
              <CardTitle>Store Performance Overview</CardTitle>
              <CardDescription>Quick comparison across all locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kpis.storePerformance.map((store) => (
                  <div key={store.storeId} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{store.storeName}</h3>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Revenue</span>
                        <span className="font-medium">{formatCurrency(store.sales.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Orders</span>
                        <span className="font-medium">{store.sales.orders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Growth</span>
                        <span>{formatGrowth(store.sales.growth.revenueGrowth)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          <div className="space-y-6">
            {getStoreData().map((store) => (
              <Card key={store.storeId}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        {store.storeName}
                      </CardTitle>
                      <CardDescription>Detailed performance metrics</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sales Metrics */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Sales Performance</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Revenue</span>
                          <span className="font-medium">{formatCurrency(store.sales.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Orders</span>
                          <span className="font-medium">{store.sales.orders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">AOV</span>
                          <span className="font-medium">{formatCurrency(store.sales.averageOrderValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Growth</span>
                          <span>{formatGrowth(store.sales.growth.revenueGrowth)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Inventory Metrics */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Inventory Health</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Products</span>
                          <span className="font-medium">{store.inventory.totalProducts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Value</span>
                          <span className="font-medium">{formatCurrency(store.inventory.totalValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Low Stock</span>
                          <span className="font-medium text-yellow-600">{store.inventory.lowStockItems}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Out of Stock</span>
                          <span className="font-medium text-red-600">{store.inventory.outOfStockItems}</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Products */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Top Products</h4>
                      <div className="space-y-1">
                        {store.performance.topSellingProducts.slice(0, 3).map((product, index) => (
                          <div key={product.productId} className="flex justify-between text-sm">
                            <span className="truncate">{product.name}</span>
                            <span className="font-medium">{product.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Key Metrics</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Turnover Rate</span>
                          <span className="font-medium">{store.inventory.turnoverRate}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Order Growth</span>
                          <span>{formatGrowth(store.sales.growth.ordersGrowth)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Physical Stores Performance</CardTitle>
                <CardDescription>Brick and mortar locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kpis.storePerformance.filter(store => store.storeId !== "store-3").map((store) => (
                    <div key={store.storeId} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{store.storeName}</div>
                        <div className="text-sm text-gray-600">{store.sales.orders} orders</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(store.sales.revenue)}</div>
                        <div className="text-sm">{formatGrowth(store.sales.growth.revenueGrowth)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Online Channels Performance</CardTitle>
                <CardDescription>E-commerce platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kpis.channels.online.platforms.map((platform, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{platform.platform}</div>
                        <div className="text-sm text-gray-600">{platform.orders} orders</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(platform.revenue)}</div>
                        <div className="text-sm text-green-600">
                          {((platform.revenue / kpis.channels.online.revenue) * 100).toFixed(1)}% share
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Channel Comparison</CardTitle>
              <CardDescription>Performance metrics across all channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(kpis.channels.physical.revenue)}
                  </div>
                  <div className="text-sm text-gray-600">Physical Stores Revenue</div>
                  <div className="text-sm text-blue-600">
                    {((kpis.channels.physical.revenue / kpis.overall.totalRevenue) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(kpis.channels.online.revenue)}
                  </div>
                  <div className="text-sm text-gray-600">Online Channels Revenue</div>
                  <div className="text-sm text-green-600">
                    {((kpis.channels.online.revenue / kpis.overall.totalRevenue) * 100).toFixed(1)}% of total
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(kpis.overall.averageOrderValue)}
                  </div>
                  <div className="text-sm text-gray-600">Average Order Value</div>
                  <div className="text-sm text-purple-600">Across all channels</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Products</span>
                    <span className="font-bold">{kpis.inventory.totalProducts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value</span>
                    <span className="font-bold">{formatCurrency(kpis.inventory.totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Critical Alerts</span>
                    <span className="font-bold text-red-600">{kpis.inventory.criticalStockAlerts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sync Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-green-600">In Sync</span>
                    <span className="font-bold">{kpis.inventory.syncStatus.inSync.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Pending</span>
                    <span className="font-bold">{kpis.inventory.syncStatus.syncPending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Errors</span>
                    <span className="font-bold">{kpis.inventory.syncStatus.syncErrors}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(((kpis.inventory.totalProducts - kpis.inventory.criticalStockAlerts) / kpis.inventory.totalProducts) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Healthy Stock</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${((kpis.inventory.totalProducts - kpis.inventory.criticalStockAlerts) / kpis.inventory.totalProducts) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Store-wise Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Store-wise Inventory Health</CardTitle>
              <CardDescription>Inventory status across all locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kpis.storePerformance.map((store) => (
                  <div key={store.storeId} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{store.storeName}</div>
                      <div className="text-sm text-gray-600">
                        {store.inventory.totalProducts} products • Turnover: {store.inventory.turnoverRate}x
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{formatCurrency(store.inventory.totalValue)}</div>
                        <div className="text-xs text-gray-600">Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">{store.inventory.lowStockItems}</div>
                        <div className="text-xs text-gray-600">Low Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{store.inventory.outOfStockItems}</div>
                        <div className="text-xs text-gray-600">Out of Stock</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
