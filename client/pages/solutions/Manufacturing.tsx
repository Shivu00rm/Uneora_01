import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Factory, 
  Package, 
  BarChart3, 
  Settings, 
  CheckCircle, 
  ArrowRight,
  Cog,
  Truck,
  FileText,
  Shield,
  TrendingUp,
  Clock
} from "lucide-react";

export default function Manufacturing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              Manufacturing Solutions
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Smart Manufacturing</span>{" "}
              <span className="bg-gradient-to-r from-primary via-brand-500 to-accent bg-clip-text text-transparent">
                Inventory Control
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Streamline your manufacturing operations with real-time inventory tracking, 
              production planning, and automated supply chain management. Built for modern 
              manufacturing businesses in India.
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

      {/* Key Features for Manufacturing */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Manufacturing-Focused Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage complex manufacturing inventory and production workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Raw Materials Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Raw Materials Tracking</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Real-time tracking of raw materials, components, and supplies with automated 
                    reorder points and supplier management.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Production Planning */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Cog className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Production Planning</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Plan production schedules, track work-in-progress, and manage finished goods 
                    inventory with intelligent forecasting.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Quality Control */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Quality Control</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Track quality metrics, manage batch records, and ensure compliance 
                    with manufacturing standards and regulations.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Supply Chain Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Supply Chain Integration</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Connect with suppliers, manage purchase orders, and optimize 
                    procurement with automated vendor management.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Manufacturing Analytics */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Production Analytics</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Advanced analytics for production efficiency, cost analysis, 
                    and performance optimization with AI-powered insights.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            {/* Compliance & Reporting */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Compliance & Reporting</CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    Automated GST compliance, regulatory reporting, and audit trails 
                    for manufacturing operations and inventory movements.
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Manufacturing Benefits */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Why Manufacturing Companies Choose FlowStock
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Proven results for manufacturing businesses across India
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Reduce Production Costs</h3>
                  <p className="text-muted-foreground">
                    Optimize inventory levels, reduce waste, and improve procurement efficiency 
                    to cut production costs by up to 25%.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Faster Production Cycles</h3>
                  <p className="text-muted-foreground">
                    Streamline workflows, reduce stockouts, and improve production planning 
                    to accelerate time-to-market by 40%.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ensure Compliance</h3>
                  <p className="text-muted-foreground">
                    Maintain regulatory compliance with automated documentation, 
                    traceability, and quality control measures.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:text-right">
              <Card className="inline-block p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-primary">50%</div>
                    <div className="text-sm text-muted-foreground">Reduction in inventory carrying costs</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">99.5%</div>
                    <div className="text-sm text-muted-foreground">Inventory accuracy achieved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">30%</div>
                    <div className="text-sm text-muted-foreground">Faster order fulfillment</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Industry-Specific Features */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Built for Manufacturing Industries
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Specialized features for different manufacturing sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <Factory className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Automotive</h3>
              <p className="text-sm text-muted-foreground">Parts tracking, assembly management, just-in-time inventory</p>
            </Card>

            <Card className="text-center p-6">
              <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Electronics</h3>
              <p className="text-sm text-muted-foreground">Component sourcing, BOM management, revision control</p>
            </Card>

            <Card className="text-center p-6">
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Textiles</h3>
              <p className="text-sm text-muted-foreground">Fabric inventory, dye lot tracking, seasonal planning</p>
            </Card>

            <Card className="text-center p-6">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Pharmaceuticals</h3>
              <p className="text-sm text-muted-foreground">Batch tracking, expiry management, regulatory compliance</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-primary/10 via-brand-100/20 to-accent/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Manufacturing Operations?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join leading manufacturing companies using FlowStock to optimize their 
            inventory and production processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Schedule Manufacturing Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
