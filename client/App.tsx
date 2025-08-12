import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SuperAdminProvider } from "./contexts/SuperAdminContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import EmailAuth from "./pages/EmailAuth";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import StockMovements from "./pages/StockMovements";
import POS from "./pages/POS";
import Vendors from "./pages/Vendors";
import PurchaseOrders from "./pages/PurchaseOrders";
import Analytics from "./pages/Analytics";
import Files from "./pages/Files";
import SuperAdmin from "./pages/SuperAdmin";
import OrganizationMonitor from "./pages/OrganizationMonitor";
import AppDashboard from "./pages/app/AppDashboard";
import TeamManagement from "./pages/app/TeamManagement";
import Manufacturing from "./pages/solutions/Manufacturing";
import Retail from "./pages/solutions/Retail";
import Wholesale from "./pages/solutions/Wholesale";
import { TenantLayout } from "./components/TenantLayout";
import { SuperAdminLayout } from "./components/SuperAdminLayout";
import { RoleRoute } from "./components/ProtectedRoute";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Development-only component for role switching
const DevRoleSelector = React.lazy(() =>
  import("./components/RoleSelector").then(module => ({
    default: module.RoleSelector
  }))
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SuperAdminProvider>
            <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
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
                      <ProtectedRoute requiredModule="stock_movements" requiredAction="view">
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
                      <ProtectedRoute requiredModule="purchase_orders" requiredAction="view">
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

                  {/* Owner/Manager Only Routes */}
                  <Route
                    path="/automation"
                    element={
                      <ProtectedRoute requiredRole="manager">
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
                      <ProtectedRoute requiredRole="manager">
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
                      <ProtectedRoute requiredRole="manager">
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
                      <ProtectedRoute requiredRole="manager">
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
                                <ProtectedRoute requiredModule="inventory" requiredAction="view">
                                  <Inventory />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="stock-movements"
                              element={
                                <ProtectedRoute requiredModule="stock_movements" requiredAction="view">
                                  <StockMovements />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="pos"
                              element={
                                <ProtectedRoute requiredModule="pos" requiredAction="view">
                                  <POS />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="vendors"
                              element={
                                <ProtectedRoute requiredModule="vendors" requiredAction="view">
                                  <Vendors />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="purchase-orders"
                              element={
                                <ProtectedRoute requiredModule="purchase_orders" requiredAction="view">
                                  <PurchaseOrders />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="analytics"
                              element={
                                <ProtectedRoute requiredModule="analytics" requiredAction="view">
                                  <Analytics />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="files"
                              element={
                                <ProtectedRoute requiredModule="files" requiredAction="view">
                                  <Files />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="team"
                              element={
                                <ProtectedRoute allowedRoles={["ORG_ADMIN"]} requiredModule="users" requiredAction="view">
                                  <TeamManagement />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="settings"
                              element={
                                <ProtectedRoute allowedRoles={["ORG_ADMIN"]} requiredModule="settings" requiredAction="view">
                                  <Placeholder
                                    title="Organization Settings"
                                    description="Manage your organization's settings and preferences."
                                    feature="Settings"
                                  />
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
          </BrowserRouter>
          </SuperAdminProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
