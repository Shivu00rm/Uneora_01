import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  ShoppingCart,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  BarChart3,
  RefreshCw,
  Download
} from "lucide-react";

// Mock data for organization flows
const mockFlowData = [
  {
    orgId: "org-1",
    orgName: "TechCorp Solutions",
    flows: [
      {
        id: "flow-1",
        type: "inventory_update",
        action: "Stock adjustment for iPhone 14",
        user: "john.doe@techcorp.com",
        timestamp: "2024-01-15T10:30:00Z",
        status: "success",
        details: { productId: "iPhone-14", oldStock: 25, newStock: 20, reason: "Sale" },
        ip: "192.168.1.100",
        userAgent: "FlowStock/Mobile"
      },
      {
        id: "flow-2", 
        type: "pos_transaction",
        action: "Sale transaction completed",
        user: "cashier@techcorp.com",
        timestamp: "2024-01-15T10:25:00Z",
        status: "success",
        details: { amount: 25000, items: 3, paymentMethod: "UPI" },
        ip: "192.168.1.101",
        userAgent: "FlowStock/POS"
      },
      {
        id: "flow-3",
        type: "user_login",
        action: "User authentication",
        user: "manager@techcorp.com",
        timestamp: "2024-01-15T09:45:00Z", 
        status: "success",
        details: { role: "manager", loginMethod: "email_otp" },
        ip: "203.210.45.67",
        userAgent: "Chrome/120.0"
      },
      {
        id: "flow-4",
        type: "purchase_order",
        action: "PO creation and approval",
        user: "procurement@techcorp.com",
        timestamp: "2024-01-15T09:15:00Z",
        status: "pending_approval",
        details: { poNumber: "PO-2024-156", amount: 125000, vendor: "TechSupply India" },
        ip: "192.168.1.102",
        userAgent: "Chrome/120.0"
      },
      {
        id: "flow-5",
        type: "api_call",
        action: "External API integration",
        user: "system",
        timestamp: "2024-01-15T08:30:00Z",
        status: "failed",
        details: { endpoint: "/api/shopify/sync", error: "Rate limit exceeded" },
        ip: "192.168.1.105",
        userAgent: "FlowStock/API"
      }
    ]
  },
  {
    orgId: "org-2",
    orgName: "Retail Plus India", 
    flows: [
      {
        id: "flow-6",
        type: "ecommerce_sync",
        action: "Shopify inventory sync",
        user: "system",
        timestamp: "2024-01-15T11:00:00Z",
        status: "success", 
        details: { syncedProducts: 156, updatedStock: 89 },
        ip: "192.168.2.100",
        userAgent: "FlowStock/Sync"
      },
      {
        id: "flow-7",
        type: "whatsapp_alert",
        action: "Low stock alert sent",
        user: "system",
        timestamp: "2024-01-15T10:45:00Z",
        status: "success",
        details: { product: "Nike Shoes", currentStock: 3, threshold: 10 },
        ip: "192.168.2.101", 
        userAgent: "FlowStock/Alerts"
      }
    ]
  }
];

const flowTypeColors = {
  inventory_update: "default",
  pos_transaction: "default",
  user_login: "secondary",
  purchase_order: "outline",
  api_call: "secondary",
  ecommerce_sync: "default",
  whatsapp_alert: "outline"
};

const flowStatusColors = {
  success: "default",
  pending_approval: "secondary", 
  failed: "destructive",
  warning: "secondary"
};

export default function OrgFlows() {
  const [selectedOrg, setSelectedOrg] = useState("all");
  const [selectedFlowType, setSelectedFlowType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("24h");

  // Flatten all flows for filtering
  const allFlows = mockFlowData.flatMap(org => 
    org.flows.map(flow => ({ ...flow, orgName: org.orgName, orgId: org.orgId }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredFlows = allFlows.filter(flow => {
    const matchesOrg = selectedOrg === "all" || flow.orgId === selectedOrg;
    const matchesType = selectedFlowType === "all" || flow.type === selectedFlowType;
    const matchesStatus = selectedStatus === "all" || flow.status === selectedStatus;
    const matchesSearch = searchQuery === "" || 
      flow.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.orgName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesOrg && matchesType && matchesStatus && matchesSearch;
  });

  const getFlowIcon = (type: string) => {
    switch (type) {
      case "inventory_update": return Package;
      case "pos_transaction": return ShoppingCart;
      case "user_login": return Users;
      case "purchase_order": return BarChart3;
      case "api_call": return Zap;
      case "ecommerce_sync": return RefreshCw;
      case "whatsapp_alert": return AlertTriangle;
      default: return Activity;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return CheckCircle;
      case "failed": return XCircle;
      case "pending_approval": return Clock;
      default: return Clock;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Calculate summary stats
  const totalFlows = filteredFlows.length;
  const successfulFlows = filteredFlows.filter(f => f.status === "success").length;
  const failedFlows = filteredFlows.filter(f => f.status === "failed").length;
  const successRate = totalFlows > 0 ? Math.round((successfulFlows / totalFlows) * 100) : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Organization Activity Flows</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of all activities across organizations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFlows}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{successRate}%</div>
            <p className="text-xs text-muted-foreground">{successfulFlows} successful</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Activities</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedFlows}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFlowData.length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger>
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {mockFlowData.map(org => (
                  <SelectItem key={org.orgId} value={org.orgId}>
                    {org.orgName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFlowType} onValueChange={setSelectedFlowType}>
              <SelectTrigger>
                <SelectValue placeholder="All Flow Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="inventory_update">Inventory Updates</SelectItem>
                <SelectItem value="pos_transaction">POS Transactions</SelectItem>
                <SelectItem value="user_login">User Logins</SelectItem>
                <SelectItem value="purchase_order">Purchase Orders</SelectItem>
                <SelectItem value="api_call">API Calls</SelectItem>
                <SelectItem value="ecommerce_sync">E-commerce Sync</SelectItem>
                <SelectItem value="whatsapp_alert">WhatsApp Alerts</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending_approval">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Flows Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Flows ({filteredFlows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlows.map((flow) => {
                const FlowIcon = getFlowIcon(flow.type);
                const StatusIcon = getStatusIcon(flow.status);
                
                return (
                  <TableRow key={flow.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FlowIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{flow.action}</div>
                          <Badge variant={flowTypeColors[flow.type as keyof typeof flowTypeColors]} className="text-xs">
                            {flow.type.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{flow.orgName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{flow.user}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <StatusIcon className={`h-4 w-4 ${
                          flow.status === "success" ? "text-emerald-500" :
                          flow.status === "failed" ? "text-red-500" : "text-yellow-500"
                        }`} />
                        <Badge variant={flowStatusColors[flow.status as keyof typeof flowStatusColors]}>
                          {flow.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(flow.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {JSON.stringify(flow.details)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        <div>{flow.ip}</div>
                        <div className="truncate max-w-24">{flow.userAgent}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredFlows.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activity flows found for the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
