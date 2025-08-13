import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ReportExporter } from "@/components/ReportExporter";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  Target,
  Clock,
  Zap,
  Eye,
  Filter,
  RefreshCw,
} from "lucide-react";

const salesData = [
  { month: "Jan", sales: 45000, orders: 156, customers: 89 },
  { month: "Feb", sales: 52000, orders: 178, customers: 95 },
  { month: "Mar", sales: 48000, orders: 165, customers: 92 },
  { month: "Apr", sales: 61000, orders: 203, customers: 118 },
  { month: "May", sales: 55000, orders: 187, customers: 105 },
  { month: "Jun", sales: 67000, orders: 224, customers: 132 },
];

const topProducts = [
  {
    name: "iPhone 14 Pro",
    category: "Electronics",
    sold: 45,
    revenue: 3375000,
    trend: "up",
  },
  {
    name: "Nike Air Max",
    category: "Footwear",
    sold: 78,
    revenue: 1014000,
    trend: "up",
  },
  {
    name: "Samsung Galaxy Buds",
    category: "Electronics",
    sold: 134,
    revenue: 2141600,
    trend: "down",
  },
  {
    name: "Levi's Jeans",
    category: "Clothing",
    sold: 89,
    revenue: 355911,
    trend: "up",
  },
  {
    name: "MacBook Air M2",
    category: "Electronics",
    sold: 23,
    revenue: 2277000,
    trend: "up",
  },
];

const inventoryAlerts = [
  {
    product: "iPhone Cases",
    stock: 3,
    reorderLevel: 20,
    category: "Electronics",
    urgency: "high",
  },
  {
    product: "Wireless Chargers",
    stock: 8,
    reorderLevel: 15,
    category: "Electronics",
    urgency: "medium",
  },
  {
    product: "Running Shoes",
    stock: 12,
    reorderLevel: 25,
    category: "Footwear",
    urgency: "medium",
  },
  {
    product: "T-Shirts",
    stock: 5,
    reorderLevel: 30,
    category: "Clothing",
    urgency: "high",
  },
];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const currentMonthSales = salesData[salesData.length - 1].sales;
  const previousMonthSales = salesData[salesData.length - 2].sales;
  const salesGrowth = (
    ((currentMonthSales - previousMonthSales) / previousMonthSales) *
    100
  ).toFixed(1);

  const totalRevenue = salesData.reduce((sum, month) => sum + month.sales, 0);
  const totalOrders = salesData.reduce((sum, month) => sum + month.orders, 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground">
            Business insights powered by AI analytics and real-time data
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalRevenue / 100000).toFixed(1)}L
            </div>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3 mr-1" />+{salesGrowth}% from last
              month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{Math.round(totalRevenue / totalOrders).toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {inventoryAlerts.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Items need restocking
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="forecasting">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{month.month}</span>
                        <span className="font-medium">
                          ₹{(month.sales / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <Progress
                        value={(month.sales / 70000) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Electronics</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clothing</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Footwear</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Customers
                  </span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    New This Month
                  </span>
                  <span className="font-medium text-emerald-600">+89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Retention Rate
                  </span>
                  <span className="font-medium">85%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inventory Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total SKUs
                  </span>
                  <span className="font-medium">1,856</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Low Stock Items
                  </span>
                  <span className="font-medium text-yellow-600">
                    {inventoryAlerts.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Turnover Rate
                  </span>
                  <span className="font-medium">4.2x</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Gross Margin
                  </span>
                  <span className="font-medium">32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">COGS</span>
                  <span className="font-medium">₹2.1L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Net Profit
                  </span>
                  <span className="font-medium text-emerald-600">₹89K</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ₹{(product.revenue / 100000).toFixed(1)}L
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.sold} units sold
                      </div>
                    </div>
                    <div className="flex items-center">
                      {product.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <div className="font-medium">{alert.product}</div>
                        <div className="text-sm text-muted-foreground">
                          {alert.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            alert.urgency === "high"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {alert.stock} units left
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          Reorder at {alert.reorderLevel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Optimal Stock</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Low Stock</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overstock</span>
                    <span className="font-medium">7%</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  AI Demand Forecasting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Next Month Predictions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">iPhone 14 Pro</span>
                      <span className="font-medium text-emerald-600">
                        +32% demand
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Summer Clothing</span>
                      <span className="font-medium text-emerald-600">
                        +45% demand
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Winter Gear</span>
                      <span className="font-medium text-red-600">
                        -28% demand
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg">
                  <h4 className="font-medium mb-2">Reorder Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <div>• Order 50 iPhone cases by next week</div>
                    <div>• Increase Nike shoes inventory by 30%</div>
                    <div>• Reduce winter jacket orders by 25%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Business Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Growth Opportunities
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Electronics category showing 25% growth. Consider expanding
                    smartphone accessories inventory.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Action Required
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    4 products at critical stock levels. Automated reorder
                    suggested for optimal inventory.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Seasonal Trends
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Summer season approaching. Recommend 40% increase in cooling
                    appliances and summer wear.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
