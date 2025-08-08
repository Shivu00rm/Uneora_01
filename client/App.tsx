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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Placeholder title="Inventory Management" description="Comprehensive inventory tracking with real-time stock updates, batch management, and automated alerts." feature="Coming Soon" />} />
              <Route path="/pos" element={<Placeholder title="Point of Sale" description="GST-compliant billing system with barcode scanning and integrated payment processing." feature="Coming Soon" />} />
              <Route path="/analytics" element={<Placeholder title="AI Analytics" description="Demand forecasting, vendor scoring, and intelligent business insights powered by AI." feature="AI Powered" />} />
              <Route path="/automation" element={<Placeholder title="Smart Automation" description="Drag-and-drop workflow builder with intelligent triggers and automated actions." feature="Automation" />} />
              <Route path="/ecommerce" element={<Placeholder title="E-commerce Sync" description="Real-time synchronization with Shopify, Amazon, WooCommerce and other platforms." feature="Multi-Channel" />} />
              <Route path="/consulting" element={<Placeholder title="MSME Consulting" description="Expert business consulting services with AI-powered analysis and recommendations." feature="Expert Support" />} />
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
