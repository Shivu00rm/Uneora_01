import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Server,
  Database,
  Zap,
  Users,
  DollarSign,
  Shield,
  Clock,
  Building2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Bell,
} from "lucide-react";

interface PlatformAlert {
  id: string;
  timestamp: Date;
  type: "error" | "warning" | "info" | "critical";
  category: "system" | "security" | "performance" | "billing" | "organization";
  title: string;
  message: string;
  organization?: string;
  metric?: {
    value: string;
    threshold: string;
    trend: "up" | "down" | "stable";
  };
  actionRequired: boolean;
  resolved: boolean;
  actions?: {
    type: "restart" | "scale" | "cleanup" | "investigate" | "contact" | "retry" | "suspend";
    label: string;
    destructive?: boolean;
  }[];
}

export function PlatformAlerts() {
  const [alerts, setAlerts] = useState<PlatformAlert[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());

  // Mock platform alerts
  const generateMockAlert = (): PlatformAlert => {
    const alertTemplates = [
      {
        type: "critical" as const,
        category: "system" as const,
        title: "Database Connection Pool Exhausted",
        message: "Main database connection pool at 95% capacity",
        metric: { value: "95%", threshold: "85%", trend: "up" as const },
        actionRequired: true,
        actions: [
          { type: "restart" as const, label: "Restart DB Service" },
          { type: "scale" as const, label: "Scale DB Pool" }
        ]
      },
      {
        type: "error" as const,
        category: "performance" as const,
        title: "High Response Time",
        message: "API response time exceeding threshold",
        organization: "TechCorp",
        metric: { value: "2.5s", threshold: "1.0s", trend: "up" as const },
        actionRequired: true,
        actions: [
          { type: "investigate" as const, label: "Investigate Org" },
          { type: "restart" as const, label: "Restart Services" }
        ]
      },
      {
        type: "warning" as const,
        category: "billing" as const,
        title: "Payment Failed",
        message: "Recurring payment failed for organization",
        organization: "Fashion Boutique",
        actionRequired: true,
        actions: [
          { type: "contact" as const, label: "Contact Org" },
          { type: "suspend" as const, label: "Suspend Account", destructive: true }
        ]
      },
      {
        type: "warning" as const,
        category: "security" as const,
        title: "Multiple Failed Login Attempts",
        message: "Suspicious login activity detected",
        organization: "StartupXYZ",
        actionRequired: false,
        actions: [
          { type: "investigate" as const, label: "View Logs" },
          { type: "suspend" as const, label: "Lock Account", destructive: true }
        ]
      },
      {
        type: "info" as const,
        category: "organization" as const,
        title: "New Organization Created",
        message: "New organization successfully onboarded",
        organization: "NewTech Solutions",
        actionRequired: false,
      },
      {
        type: "critical" as const,
        category: "system" as const,
        title: "Storage Space Critical",
        message: "Primary storage at 92% capacity",
        metric: { value: "92%", threshold: "80%", trend: "up" as const },
        actionRequired: true,
        actions: [
          { type: "cleanup" as const, label: "Cleanup Storage" },
          { type: "scale" as const, label: "Expand Storage" }
        ]
      },
      {
        type: "warning" as const,
        category: "performance" as const,
        title: "Memory Usage High",
        message: "Application server memory usage elevated",
        metric: { value: "87%", threshold: "75%", trend: "stable" as const },
        actionRequired: false,
        actions: [
          { type: "restart" as const, label: "Restart Service" },
          { type: "scale" as const, label: "Scale Memory" }
        ]
      },
      {
        type: "error" as const,
        category: "system" as const,
        title: "Background Job Failed",
        message: "Daily backup process failed to complete",
        actionRequired: true,
        actions: [
          { type: "retry" as const, label: "Retry Backup" },
          { type: "investigate" as const, label: "Check Logs" }
        ]
      },
    ];

    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
      resolved: Math.random() > 0.7, // 30% chance of being resolved
      ...template,
    };
  };

  // Initialize with alerts
  useEffect(() => {
    const initialAlerts = Array.from({ length: 12 }, generateMockAlert);
    setAlerts(initialAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Randomly add new alert or resolve existing ones
      if (Math.random() > 0.7) {
        const newAlert = generateMockAlert();
        setAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep latest 20 alerts
      } else {
        // Sometimes resolve an existing alert
        setAlerts(prev => prev.map(alert => 
          Math.random() > 0.95 && !alert.resolved
            ? { ...alert, resolved: true }
            : alert
        ));
      }
    }, Math.random() * 8000 + 5000); // Random interval between 5-13 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getAlertIcon = (type: string, category: string) => {
    if (type === "critical") return AlertCircle;
    if (type === "error") return XCircle;
    if (type === "warning") return AlertTriangle;
    if (category === "system") return Server;
    if (category === "security") return Shield;
    if (category === "performance") return TrendingUp;
    if (category === "billing") return DollarSign;
    if (category === "organization") return Building2;
    return Bell;
  };

  const getAlertColor = (type: string, resolved: boolean) => {
    if (resolved) return "outline";
    switch (type) {
      case "critical": return "destructive";
      case "error": return "destructive";
      case "warning": return "secondary";
      default: return "default";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "system": return "bg-red-100 text-red-800";
      case "security": return "bg-orange-100 text-orange-800";
      case "performance": return "bg-yellow-100 text-yellow-800";
      case "billing": return "bg-blue-100 text-blue-800";
      case "organization": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true;
    if (filter === "unresolved") return !alert.resolved;
    if (filter === "critical") return alert.type === "critical";
    return alert.category === filter;
  });

  const criticalCount = alerts.filter(a => a.type === "critical" && !a.resolved).length;
  const unresolvedCount = alerts.filter(a => !a.resolved).length;

  const handleAlertAction = async (alertId: string, actionType: string, alertTitle: string) => {
    console.log(`Executing action: ${actionType} for alert: ${alertTitle}`);

    // Simulate action execution
    const actionMessages = {
      restart: "Service restart initiated...",
      scale: "Scaling resources...",
      cleanup: "Cleanup process started...",
      investigate: "Opening investigation dashboard...",
      contact: "Sending notification to organization...",
      retry: "Retrying failed operation...",
      suspend: "Account suspension initiated...",
    };

    const message = actionMessages[actionType as keyof typeof actionMessages] || "Processing action...";

    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mark alert as resolved for certain actions
    if (["restart", "scale", "cleanup", "retry"].includes(actionType)) {
      setAlerts(prev => prev.map(alert =>
        alert.id === alertId
          ? { ...alert, resolved: true }
          : alert
      ));
    }

    console.log(`Action completed: ${message}`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5" />
            Platform Alerts
            <Badge variant="destructive" className="text-xs">
              {criticalCount} Critical
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={isLive ? "text-green-600" : "text-muted-foreground"}
            >
              <RefreshCw className={`h-4 w-4 ${isLive ? 'animate-spin' : ''}`} />
              {isLive ? "Live" : "Paused"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="space-y-1 p-4">
            {filteredAlerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type, alert.category);
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    alert.resolved 
                      ? "bg-muted/30 opacity-60" 
                      : alert.type === "critical" 
                        ? "bg-red-50 border-red-200" 
                        : "bg-card hover:bg-muted/50"
                  }`}
                >
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    alert.resolved 
                      ? "bg-green-100" 
                      : alert.type === "critical" 
                        ? "bg-red-100" 
                        : "bg-primary/10"
                  }`}>
                    {alert.resolved ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertIcon className={`h-4 w-4 ${
                        alert.type === "critical" ? "text-red-600" : "text-primary"
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium truncate ${
                        alert.resolved ? "line-through text-muted-foreground" : ""
                      }`}>
                        {alert.title}
                      </span>
                      {alert.organization && (
                        <Badge variant="outline" className="text-xs">
                          {alert.organization}
                        </Badge>
                      )}
                      <Badge variant={getAlertColor(alert.type, alert.resolved)} className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    {alert.metric && (
                      <div className="flex items-center gap-3 text-xs mb-2">
                        <span className="text-muted-foreground">
                          Current: <strong>{alert.metric.value}</strong>
                        </span>
                        <span className="text-muted-foreground">
                          Threshold: {alert.metric.threshold}
                        </span>
                        <div className="flex items-center gap-1">
                          {alert.metric.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-red-500" />
                          ) : alert.metric.trend === "down" ? (
                            <TrendingDown className="h-3 w-3 text-green-500" />
                          ) : (
                            <Activity className="h-3 w-3 text-gray-500" />
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(alert.timestamp)}
                      </div>
                      <Badge className={`text-xs ${getCategoryColor(alert.category)}`}>
                        {alert.category}
                      </Badge>
                      {alert.actionRequired && !alert.resolved && (
                        <Badge variant="destructive" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {alert.actions && alert.actions.length > 0 && !alert.resolved && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {alert.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant={action.destructive ? "destructive" : "outline"}
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={() => handleAlertAction(alert.id, action.type, alert.title)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {/* Footer with stats */}
        <div className="border-t p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{filteredAlerts.length} alerts</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span>{alerts.filter(a => a.type === "critical" && !a.resolved).length} critical</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span>{unresolvedCount} unresolved</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>{alerts.filter(a => a.resolved).length} resolved</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
