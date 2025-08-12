import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { PermissionGate, SuperAdminOnly } from "./ProtectedRoute";
import { useAuth, usePermissions } from "@/contexts/AuthContext";
import { useSuperAdmin } from "@/contexts/SuperAdminContext";
import {
  Package,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Crown,
  Activity
} from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const { isSuperAdmin } = useSuperAdmin();
  const location = useLocation();


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FlowStock</span>
          </Link>

          {/* Desktop Navigation - Only show for non-tenant and non-super-admin routes */}
          {user && !location.pathname.startsWith('/app') && !location.pathname.startsWith('/super-admin') && user.role !== "SUPER_ADMIN" && (
            <nav className="hidden md:flex items-center space-x-6">
              <PermissionGate module="dashboard" action="view">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              </PermissionGate>

              <PermissionGate module="inventory" action="view">
                <Link
                  to="/inventory"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Inventory
                </Link>
              </PermissionGate>

              <PermissionGate module="pos" action="view">
                <Link
                  to="/pos"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  POS
                </Link>
              </PermissionGate>

              <PermissionGate module="vendors" action="view">
                <Link
                  to="/vendors"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Vendors
                </Link>
              </PermissionGate>

              <PermissionGate module="analytics" action="view">
                <Link
                  to="/analytics"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analytics
                </Link>
              </PermissionGate>

              <PermissionGate module="users" action="view">
                <Link
                  to="/users"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Users
                </Link>
              </PermissionGate>
            </nav>
          )}

          {/* Super Admin Navigation */}
          {user && user.role === "SUPER_ADMIN" && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/super-admin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Crown className="h-4 w-4" />
                Platform Console
              </Link>
              <Link
                to="/org-flows"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Organization Health
              </Link>
            </nav>
          )}

          {/* Desktop Auth/Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user?.role !== "SUPER_ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.role === "SUPER_ADMIN" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/super-admin" className="flex items-center">
                          <Crown className="mr-2 h-4 w-4" />
                          Platform Console
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/org-flows" className="flex items-center">
                          <Activity className="mr-2 h-4 w-4" />
                          Organization Health
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <PermissionGate module="settings" action="view">
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </PermissionGate>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/email-auth">
                  <Button variant="outline" size="sm">
                    Email Login
                  </Button>
                </Link>
                <Button size="sm">Start Free Trial</Button>
              </>
            )}
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
              {user ? (
                <>

                  {/* Navigation Links - Hide for Super Admin */}
                  {user?.role !== "SUPER_ADMIN" && (
                    <>
                      <PermissionGate module="dashboard" action="view">
                        <Link
                          to="/dashboard"
                          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </PermissionGate>

                      <PermissionGate module="inventory" action="view">
                        <Link
                          to="/inventory"
                          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Inventory
                        </Link>
                      </PermissionGate>

                      <PermissionGate module="pos" action="view">
                        <Link
                          to="/pos"
                          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          POS
                        </Link>
                      </PermissionGate>

                      <PermissionGate module="vendors" action="view">
                        <Link
                          to="/vendors"
                          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Vendors
                        </Link>
                      </PermissionGate>

                      <PermissionGate module="analytics" action="view">
                        <Link
                          to="/analytics"
                          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Analytics
                        </Link>
                      </PermissionGate>

                      <PermissionGate module="users" action="view">
                        <Link
                          to="/users"
                          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Users
                        </Link>
                      </PermissionGate>
                    </>
                  )}

                  {/* Super Admin Navigation */}
                  {user?.role === "SUPER_ADMIN" && (
                    <>
                      <Link
                        to="/super-admin"
                        className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Platform Console
                      </Link>
                      <Link
                        to="/org-flows"
                        className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Organization Health
                      </Link>
                    </>
                  )}

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
                </>
              ) : (
                <div className="border-t pt-4 space-y-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/email-auth">
                    <Button variant="outline" size="sm" className="w-full">
                      Email Login
                    </Button>
                  </Link>
                  <Button size="sm" className="w-full">
                    Start Free Trial
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
