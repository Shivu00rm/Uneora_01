import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Settings,
  Mail,
  Smartphone,
  Clock,
  Users,
  Package,
  DollarSign,
  Shield,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  category: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  urgent?: boolean;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  lowStock: boolean;
  orderUpdates: boolean;
  teamChanges: boolean;
  systemAlerts: boolean;
  billingUpdates: boolean;
  securityAlerts: boolean;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Low Stock Alert",
      message: "iPhone 14 Pro has only 3 units remaining",
      type: "warning",
      category: "Inventory",
      timestamp: "2 minutes ago",
      read: false,
      actionUrl: "/app/inventory",
      urgent: true
    },
    {
      id: "2",
      title: "New Team Member",
      message: "John Doe has joined your organization",
      type: "info",
      category: "Team",
      timestamp: "1 hour ago",
      read: false,
      actionUrl: "/app/team"
    },
    {
      id: "3",
      title: "Purchase Order Completed",
      message: "PO #PO-2024-001 has been delivered",
      type: "success",
      category: "Orders",
      timestamp: "3 hours ago",
      read: true,
      actionUrl: "/app/purchase-orders"
    },
  ]);

  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    lowStock: true,
    orderUpdates: true,
    teamChanges: true,
    systemAlerts: true,
    billingUpdates: true,
    securityAlerts: true,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Inventory":
        return Package;
      case "Team":
        return Users;
      case "Orders":
        return BarChart3;
      case "Billing":
        return DollarSign;
      case "Security":
        return Shield;
      case "System":
        return TrendingUp;
      default:
        return Info;
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Role-specific notification settings
  const getAvailableSettings = () => {
    const baseSettings = [
      { key: "lowStock" as keyof NotificationSettings, label: "Low Stock Alerts", description: "Get notified when inventory is running low" },
      { key: "orderUpdates" as keyof NotificationSettings, label: "Order Updates", description: "Purchase order status changes" },
    ];

    if (user?.role === "ORG_ADMIN") {
      return [
        ...baseSettings,
        { key: "teamChanges" as keyof NotificationSettings, label: "Team Changes", description: "New members, role changes" },
        { key: "billingUpdates" as keyof NotificationSettings, label: "Billing Updates", description: "Payment and subscription alerts" },
        { key: "securityAlerts" as keyof NotificationSettings, label: "Security Alerts", description: "Login attempts, security events" },
      ];
    }

    if (user?.role === "SUPER_ADMIN") {
      return [
        { key: "systemAlerts" as keyof NotificationSettings, label: "System Alerts", description: "Platform-wide issues and updates" },
        { key: "billingUpdates" as keyof NotificationSettings, label: "Billing Updates", description: "Revenue, payment failures" },
        { key: "securityAlerts" as keyof NotificationSettings, label: "Security Alerts", description: "System security events" },
      ];
    }

    return baseSettings;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                  <DialogDescription>
                    Configure how you want to receive notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Delivery Methods */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Delivery Methods</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="email" className="text-sm">Email Notifications</Label>
                        </div>
                        <Switch
                          id="email"
                          checked={settings.email}
                          onCheckedChange={(checked) => updateSetting("email", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="push" className="text-sm">Push Notifications</Label>
                        </div>
                        <Switch
                          id="push"
                          checked={settings.push}
                          onCheckedChange={(checked) => updateSetting("push", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Notification Types</Label>
                    <div className="space-y-3">
                      {getAvailableSettings().map((setting) => (
                        <div key={setting.key} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={setting.key} className="text-sm">
                              {setting.label}
                            </Label>
                            <Switch
                              id={setting.key}
                              checked={settings[setting.key]}
                              onCheckedChange={(checked) => updateSetting(setting.key, checked)}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <Bell className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm font-medium">No notifications</div>
            <div className="text-xs text-muted-foreground">You're all caught up!</div>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => {
              const CategoryIcon = getCategoryIcon(notification.category);
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </div>
                      {notification.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <CategoryIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {notification.category}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
