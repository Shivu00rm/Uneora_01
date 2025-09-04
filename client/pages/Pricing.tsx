import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      description: "Perfect for small businesses getting started",
      monthlyPrice: 999,
      annualPrice: 9990,
      popular: false,
      features: [
        "Up to 1,000 products",
        "Basic inventory tracking",
        "Simple POS system", 
        "2 user accounts",
        "Basic reports",
        "Email support",
        "Mobile app access",
        "GST compliance"
      ],
      limitations: [
        "Limited integrations",
        "Basic automation"
      ]
    },
    {
      name: "Growth", 
      icon: Rocket,
      description: "Ideal for growing businesses with advanced needs",
      monthlyPrice: 2499,
      annualPrice: 24990,
      popular: true,
      features: [
        "Up to 10,000 products",
        "Advanced inventory management",
        "Multi-location support",
        "10 user accounts",
        "Advanced analytics",
        "Priority support",
        "API access",
        "Automated workflows",
        "E-commerce integrations",
        "WhatsApp alerts",
        "Custom reports"
      ],
      limitations: []
    },
    {
      name: "Pro",
      icon: Crown,
      description: "For established businesses requiring enterprise features",
      monthlyPrice: 4999,
      annualPrice: 49990,
      popular: false,
      features: [
        "Unlimited products",
        "Enterprise inventory management",
        "Multi-warehouse support",
        "Unlimited users",
        "AI-powered insights",
        "24/7 phone support",
        "Custom integrations",
        "Advanced automation",
        "White-label options",
        "Dedicated account manager",
        "Custom training",
        "SLA guarantee"
      ],
      limitations: []
    }
  ];

  const getPrice = (plan: any) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: any) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice;
    return monthlyCost - annualCost;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          Pricing Plans
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Choose the Perfect Plan for Your Business
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Start with our free trial and upgrade as you grow. All plans include 
          core inventory management, GST compliance, and mobile access.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isAnnual ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isAnnual ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'font-semibold' : 'text-gray-500'}`}>
            Annual
          </span>
          {isAnnual && (
            <Badge variant="secondary" className="text-xs">
              Save up to 17%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={plan.name} 
              className={`relative ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Icon className={`h-12 w-12 ${plan.popular ? 'text-primary' : 'text-gray-600'}`} />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-gray-600 text-sm">{plan.description}</p>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold">₹{getPrice(plan).toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">/{isAnnual ? 'year' : 'month'}</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-green-600 mt-1">
                      Save ₹{getSavings(plan).toLocaleString()}/year
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <Button 
                  asChild
                  className={`w-full mb-6 ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <Link to="/signup">
                    Start Free Trial
                  </Link>
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enterprise Section */}
      <div className="bg-gray-50 rounded-lg p-8 text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Need Something Custom?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          For large enterprises with unique requirements, we offer custom solutions 
          with dedicated infrastructure, advanced security, and personalized support.
        </p>
        <Button variant="outline" size="lg" asChild>
          <Link to="/contact">Contact Sales</Link>
        </Button>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How does the free trial work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get full access to all Growth plan features for 14 days, no credit card required. 
                You can upgrade, downgrade, or cancel anytime during or after the trial.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I change plans later?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect 
                immediately and we'll prorate any billing differences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We accept all major credit cards, UPI, net banking, and can set up 
                bank transfers for annual plans. All payments are processed securely.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is there a setup fee?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                No setup fees for any plan. We also provide free data migration assistance 
                and onboarding support to help you get started quickly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
