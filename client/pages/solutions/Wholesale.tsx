import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Warehouse, 
  Package, 
  BarChart3, 
  Truck, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Users,
  Calculator,
  Shield,
  TrendingUp,
  Clock
} from "lucide-react";

export default function Wholesale() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              Wholesale Solutions
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Enterprise Wholesale</span>{" "}
              <span className="bg-gradient-to-r from-primary via-brand-500 to-accent bg-clip-text text-transparent">
                Inventory Control
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Scale your wholesale operations with advanced inventory management, 
              bulk order processing, and multi-warehouse coordination. Built for 
              large-scale distributors and wholesalers in India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Built for Wholesale Scale
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handle massive inventory volumes with enterprise-grade tools and automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bulk Order Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Bulk Order Processing</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Handle large volume orders with automated pricing, bulk discounts, 
                    and streamlined fulfillment processes for wholesale customers.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Multi-Warehouse */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Warehouse className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Multi-Warehouse Management</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Coordinate inventory across multiple warehouses with real-time 
                    stock visibility and intelligent distribution planning.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* B2B Customer Portal */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>B2B Customer Portal</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Provide wholesale customers with self-service portals for 
                    ordering, order tracking, and account management.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Advanced Pricing */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Dynamic Pricing Engine</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Sophisticated pricing rules with volume discounts, customer tiers, 
                    seasonal pricing, and margin optimization.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Supply Chain Analytics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Supply Chain Analytics</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Advanced analytics for demand forecasting, supplier performance, 
                    and inventory optimization across the supply chain.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Compliance & Documentation */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Enterprise Compliance</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Complete audit trails, GST compliance, automated documentation, 
                    and regulatory reporting for enterprise operations.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Wholesale Benefits */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Why Wholesale Leaders Choose FlowStock
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proven to scale with growing wholesale operations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scale Operations Efficiently</h3>
                  <p className="text-muted-foreground">
                    Handle 10x more orders with the same team through automation 
                    and intelligent workflow optimization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Optimize Distribution</h3>
                  <p className="text-muted-foreground">
                    Reduce shipping costs and delivery times with smart warehouse 
                    allocation and route optimization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Accelerate Cash Flow</h3>
                  <p className="text-muted-foreground">
                    Improve cash flow with faster order processing, automated invoicing, 
                    and optimized inventory turnover.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:text-right">
              <Card className="inline-block p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-primary">75%</div>
                    <div className="text-sm text-muted-foreground">Faster order processing</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">45%</div>
                    <div className="text-sm text-muted-foreground">Reduction in carrying costs</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">99.8%</div>
                    <div className="text-sm text-muted-foreground">Order accuracy achieved</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Industries */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Serving Diverse Wholesale Industries
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized solutions for different wholesale sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">FMCG Distribution</h3>
              <p className="text-sm text-muted-foreground">
                High-volume, fast-moving goods with expiry tracking and territory management
              </p>
            </Card>

            <Card className="text-center p-6">
              <Warehouse className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Industrial Supplies</h3>
              <p className="text-sm text-muted-foreground">
                B2B equipment, tools, and materials with technical specifications
              </p>
            </Card>

            <Card className="text-center p-6">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Pharmaceutical Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Regulated products with cold chain, batch tracking, and compliance
              </p>
            </Card>

            <Card className="text-center p-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fashion Wholesale</h3>
              <p className="text-sm text-muted-foreground">
                Seasonal collections, size/color matrices, and fashion cycles
              </p>
            </Card>

            <Card className="text-center p-6">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Electronics Distribution</h3>
              <p className="text-sm text-muted-foreground">
                High-value items with serial tracking and warranty management
              </p>
            </Card>

            <Card className="text-center p-6">
              <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Food & Beverage</h3>
              <p className="text-sm text-muted-foreground">
                Cold chain logistics, expiry management, and quality control
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-primary/10 via-brand-100/20 to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Scale Your Wholesale Operations?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join leading wholesale distributors using FlowStock to optimize 
            their supply chain and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Schedule Wholesale Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
