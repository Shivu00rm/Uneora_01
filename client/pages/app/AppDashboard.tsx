import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LiveAuditLogs } from "@/components/LiveAuditLogs";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  ArrowUpRight,
  Clock,
  Target,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data specific to the user's organization
const mockOrgData = {
  totalProducts: 1284,
  lowStockItems: 23,
  monthlySales: 234567,
  activeOrders: 47,
  pendingPOs: 12,
  teamMembers: 8,
  recentActivities: [
    {
      id: 1,
      type: "inventory_update",
      message: "Stock updated for iPhone 14 Pro",
      user: "John Doe",
      timestamp: "2 hours ago",
      status: "success"
    },
    {
      id: 2,
      type: "pos_sale",
      message: "Sale completed - ₹25,000",
      user: "Cashier 1",
      timestamp: "3 hours ago", 
      status: "success"
    },
    {
      id: 3,
      type: "low_stock",
      message: "Low stock alert: Samsung Galaxy Buds",
      user: "System",
      timestamp: "4 hours ago",
      status: "warning"
    },
    {
      id: 4,
      type: "purchase_order",
      message: "PO created for ₹125,000",
      user: "Procurement Team",
      timestamp: "5 hours ago",
      status: "pending"
    }
  ],
  quickStats: {
    todaySales: 45000,
    weeklyGrowth: 12,
    inventoryTurnover: 4.2,
    customerSatisfaction: 94
  }
};

export default function AppDashboard() {
  const { user } = useAuth();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "inventory_update": return Package;
      case "pos_sale": return ShoppingCart;
      case "low_stock": return AlertTriangle;
      case "purchase_order": return BarChart3;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "default";
      case "warning": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Inventory management and business insights
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrgData.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mockOrgData.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{mockOrgData.monthlySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrgData.activeOrders}</div>
            <p className="text-xs text-muted-foreground">+3 new today</p>
          </CardContent>
        </Card>
      </div>

      {/* Role-Specific Dashboard Section */}
      {user?.role === "ORG_ADMIN" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Live Audit Logs for Org Admin */}
          <LiveAuditLogs />

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrgData.recentActivities.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ActivityIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          by {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(activity.status)} className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Org Users get a simpler, cleaner layout */}
      {user?.role === "ORG_USER" && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/app/inventory">
                  <Button variant="outline" className="h-16 w-full flex flex-col gap-2">
                    <Package className="h-5 w-5" />
                    <span className="text-sm">Inventory</span>
                  </Button>
                </Link>
                <Link to="/app/pos">
                  <Button variant="outline" className="h-16 w-full flex flex-col gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="text-sm">POS</span>
                  </Button>
                </Link>
                <Link to="/app/analytics">
                  <Button variant="outline" className="h-16 w-full flex flex-col gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                </Link>
                <Link to="/app/vendors">
                  <Button variant="outline" className="h-16 w-full flex flex-col gap-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Vendors</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{mockOrgData.quickStats.todaySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">15 transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">+{mockOrgData.quickStats.weeklyGrowth}%</div>
            <p className="text-xs text-muted-foreground">vs last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrgData.quickStats.inventoryTurnover}x</div>
            <p className="text-xs text-muted-foreground">per year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{mockOrgData.quickStats.customerSatisfaction}%</div>
            <p className="text-xs text-muted-foreground">based on reviews</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
