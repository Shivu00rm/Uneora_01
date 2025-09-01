import React, { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSuperAdmin } from "@/contexts/SuperAdminContext";
import {
  Shield,
  AlertTriangle,
  Activity,
  Building2,
  Users,
  Database,
  TrendingUp,
  Clock,
  Zap,
  Eye,
  ExternalLink,
  RefreshCw,
  TrendingDown,
  Server,
  BarChart3,
  LineChart,
  Globe,
  Wifi,
  WifiOff,
} from "lucide-react";

interface OrganizationHealth {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical" | "offline";
  responseTime: number;
  uptime: number;
  errorRate: number;
  activeUsers: number;
  lastIncident?: string;
  performance: {
    cpu: number;
    memory: number;
    storage: number;
  };
  errors: {
    total: number;
    runtime: number;
    database: number;
    network: number;
  };
}

export default function OrganizationMonitor() {
  const { isSuperAdmin, organizations } = useSuperAdmin();
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [selectedMetric, setSelectedMetric] = useState("response-time");
  const [isMonitoringDialogOpen, setIsMonitoringDialogOpen] = useState(false);
  const [selectedOrgForMonitoring, setSelectedOrgForMonitoring] =
    useState<OrganizationHealth | null>(null);

  // Mock organization health data
  const orgHealthData: OrganizationHealth[] = [
    {
      id: "tech-corp",
      name: "Tech Corp Solutions",
      status: "healthy",
      responseTime: 245,
      uptime: 99.8,
      errorRate: 0.02,
      activeUsers: 156,
      performance: { cpu: 35, memory: 67, storage: 42 },
      errors: { total: 12, runtime: 3, database: 2, network: 7 },
    },
    {
      id: "fashion-boutique",
      name: "Fashion Boutique",
      status: "warning",
      responseTime: 1250,
      uptime: 98.2,
      errorRate: 0.15,
      activeUsers: 89,
      lastIncident: "2024-01-15T10:30:00Z",
      performance: { cpu: 78, memory: 85, storage: 56 },
      errors: { total: 45, runtime: 15, database: 8, network: 22 },
    },
    {
      id: "startup-xyz",
      name: "StartupXYZ",
      status: "critical",
      responseTime: 3400,
      uptime: 95.1,
      errorRate: 0.85,
      activeUsers: 12,
      lastIncident: "2024-01-18T14:22:00Z",
      performance: { cpu: 95, memory: 92, storage: 78 },
      errors: { total: 127, runtime: 56, database: 34, network: 37 },
    },
    {
      id: "retail-chain",
      name: "RetailChain Plus",
      status: "offline",
      responseTime: 0,
      uptime: 0,
      errorRate: 1.0,
      activeUsers: 0,
      lastIncident: "2024-01-18T16:45:00Z",
      performance: { cpu: 0, memory: 0, storage: 0 },
      errors: { total: 234, runtime: 89, database: 67, network: 78 },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-emerald-500";
      case "warning":
        return "text-yellow-500";
      case "critical":
        return "text-red-500";
      case "offline":
        return "text-gray-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <Wifi className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      case "offline":
        return <WifiOff className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value < 50) return "bg-emerald-500";
    if (value < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleViewDetails = (org: OrganizationHealth) => {
    setSelectedOrgForMonitoring(org);
    setIsMonitoringDialogOpen(true);
  };

  const criticalOrgs = orgHealthData.filter(
    (org) => org.status === "critical" || org.status === "offline",
  );
  const warningOrgs = orgHealthData.filter((org) => org.status === "warning");

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Organization Health Monitor
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring of all organization instances - performance,
            errors, and operational health
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalOrgs.length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>
              {criticalOrgs.length} organization(s) require immediate attention:
            </strong>
            <div className="mt-2 space-x-2">
              {criticalOrgs.map((org) => (
                <Badge key={org.id} variant="destructive" className="mr-2">
                  {org.name}
                </Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Healthy Organizations
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {orgHealthData.filter((org) => org.status === "healthy").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {orgHealthData.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                orgHealthData.reduce((acc, org) => acc + org.responseTime, 0) /
                  orgHealthData.length,
              )}
              ms
            </div>
            <p className="text-xs text-muted-foreground">
              Across all organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orgHealthData
                .reduce((acc, org) => acc + org.activeUsers, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                orgHealthData.reduce((acc, org) => acc + org.uptime, 0) /
                orgHealthData.length
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all orgs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6 enhanced-tabs">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100">
          <TabsTrigger
            value="overview"
            className="tab-overview text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Organization Overview
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="tab-performance text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Performance Metrics
          </TabsTrigger>
          <TabsTrigger
            value="errors"
            className="tab-errors text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Error Tracking
          </TabsTrigger>
          <TabsTrigger
            value="incidents"
            className="tab-incidents text-slate-700 font-medium data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Incident History
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="space-y-6 tab-content-watermark uneora-watermark"
        >
          <Card>
            <CardHeader>
              <CardTitle>Organization Health Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Active Users</TableHead>
                    <TableHead>Error Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orgHealthData.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{org.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`flex items-center gap-2 ${getStatusColor(org.status)}`}
                        >
                          {getStatusIcon(org.status)}
                          <span className="capitalize">{org.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            org.responseTime > 1000
                              ? "text-red-600"
                              : org.responseTime > 500
                                ? "text-yellow-600"
                                : "text-emerald-600"
                          }
                        >
                          {org.responseTime > 0
                            ? `${org.responseTime}ms`
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            org.uptime < 95
                              ? "text-red-600"
                              : org.uptime < 99
                                ? "text-yellow-600"
                                : "text-emerald-600"
                          }
                        >
                          {org.uptime > 0 ? `${org.uptime}%` : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {org.activeUsers}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            org.errorRate > 0.5
                              ? "text-red-600"
                              : org.errorRate > 0.1
                                ? "text-yellow-600"
                                : "text-emerald-600"
                          }
                        >
                          {(org.errorRate * 100).toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(org)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={`https://${org.id}.uneora.com`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
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
          value="performance"
          className="space-y-6 tab-content-watermark uneora-watermark"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orgHealthData.map((org) => (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {org.name}
                    <div
                      className={`flex items-center gap-1 ${getStatusColor(org.status)}`}
                    >
                      {getStatusIcon(org.status)}
                      <span className="text-sm capitalize">{org.status}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>{org.performance.cpu}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPerformanceColor(org.performance.cpu)}`}
                        style={{ width: `${org.performance.cpu}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{org.performance.memory}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPerformanceColor(org.performance.memory)}`}
                        style={{ width: `${org.performance.memory}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Usage</span>
                      <span>{org.performance.storage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPerformanceColor(org.performance.storage)}`}
                        style={{ width: `${org.performance.storage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="errors"
          className="space-y-6 tab-content-watermark uneora-watermark"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Breakdown by Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orgHealthData.map((org) => (
                  <div key={org.id} className="space-y-2 p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{org.name}</span>
                      <Badge
                        variant={
                          org.errors.total > 50
                            ? "destructive"
                            : org.errors.total > 20
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {org.errors.total} total
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-red-600 font-medium">
                          {org.errors.runtime}
                        </div>
                        <div className="text-muted-foreground">Runtime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-600 font-medium">
                          {org.errors.database}
                        </div>
                        <div className="text-muted-foreground">Database</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-600 font-medium">
                          {org.errors.network}
                        </div>
                        <div className="text-muted-foreground">Network</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Critical Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border-l-4 border-red-500 bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-medium text-red-800">
                        Database Connection Timeout
                      </div>
                      <div className="text-sm text-red-600">
                        StartupXYZ • 15 minutes ago
                      </div>
                      <div className="text-xs text-red-500">
                        Connection pool exhausted
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-medium text-yellow-800">
                        High Memory Usage
                      </div>
                      <div className="text-sm text-yellow-600">
                        Fashion Boutique • 2 hours ago
                      </div>
                      <div className="text-xs text-yellow-500">
                        Memory usage exceeded 85%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                    <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-medium text-blue-800">
                        Slow Query Detected
                      </div>
                      <div className="text-sm text-blue-600">
                        Tech Corp Solutions • 3 hours ago
                      </div>
                      <div className="text-xs text-blue-500">
                        Query execution time: 3.2s
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="incidents"
          className="space-y-6 tab-content-watermark uneora-watermark"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">
                          Complete Service Outage
                        </div>
                        <div className="text-sm text-muted-foreground">
                          RetailChain Plus
                        </div>
                      </div>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Server crashed due to memory overflow. All services are
                      down.
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Jan 18, 2024 4:45 PM</span>
                      <span>Duration: 2h 15m</span>
                      <span className="text-red-600">Ongoing</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">
                          Performance Degradation
                        </div>
                        <div className="text-sm text-muted-foreground">
                          StartupXYZ
                        </div>
                      </div>
                      <Badge variant="secondary">High</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Response times increased to 3+ seconds. Database queries
                      are slow.
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Jan 18, 2024 2:22 PM</span>
                      <span>Duration: 4h 23m</span>
                      <span className="text-yellow-600">Investigating</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">High Load Alert</div>
                        <div className="text-sm text-muted-foreground">
                          Fashion Boutique
                        </div>
                      </div>
                      <Badge variant="outline">Resolved</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Traffic spike caused temporary slowdown. Auto-scaling
                      resolved the issue.
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Jan 15, 2024 10:30 AM</span>
                      <span>Duration: 25m</span>
                      <span className="text-emerald-600">Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Organization Details Modal */}
      <Dialog
        open={isMonitoringDialogOpen}
        onOpenChange={setIsMonitoringDialogOpen}
      >
        <DialogContent className="sm:max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detailed Monitoring - {selectedOrgForMonitoring?.name}
            </DialogTitle>
            <DialogDescription>
              Comprehensive health metrics and performance data
            </DialogDescription>
          </DialogHeader>

          {selectedOrgForMonitoring && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">System Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <div
                        className={`flex items-center gap-1 ${getStatusColor(selectedOrgForMonitoring.status)}`}
                      >
                        {getStatusIcon(selectedOrgForMonitoring.status)}
                        <span className="capitalize font-medium">
                          {selectedOrgForMonitoring.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Time:</span>
                      <span className="font-medium">
                        {selectedOrgForMonitoring.responseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Uptime:</span>
                      <span className="font-medium">
                        {selectedOrgForMonitoring.uptime}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Error Rate:</span>
                      <span className="font-medium">
                        {(selectedOrgForMonitoring.errorRate * 100).toFixed(2)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resource Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>CPU:</span>
                        <span>{selectedOrgForMonitoring.performance.cpu}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPerformanceColor(selectedOrgForMonitoring.performance.cpu)}`}
                          style={{
                            width: `${selectedOrgForMonitoring.performance.cpu}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Memory:</span>
                        <span>
                          {selectedOrgForMonitoring.performance.memory}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPerformanceColor(selectedOrgForMonitoring.performance.memory)}`}
                          style={{
                            width: `${selectedOrgForMonitoring.performance.memory}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Storage:</span>
                        <span>
                          {selectedOrgForMonitoring.performance.storage}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPerformanceColor(selectedOrgForMonitoring.performance.storage)}`}
                          style={{
                            width: `${selectedOrgForMonitoring.performance.storage}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Error Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Errors:</span>
                      <Badge variant="destructive">
                        {selectedOrgForMonitoring.errors.total}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Runtime:</span>
                      <span className="font-medium">
                        {selectedOrgForMonitoring.errors.runtime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Database:</span>
                      <span className="font-medium">
                        {selectedOrgForMonitoring.errors.database}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Network:</span>
                      <span className="font-medium">
                        {selectedOrgForMonitoring.errors.network}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button asChild>
                  <a
                    href={`https://${selectedOrgForMonitoring.id}.uneora.com/app/dashboard`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Access Organization Dashboard
                  </a>
                </Button>
                <Button variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Full Analytics
                </Button>
                <Button variant="outline">
                  <Server className="mr-2 h-4 w-4" />
                  Server Logs
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
