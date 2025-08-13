import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  Activity,
  Clock,
  User,
  Package,
  ShoppingCart,
  Settings,
  UserPlus,
  Trash2,
  Edit,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Eye,
  Pause,
  Play,
  Filter,
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  userRole: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  ipAddress: string;
  severity: "low" | "medium" | "high";
  module: string;
}

export function LiveAuditLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  // Mock audit logs with realistic data
  const generateMockLog = (): AuditLog => {
    const users = [
      { name: "Rajesh Sharma", role: "ORG_ADMIN" },
      { name: "Priya Patel", role: "ORG_USER" },
      { name: "Amit Kumar", role: "ORG_USER" },
      { name: "Sunita Singh", role: "ORG_USER" },
    ];

    const actions = [
      { action: "created", entity: "product", details: "iPhone 14 Pro added to inventory", module: "inventory", severity: "low" as const },
      { action: "updated", entity: "stock", details: "Stock quantity changed from 25 to 20", module: "inventory", severity: "low" as const },
      { action: "deleted", entity: "product", details: "Outdated product removed", module: "inventory", severity: "medium" as const },
      { action: "processed", entity: "sale", details: "Sale transaction completed - ₹25,000", module: "pos", severity: "low" as const },
      { action: "created", entity: "purchase_order", details: "PO #PO-2024-005 created", module: "orders", severity: "low" as const },
      { action: "logged_in", entity: "user", details: "User authenticated successfully", module: "auth", severity: "low" as const },
      { action: "failed_login", entity: "user", details: "Invalid login attempt", module: "auth", severity: "high" as const },
      { action: "updated", entity: "settings", details: "Organization settings modified", module: "settings", severity: "medium" as const },
      { action: "invited", entity: "user", details: "New team member invitation sent", module: "users", severity: "low" as const },
      { action: "exported", entity: "report", details: "Sales report exported", module: "analytics", severity: "low" as const },
    ];

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      user: randomUser.name,
      userRole: randomUser.role,
      action: randomAction.action,
      entity: randomAction.entity,
      details: randomAction.details,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      severity: randomAction.severity,
      module: randomAction.module,
    };
  };

  // Initialize with some logs
  useEffect(() => {
    const initialLogs = Array.from({ length: 8 }, generateMockLog);
    setLogs(initialLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newLog = generateMockLog();
      setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep latest 50 logs
    }, Math.random() * 5000 + 2000); // Random interval between 2-7 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getActionIcon = (action: string, entity: string) => {
    if (action === "created") return UserPlus;
    if (action === "deleted") return Trash2;
    if (action === "updated") return Edit;
    if (action === "exported") return Download;
    if (action === "imported") return Upload;
    if (action === "processed") return CheckCircle;
    if (action === "logged_in") return User;
    if (action === "failed_login") return AlertTriangle;
    if (entity === "product") return Package;
    if (entity === "sale") return ShoppingCart;
    if (entity === "settings") return Settings;
    return Activity;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredLogs = logs.filter(log => {
    if (filter === "all") return true;
    return log.module === filter;
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" />
            Live Activity
            <Badge variant="outline" className="text-xs">
              {user?.organizationName}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={isLive ? "text-green-600" : "text-muted-foreground"}
            >
              {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isLive ? "Live" : "Paused"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="space-y-1 p-4">
            {filteredLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action, log.entity);
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ActionIcon className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">{log.user}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.userRole.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getSeverityColor(log.severity)} className="text-xs">
                        {log.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {log.details}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(log.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {log.ipAddress}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {log.module}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {/* Footer with stats */}
        <div className="border-t p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{filteredLogs.length} activities</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span>{logs.filter(l => l.severity === "high").length} high</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span>{logs.filter(l => l.severity === "medium").length} medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>{logs.filter(l => l.severity === "low").length} low</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
