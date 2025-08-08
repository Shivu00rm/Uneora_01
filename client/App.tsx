import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/stock-movements" element={<StockMovements />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route
                path="/automation"
                element={
                  <Placeholder
                    title="Smart Automation"
                    description="Drag-and-drop workflow builder with intelligent triggers and automated actions."
                    feature="Automation"
                  />
                }
              />
              <Route
                path="/ecommerce"
                element={
                  <Placeholder
                    title="E-commerce Sync"
                    description="Real-time synchronization with Shopify, Amazon, WooCommerce and other platforms."
                    feature="Multi-Channel"
                  />
                }
              />
              <Route
                path="/consulting"
                element={
                  <Placeholder
                    title="MSME Consulting"
                    description="Expert business consulting services with AI-powered analysis and recommendations."
                    feature="Expert Support"
                  />
                }
              />
              <Route
                path="/payments"
                element={
                  <Placeholder
                    title="Payment Integration"
                    description="Razorpay and UPI integration for seamless payment processing."
                    feature="Razorpay/UPI"
                  />
                }
              />
              <Route
                path="/alerts"
                element={
                  <Placeholder
                    title="WhatsApp Alerts"
                    description="Automated WhatsApp notifications for stock alerts, orders, and business updates."
                    feature="WhatsApp API"
                  />
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
