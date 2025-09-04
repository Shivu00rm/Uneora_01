import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Rocket } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">
          About Uneora
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Empowering Indian MSMEs with
          <span className="text-primary"> Smart Automation</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          India's first automation-native inventory management platform designed specifically 
          for Manufacturing, Retail, and Wholesale businesses. We help MSMEs scale with 
          intelligent automation and seamless integrations.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <CardTitle>Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              To democratize business automation for Indian MSMEs by providing 
              enterprise-grade inventory management tools that are simple, 
              affordable, and purpose-built for local business needs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Rocket className="h-8 w-8 text-primary" />
              <CardTitle>Our Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              To become the backbone of India's digital economy by enabling 
              10 million MSMEs to scale efficiently through smart automation 
              and data-driven business insights.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Company Stats */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">10,000+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">₹100Cr+</div>
            <div className="text-gray-600">Inventory Managed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-gray-600">Cities Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Customer-First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Every feature we build is designed with our customers' success in mind. 
                We listen, learn, and iterate based on real business needs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Quality & Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We maintain enterprise-grade security standards and ensure 
                99.9% uptime for businesses that depend on us daily.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Rocket className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Innovation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We continuously innovate with AI, automation, and emerging 
                technologies to keep our customers ahead of the curve.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Built for India, by Indians</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-8">
          Our team combines deep expertise in enterprise software with intimate 
          understanding of Indian business culture. We're not just building software; 
          we're crafting solutions that understand the unique challenges and 
          opportunities of the Indian market.
        </p>
        <div className="bg-primary/5 rounded-lg p-6">
          <p className="text-primary font-semibold">
            "Technology should empower, not complicate. That's why we build tools 
            that feel intuitive to use and deliver real business value from day one."
          </p>
          <p className="text-gray-600 mt-2">- Uneora Team</p>
        </div>
      </div>
    </div>
  );
}
