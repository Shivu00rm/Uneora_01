import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Store, 
  Package, 
  BarChart3, 
  ShoppingCart, 
  CheckCircle, 
  ArrowRight,
  CreditCard,
  Smartphone,
  Globe,
  Zap,
  TrendingUp,
  Users
} from "lucide-react";

export default function Retail() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              Retail Solutions
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Smart Retail</span>{" "}
              <span className="bg-gradient-to-r from-primary via-brand-500 to-accent bg-clip-text text-transparent">
                Inventory Management
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Revolutionize your retail business with intelligent inventory management, 
              omnichannel synchronization, and AI-powered analytics. Perfect for modern 
              retail stores across India.
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
          </div>
        </div>
      </section>

      {/* Retail Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Built for Modern Retail
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage retail inventory across multiple channels and locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* POS Integration */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart POS System</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Integrated point-of-sale with real-time inventory updates, barcode scanning, 
                    and GST-compliant billing for seamless transactions.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Omnichannel Sync */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Omnichannel Sync</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Synchronize inventory across online stores (Shopify, Amazon, WooCommerce) 
                    and physical locations in real-time.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Customer Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Customer Insights</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Track customer purchase patterns, manage loyalty programs, 
                    and personalize shopping experiences with AI analytics.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Mobile Ready */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Mobile Commerce</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Mobile-first design for on-the-go inventory management, 
                    mobile payments, and staff productivity tools.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Smart Analytics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Retail Analytics</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Advanced retail metrics including sales forecasting, demand planning, 
                    and profitability analysis with AI-powered insights.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Automation */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Smart Automation</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Automated reordering, price optimization, promotional management, 
                    and inventory alerts to reduce manual work.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Proven Results for Retail Businesses
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how FlowStock transforms retail operations across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="text-sm text-muted-foreground">Reduction in stockouts</div>
            </Card>
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">25%</div>
              <div className="text-sm text-muted-foreground">Increase in inventory turnover</div>
            </Card>
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">60%</div>
              <div className="text-sm text-muted-foreground">Faster checkout processes</div>
            </Card>
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Inventory accuracy</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Retail Types */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Perfect for Every Retail Format
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailored solutions for different retail business models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <Store className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fashion & Apparel</h3>
              <p className="text-sm text-muted-foreground">
                Size/color variants, seasonal inventory, trend analysis, and fast fashion cycles
              </p>
            </Card>

            <Card className="text-center p-6">
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Electronics</h3>
              <p className="text-sm text-muted-foreground">
                Serial number tracking, warranty management, and high-value item security
              </p>
            </Card>

            <Card className="text-center p-6">
              <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">FMCG & Grocery</h3>
              <p className="text-sm text-muted-foreground">
                Expiry date management, batch tracking, and high-volume transactions
              </p>
            </Card>

            <Card className="text-center p-6">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Home & Lifestyle</h3>
              <p className="text-sm text-muted-foreground">
                Seasonal trends, bulk inventory, and customer preference tracking
              </p>
            </Card>

            <Card className="text-center p-6">
              <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Mobile & Accessories</h3>
              <p className="text-sm text-muted-foreground">
                IMEI tracking, model variants, and rapid product lifecycle management
              </p>
            </Card>

            <Card className="text-center p-6">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Multi-Location Chains</h3>
              <p className="text-sm text-muted-foreground">
                Centralized control, inter-store transfers, and franchise management
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-primary/10 via-brand-100/20 to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Revolutionize Your Retail Business?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of retailers already using FlowStock to streamline 
            their inventory and boost sales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Schedule Retail Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
