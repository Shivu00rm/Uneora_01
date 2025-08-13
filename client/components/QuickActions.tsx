import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  FileText,
  Settings,
  Building2,
  Crown,
  TrendingUp,
  UserPlus,
  Download,
  AlertTriangle,
  Plus,
  Eye,
  Zap,
  Target,
  ArrowUpRight,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  url: string;
  color: string;
  badge?: string;
  urgent?: boolean;
}

export function QuickActions() {
  const { user } = useAuth();

  const getQuickActions = (): QuickAction[] => {
    const commonActions: QuickAction[] = [
      {
        id: "add-product",
        title: "Add Product",
        description: "Add new items to inventory",
        icon: Package,
        url: "/app/inventory",
        color: "bg-blue-500",
        badge: "Inventory"
      },
      {
        id: "create-po",
        title: "Create Purchase Order",
        description: "Generate new purchase order",
        icon: ShoppingCart,
        url: "/app/purchase-orders",
        color: "bg-emerald-500",
        badge: "Orders"
      },
      {
        id: "view-analytics",
        title: "View Reports",
        description: "Business insights and analytics",
        icon: BarChart3,
        url: "/app/analytics",
        color: "bg-purple-500",
        badge: "Analytics"
      },
    ];

    // Role-specific actions
    if (user?.role === "ORG_ADMIN") {
      return [
        ...commonActions,
        {
          id: "add-user",
          title: "Add Team Member",
          description: "Invite new users to organization",
          icon: UserPlus,
          url: "/app/team",
          color: "bg-orange-500",
          badge: "Team"
        },
        {
          id: "org-settings",
          title: "Org Settings",
          description: "Manage organization preferences",
          icon: Settings,
          url: "/app/settings",
          color: "bg-gray-500",
          badge: "Settings"
        },
        {
          id: "export-data",
          title: "Export Data",
          description: "Download reports and data",
          icon: Download,
          url: "/app/analytics",
          color: "bg-indigo-500",
          badge: "Export"
        }
      ];
    }

    if (user?.role === "SUPER_ADMIN") {
      return [
        {
          id: "system-health",
          title: "System Health",
          description: "Monitor platform performance",
          icon: TrendingUp,
          url: "/org-flows",
          color: "bg-emerald-500",
          badge: "Platform"
        },
        {
          id: "manage-orgs",
          title: "Manage Organizations",
          description: "Add, edit, or suspend organizations",
          icon: Building2,
          url: "/super-admin",
          color: "bg-blue-500",
          badge: "Admin"
        },
        {
          id: "billing-overview",
          title: "Billing Overview",
          description: "Revenue and payment management",
          icon: BarChart3,
          url: "/super-admin",
          color: "bg-purple-500",
          badge: "Billing"
        },
        {
          id: "platform-settings",
          title: "Platform Settings",
          description: "System-wide configurations",
          icon: Settings,
          url: "/super-admin",
          color: "bg-gray-500",
          badge: "System"
        },
        {
          id: "api-management",
          title: "API Management",
          description: "Manage system API keys",
          icon: Zap,
          url: "/super-admin",
          color: "bg-yellow-500",
          badge: "API"
        },
        {
          id: "audit-logs",
          title: "Audit Logs",
          description: "View system activity logs",
          icon: FileText,
          url: "/super-admin",
          color: "bg-red-500",
          badge: "Security"
        }
      ];
    }

    // Org User actions
    return [
      ...commonActions.slice(0, 2), // Only inventory and orders for regular users
      {
        id: "view-dashboard",
        title: "View Dashboard",
        description: "Organization overview",
        icon: Target,
        url: "/app/dashboard",
        color: "bg-green-500",
        badge: "Overview"
      }
    ];
  };

  const actions = getQuickActions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
          <Badge variant="outline" className="text-xs">
            {user?.role?.replace('_', ' ')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Link key={action.id} to={action.url}>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-3 w-full hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`h-8 w-8 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                      <ActionIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
        
        {/* Additional Context Actions */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-muted-foreground mb-2">Need Help?</div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs h-8">
              <FileText className="mr-1 h-3 w-3" />
              Documentation
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-8">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
