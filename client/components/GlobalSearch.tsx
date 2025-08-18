import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Package,
  Users,
  Building2,
  FileText,
  ShoppingCart,
  BarChart3,
  Settings,
  Crown,
  Briefcase,
  User,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  category: string;
  url: string;
  icon: any;
  badge?: string;
  timestamp?: string;
}

interface GlobalSearchProps {
  trigger?: React.ReactNode;
}

export function GlobalSearch({ trigger }: GlobalSearchProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app would be API calls based on user role
  const getMockResults = (searchQuery: string): SearchResult[] => {
    const allResults: SearchResult[] = [];

    // Common results for all roles
    if (
      searchQuery.toLowerCase().includes("inventory") ||
      searchQuery.toLowerCase().includes("product")
    ) {
      allResults.push(
        {
          id: "inv-1",
          title: "iPhone 14 Pro",
          subtitle: "Stock: 25 units • SKU: IP14P-128",
          type: "product",
          category: "Inventory",
          url: "/app/inventory",
          icon: Package,
          badge: "In Stock",
        },
        {
          id: "inv-2",
          title: "Samsung Galaxy Buds",
          subtitle: "Stock: 3 units • SKU: SGB-001",
          type: "product",
          category: "Inventory",
          url: "/app/inventory",
          icon: Package,
          badge: "Low Stock",
        },
      );
    }

    if (
      searchQuery.toLowerCase().includes("order") ||
      searchQuery.toLowerCase().includes("purchase")
    ) {
      allResults.push({
        id: "po-1",
        title: "Purchase Order #PO-2024-001",
        subtitle: "Vendor: TechCorp • Amount: ₹1,25,000",
        type: "purchase_order",
        category: "Orders",
        url: "/app/purchase-orders",
        icon: ShoppingCart,
        badge: "Pending",
      });
    }

    if (
      searchQuery.toLowerCase().includes("analytics") ||
      searchQuery.toLowerCase().includes("report")
    ) {
      allResults.push({
        id: "ana-1",
        title: "Monthly Sales Report",
        subtitle: "Revenue: ₹2,34,567 • Growth: +8%",
        type: "report",
        category: "Analytics",
        url: "/app/analytics",
        icon: BarChart3,
        badge: "Current",
      });
    }

    // Org Admin specific results
    if (user?.role === "ORG_ADMIN") {
      if (
        searchQuery.toLowerCase().includes("user") ||
        searchQuery.toLowerCase().includes("team")
      ) {
        allResults.push(
          {
            id: "user-1",
            title: "John Doe",
            subtitle: "john.doe@company.com • Org User",
            type: "user",
            category: "Team",
            url: "/app/team",
            icon: User,
            badge: "Active",
          },
          {
            id: "user-2",
            title: "Add New Team Member",
            subtitle: "Invite users to your organization",
            type: "action",
            category: "Team Management",
            url: "/app/team",
            icon: Users,
          },
        );
      }

      if (searchQuery.toLowerCase().includes("setting")) {
        allResults.push({
          id: "set-1",
          title: "Organization Settings",
          subtitle: "Manage org preferences and configurations",
          type: "settings",
          category: "Settings",
          url: "/app/settings",
          icon: Settings,
        });
      }
    }

    // Super Admin specific results
    if (user?.role === "SUPER_ADMIN") {
      if (
        searchQuery.toLowerCase().includes("org") ||
        searchQuery.toLowerCase().includes("organization")
      ) {
        allResults.push(
          {
            id: "org-1",
            title: "Acme Corporation",
            subtitle: "acme.com • Pro Plan • 45 users",
            type: "organization",
            category: "Organizations",
            url: "/super-admin",
            icon: Building2,
            badge: "Active",
          },
          {
            id: "org-2",
            title: "TechStart Inc",
            subtitle: "techstart.io • Starter Plan • 8 users",
            type: "organization",
            category: "Organizations",
            url: "/super-admin",
            icon: Building2,
            badge: "Trial",
          },
        );
      }

      if (
        searchQuery.toLowerCase().includes("system") ||
        searchQuery.toLowerCase().includes("platform")
      ) {
        allResults.push({
          id: "sys-1",
          title: "System Health Monitor",
          subtitle: "Platform uptime and performance metrics",
          type: "monitoring",
          category: "System",
          url: "/org-flows",
          icon: BarChart3,
          badge: "Healthy",
        });
      }

      if (
        searchQuery.toLowerCase().includes("billing") ||
        searchQuery.toLowerCase().includes("revenue")
      ) {
        allResults.push({
          id: "bill-1",
          title: "Platform Revenue",
          subtitle: "₹4.9L monthly • 127 organizations",
          type: "billing",
          category: "Billing",
          url: "/super-admin",
          icon: BarChart3,
          badge: "Current",
        });
      }
    }

    // Quick actions based on role
    if (
      searchQuery.toLowerCase().includes("add") ||
      searchQuery.toLowerCase().includes("create")
    ) {
      if (user?.role !== "SUPER_ADMIN") {
        allResults.push({
          id: "action-1",
          title: "Add New Product",
          subtitle: "Add items to your inventory",
          type: "action",
          category: "Quick Actions",
          url: "/app/inventory",
          icon: Package,
        });
      }
    }

    return allResults.filter(
      (result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true);
      // Simulate API delay
      const timeoutId = setTimeout(() => {
        setResults(getMockResults(query));
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query, user?.role]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    // Navigation would be handled by router
    window.location.href = result.url;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Inventory":
        return Package;
      case "Orders":
        return ShoppingCart;
      case "Analytics":
        return BarChart3;
      case "Team":
        return Users;
      case "Settings":
        return Settings;
      case "Organizations":
        return Building2;
      case "System":
        return Crown;
      case "Billing":
        return BarChart3;
      case "Quick Actions":
        return AlertTriangle;
      default:
        return Search;
    }
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge?.toLowerCase()) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "low stock":
        return "destructive";
      case "trial":
        return "outline";
      case "healthy":
        return "default";
      default:
        return "secondary";
    }
  };

  // Group results by category
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-4 pb-0 pt-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            Search Uneora
            <Badge variant="outline" className="text-xs">
              {user?.role?.replace("_", " ")}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border-0 shadow-none">
          <div className="flex items-center border-b px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Searching...
                </div>
              </div>
            ) : results.length === 0 && query.length > 1 ? (
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm font-medium">No results found</div>
                  <div className="text-xs text-muted-foreground">
                    Try different keywords or check your spelling
                  </div>
                </div>
              </CommandEmpty>
            ) : (
              Object.entries(groupedResults).map(
                ([category, categoryResults], index) => {
                  const CategoryIcon = getCategoryIcon(category);
                  return (
                    <div key={category}>
                      {index > 0 && <CommandSeparator />}
                      <CommandGroup
                        heading={
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <CategoryIcon className="h-3 w-3" />
                            {category}
                          </div>
                        }
                      >
                        {categoryResults.map((result) => {
                          const ItemIcon = result.icon;
                          return (
                            <CommandItem
                              key={result.id}
                              className="flex items-center gap-3 p-3 cursor-pointer"
                              onSelect={() => handleResultClick(result)}
                            >
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <ItemIcon className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-sm truncate">
                                    {result.title}
                                  </div>
                                  {result.badge && (
                                    <Badge
                                      variant={getBadgeVariant(result.badge)}
                                      className="text-xs"
                                    >
                                      {result.badge}
                                    </Badge>
                                  )}
                                </div>
                                {result.subtitle && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {result.subtitle}
                                  </div>
                                )}
                                {result.timestamp && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <Clock className="h-3 w-3" />
                                    {result.timestamp}
                                  </div>
                                )}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </div>
                  );
                },
              )
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
