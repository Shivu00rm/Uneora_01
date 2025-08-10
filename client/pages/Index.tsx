import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  BarChart3,
  ShoppingCart,
  Zap,
  Smartphone,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
  Warehouse,
  CreditCard,
  Bot,
  Users,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect authenticated users to their appropriate dashboard
      if (user.role === "SUPER_ADMIN") {
        navigate("/super-admin");
      } else if (user.role === "ORG_ADMIN" || user.role === "ORG_USER") {
        navigate("/app/dashboard");
      } else {
        // Legacy role system fallback
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  // Don't render homepage if user is authenticated
  if (user) {
    return null;
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
            🚀 India's First Automation-Native Inventory Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Smart Inventory for</span>{" "}
            <span className="bg-gradient-to-r from-primary via-brand-500 to-accent bg-clip-text text-transparent">
              Modern MSMEs
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            FlowStock revolutionizes inventory management with AI-powered
            automation, GST compliance, real-time e-commerce sync, and
            intelligent analytics. Built for India's growing businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">
                Businesses Trust FlowStock
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">
                Uptime Guarantee
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50%</div>
              <div className="text-sm text-muted-foreground">
                Time Saved on Average
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20">
              Core Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Everything Your Business Needs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From inventory tracking to AI analytics, FlowStock provides a
              complete ecosystem for modern business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Inventory Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Inventory</CardTitle>
                <CardDescription>
                  Real-time stock tracking with automated low-stock alerts and
                  batch management
                </CardDescription>
              </CardHeader>
            </Card>

            {/* POS System */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>GST-Compliant POS</CardTitle>
                <CardDescription>
                  Integrated billing system with barcode scanning and automatic
                  GST calculations
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Automation */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Workflow className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Smart Automation</CardTitle>
                <CardDescription>
                  Drag-and-drop workflow builder with intelligent triggers and
                  actions
                </CardDescription>
              </CardHeader>
            </Card>

            {/* E-commerce Sync */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>E-commerce Sync</CardTitle>
                <CardDescription>
                  Real-time synchronization with Shopify, Amazon, and
                  WooCommerce
                </CardDescription>
              </CardHeader>
            </Card>

            {/* AI Analytics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>AI Analytics</CardTitle>
                <CardDescription>
                  Demand forecasting, vendor scoring, and intelligent reorder
                  recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Multi-Warehouse */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Warehouse className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Warehouse</CardTitle>
                <CardDescription>
                  Manage multiple locations with centralized control and
                  real-time visibility
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              Simple Pricing
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Choose Your Growth Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, transparent
              pricing for every business size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>
                  Perfect for small businesses getting started
                </CardDescription>
                <div className="text-4xl font-bold">
                  ₹999
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">Inventory Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">GST-Compliant POS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">Basic Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">WhatsApp Alerts</span>
                </div>
                <Button className="w-full mt-6">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="relative border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle>Growth</CardTitle>
                <CardDescription>
                  For growing businesses with multiple channels
                </CardDescription>
                <div className="text-4xl font-bold">
                  ₹2,999
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">Everything in Starter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">E-commerce Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">Smart Automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">Multi-user Access</span>
                </div>
                <Button className="w-full mt-6">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>
                  Enterprise features with AI and consulting
                </CardDescription>
                <div className="text-4xl font-bold">
                  ₹9,999
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">Everything in Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">AI Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">MSME Consulting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm">Priority Support</span>
                </div>
                <Button className="w-full mt-6">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-primary/10 via-brand-100/20 to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of Indian businesses already using FlowStock to
            streamline their operations and boost growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
