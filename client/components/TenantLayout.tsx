import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { PermissionGate, OrgAdminOnly } from "./ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  Package,
  BarChart3,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Building2,
  FileText,
  Truck,
  TrendingUp
} from "lucide-react";

interface TenantLayoutProps {
  children: React.ReactNode;
}

export function TenantLayout({ children }: TenantLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();


  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navLinkClass = (path: string) => {
    return `text-sm font-medium transition-colors ${
      isActiveRoute(path) 
        ? "text-foreground" 
        : "text-muted-foreground hover:text-foreground"
    }`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Tenant Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Organization */}
            <div className="flex items-center space-x-4">
              <Link to="/app/dashboard" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">FlowStock</span>
              </Link>
              
              <div className="hidden sm:flex items-center space-x-2">
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {user?.organizationName}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/app/dashboard" className={navLinkClass("/app/dashboard")}>
                Dashboard
              </Link>
              
              <PermissionGate module="inventory" action="view">
                <Link to="/app/inventory" className={navLinkClass("/app/inventory")}>
                  Inventory
                </Link>
              </PermissionGate>
              
              <PermissionGate module="pos" action="view">
                <Link to="/app/pos" className={navLinkClass("/app/pos")}>
                  POS
                </Link>
              </PermissionGate>
              
              <PermissionGate module="vendors" action="view">
                <Link to="/app/vendors" className={navLinkClass("/app/vendors")}>
                  Vendors
                </Link>
              </PermissionGate>
              
              <PermissionGate module="purchase_orders" action="view">
                <Link to="/app/purchase-orders" className={navLinkClass("/app/purchase-orders")}>
                  Orders
                </Link>
              </PermissionGate>
              
              <PermissionGate module="analytics" action="view">
                <Link to="/app/analytics" className={navLinkClass("/app/analytics")}>
                  Analytics
                </Link>
              </PermissionGate>
              
              <OrgAdminOnly>
                <PermissionGate module="users" action="view">
                  <Link to="/app/team" className={navLinkClass("/app/team")}>
                    Team
                  </Link>
                </PermissionGate>
              </OrgAdminOnly>
            </nav>

            {/* Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/app/dashboard" className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <OrgAdminOnly>
                    <DropdownMenuItem asChild>
                      <Link to="/app/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Organization Settings
                      </Link>
                    </DropdownMenuItem>
                  </OrgAdminOnly>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t">

                {/* Navigation Links */}
                <Link
                  to="/app/dashboard"
                  className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <PermissionGate module="inventory" action="view">
                  <Link
                    to="/app/inventory"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inventory
                  </Link>
                </PermissionGate>
                
                <PermissionGate module="pos" action="view">
                  <Link
                    to="/app/pos"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    POS
                  </Link>
                </PermissionGate>
                
                <PermissionGate module="vendors" action="view">
                  <Link
                    to="/app/vendors"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Vendors
                  </Link>
                </PermissionGate>
                
                <PermissionGate module="purchase_orders" action="view">
                  <Link
                    to="/app/purchase-orders"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Purchase Orders
                  </Link>
                </PermissionGate>
                
                <PermissionGate module="analytics" action="view">
                  <Link
                    to="/app/analytics"
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                </PermissionGate>
                
                <OrgAdminOnly>
                  <PermissionGate module="users" action="view">
                    <Link
                      to="/app/team"
                      className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Team Management
                    </Link>
                  </PermissionGate>
                </OrgAdminOnly>

                <div className="border-t pt-4 space-y-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
