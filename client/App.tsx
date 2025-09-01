import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import {
  SupabaseAuthProvider,
  useSupabaseAuth,
} from "./contexts/SupabaseAuthContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SuperAdminProvider } from "./contexts/SuperAdminContext";
import { ProtectedRoute } from "./components/SupabaseProtectedRoute";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import { SupabaseLogin } from "./components/SupabaseLogin";
import EmailAuth from "./pages/EmailAuth";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import StockMovements from "./pages/StockMovements";
import POS from "./pages/POS";
import Vendors from "./pages/Vendors";
import PurchaseOrders from "./pages/PurchaseOrders";
import Analytics from "./pages/Analytics";
import Files from "./pages/Files";
import Settings from "./pages/Settings";
import SuperAdmin from "./pages/SuperAdmin";
import OrganizationMonitor from "./pages/OrganizationMonitor";
import AppDashboard from "./pages/app/AppDashboard";
import TeamManagement from "./pages/app/TeamManagement";
import AppSettings from "./pages/app/AppSettings";
import Billing from "./pages/app/Billing";
import Manufacturing from "./pages/solutions/Manufacturing";
import Retail from "./pages/solutions/Retail";
import Wholesale from "./pages/solutions/Wholesale";
import { TenantLayout } from "./components/TenantLayout";
import { SuperAdminLayout } from "./components/SuperAdminLayout";
import { RoleRoute } from "./components/SupabaseProtectedRoute";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Development-only component for role switching
const DevRoleSelector = React.lazy(() =>
  import("./components/RoleSelector").then((module) => ({
    default: module.RoleSelector,
  })),
);

// Conditional header that doesn't render on tenant routes
function ConditionalHeader() {
  const location = useLocation();

  // Don't render header on tenant routes since TenantLayout provides its own header
  if (
    location.pathname.startsWith("/app/") ||
    location.pathname === "/login" ||
    location.pathname.startsWith("/super-admin") ||
    location.pathname.startsWith("/org-flows")
  ) {
    return null;
  }

  return <Header />;
}

// Auth-aware routing wrapper
function AuthenticatedApp() {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return <LoadingScreen message="Authenticating..." fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ConditionalHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<SupabaseLogin />} />
          <Route path="/signup" element={<SupabaseLogin />} />
          <Route path="/email-auth" element={<EmailAuth />} />

          {/* Solution Pages */}
          <Route path="/solutions/manufacturing" element={<Manufacturing />} />
          <Route path="/solutions/retail" element={<Retail />} />
          <Route path="/solutions/wholesale" element={<Wholesale />} />

          {/* Legacy Protected Routes - Redirect to role-appropriate routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredModule="dashboard" requiredAction="view">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredModule="users" requiredAction="view">
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute requiredModule="inventory" requiredAction="view">
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-movements"
            element={
              <ProtectedRoute
                requiredModule="stock_movements"
                requiredAction="view"
              >
                <StockMovements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pos"
            element={
              <ProtectedRoute requiredModule="pos" requiredAction="view">
                <POS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute requiredModule="vendors" requiredAction="view">
                <Vendors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <ProtectedRoute
                requiredModule="purchase_orders"
                requiredAction="view"
              >
                <PurchaseOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requiredModule="analytics" requiredAction="view">
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/files"
            element={
              <ProtectedRoute requiredModule="files" requiredAction="view">
                <Files />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredModule="settings" requiredAction="view">
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Owner/Manager Only Routes */}
          <Route
            path="/automation"
            element={
              <ProtectedRoute allowedRoles={["ORG_ADMIN"]}>
                <Placeholder
                  title="Smart Automation"
                  description="Drag-and-drop workflow builder with intelligent triggers and automated actions."
                  feature="Automation"
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ecommerce"
            element={
              <ProtectedRoute allowedRoles={["ORG_ADMIN"]}>
                <Placeholder
                  title="E-commerce Sync"
                  description="Real-time synchronization with Shopify, Amazon, WooCommerce and other platforms."
                  feature="Multi-Channel"
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consulting"
            element={
              <ProtectedRoute allowedRoles={["ORG_ADMIN"]}>
                <Placeholder
                  title="MSME Consulting"
                  description="Expert business consulting services with AI-powered analysis and recommendations."
                  feature="Expert Support"
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={["ORG_ADMIN"]}>
                <Placeholder
                  title="Payment Integration"
                  description="Razorpay and UPI integration for seamless payment processing."
                  feature="Razorpay/UPI"
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute requiredModule="settings" requiredAction="view">
                <Placeholder
                  title="WhatsApp Alerts"
                  description="Automated WhatsApp notifications for stock alerts, orders, and business updates."
                  feature="WhatsApp API"
                />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes */}
          <Route
            path="/super-admin"
            element={
              <RoleRoute allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminLayout>
                  <SuperAdmin />
                </SuperAdminLayout>
              </RoleRoute>
            }
          />
          <Route
            path="/org-flows"
            element={
              <RoleRoute allowedRoles={["SUPER_ADMIN"]}>
                <SuperAdminLayout>
                  <OrganizationMonitor />
                </SuperAdminLayout>
              </RoleRoute>
            }
          />

          {/* Tenant App Routes */}
          <Route
            path="/app/*"
            element={
              <RoleRoute allowedRoles={["ORG_ADMIN", "ORG_USER"]}>
                <TenantLayout>
                  <Routes>
                    <Route path="dashboard" element={<AppDashboard />} />
                    <Route
                      path="inventory"
                      element={
                        <ProtectedRoute
                          requiredModule="inventory"
                          requiredAction="view"
                        >
                          <Inventory />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="stock-movements"
                      element={
                        <ProtectedRoute
                          requiredModule="stock_movements"
                          requiredAction="view"
                        >
                          <StockMovements />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="pos"
                      element={
                        <ProtectedRoute
                          requiredModule="pos"
                          requiredAction="view"
                        >
                          <POS />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="vendors"
                      element={
                        <ProtectedRoute
                          requiredModule="vendors"
                          requiredAction="view"
                        >
                          <Vendors />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="purchase-orders"
                      element={
                        <ProtectedRoute
                          requiredModule="purchase_orders"
                          requiredAction="view"
                        >
                          <PurchaseOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="analytics"
                      element={
                        <ProtectedRoute
                          requiredModule="analytics"
                          requiredAction="view"
                        >
                          <Analytics />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="files"
                      element={
                        <ProtectedRoute
                          requiredModule="files"
                          requiredAction="view"
                        >
                          <Files />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="team"
                      element={
                        <ProtectedRoute
                          allowedRoles={["ORG_ADMIN"]}
                          requiredModule="users"
                          requiredAction="view"
                        >
                          <TeamManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="settings"
                      element={
                        <ProtectedRoute
                          requiredModule="settings"
                          requiredAction="view"
                        >
                          <AppSettings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="billing"
                      element={
                        <ProtectedRoute allowedRoles={["ORG_ADMIN"]}>
                          <Billing />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </TenantLayout>
              </RoleRoute>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {/* Development-only role selector */}
      {import.meta.env.DEV && (
        <React.Suspense fallback={null}>
          <DevRoleSelector />
        </React.Suspense>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SupabaseAuthProvider>
            <AuthProvider>
              <SuperAdminProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AuthenticatedApp />
                </BrowserRouter>
              </SuperAdminProvider>
            </AuthProvider>
          </SupabaseAuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
