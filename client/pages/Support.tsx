import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Video,
  FileText,
  Headphones
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      title: "Getting Started",
      icon: Book,
      description: "Learn the basics of Uneora",
      articles: [
        "Setting up your account",
        "Adding your first products",
        "Configuring inventory settings",
        "Understanding user roles"
      ]
    },
    {
      title: "Inventory Management",
      icon: FileText,
      description: "Master inventory tracking",
      articles: [
        "Adding and managing products",
        "Stock movements and adjustments",
        "Setting up low stock alerts",
        "Batch and serial number tracking"
      ]
    },
    {
      title: "Point of Sale",
      icon: MessageCircle,
      description: "POS system guidance",
      articles: [
        "Processing sales transactions",
        "Managing customer information",
        "Handling returns and refunds",
        "GST and invoice settings"
      ]
    },
    {
      title: "Reports & Analytics",
      icon: HelpCircle,
      description: "Understanding your data",
      articles: [
        "Generating inventory reports",
        "Sales analytics dashboard",
        "Exporting data to Excel",
        "Custom report creation"
      ]
    }
  ];

  const supportOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: Mail,
      action: "support@uneora.com",
      available: "24/7",
      responseTime: "Within 24 hours"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: MessageCircle,
      action: "Start Chat",
      available: "9 AM - 6 PM IST",
      responseTime: "Immediate"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our experts",
      icon: Phone,
      action: "+91 9876543210",
      available: "9 AM - 6 PM IST",
      responseTime: "Immediate"
    },
    {
      title: "Video Call",
      description: "Screen sharing and personalized help",
      icon: Video,
      action: "Schedule Call",
      available: "By appointment",
      responseTime: "Same day"
    }
  ];

  const quickLinks = [
    {
      title: "System Status",
      description: "Check our current system status",
      icon: ExternalLink,
      href: "#"
    },
    {
      title: "Feature Requests",
      description: "Suggest new features or improvements",
      icon: ExternalLink,
      href: "#"
    },
    {
      title: "Developer API",
      description: "Integration documentation and guides",
      icon: ExternalLink,
      href: "#"
    },
    {
      title: "Training Videos",
      description: "Watch step-by-step tutorials",
      icon: Video,
      href: "#"
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. Enter your email address and we'll send you reset instructions."
    },
    {
      question: "Can I import my existing inventory data?",
      answer: "Yes! You can import data via Excel/CSV files. We also provide free data migration assistance for larger datasets."
    },
    {
      question: "How do I add team members?",
      answer: "Navigate to Team Management in your settings, click 'Add User', and assign appropriate permissions based on their role."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security with SSL encryption, regular backups, and comply with data protection standards."
    },
    {
      question: "Can I use Uneora offline?",
      answer: "Uneora works best with an internet connection, but our mobile app has limited offline capabilities for essential functions."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          Help & Support
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          How can we help you?
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Find answers to your questions, learn how to use Uneora effectively, 
          or get in touch with our support team.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search for help articles, guides, and FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-4 text-lg"
          />
        </div>
      </div>

      {/* Support Options */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Get Support</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">Available: {option.available}</div>
                    <div className="text-sm text-gray-500">Response: {option.responseTime}</div>
                  </div>
                  <Button className="w-full">
                    {option.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Help Categories */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Browse Help Topics</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {helpCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>{category.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <a 
                          href="#" 
                          className="flex items-center justify-between text-gray-700 hover:text-primary transition-colors"
                        >
                          <span className="text-sm">{article}</span>
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Quick Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <a href={link.href} className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                      <div className="font-medium">{link.title}</div>
                      <div className="text-sm text-gray-600">{link.description}</div>
                    </div>
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-primary/5 rounded-lg p-8">
        <Headphones className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Our support team is here to help you succeed. Get personalized assistance 
          and expert guidance for your specific business needs.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/contact">Contact Support</Link>
          </Button>
          <Button variant="outline" size="lg">
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
