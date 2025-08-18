import { Link } from "react-router-dom";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fb7155483f4aa4218b0fd455934ead78a%2F70167a20be274a39b7819818c11d0910?format=webp&width=800"
                alt="Uneora Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-foreground">
                Uneora
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              India's first automation-native inventory management platform for
              MSMEs. GST-compliant, mobile-friendly, AI-powered.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/inventory"
                  className="hover:text-foreground transition-colors"
                >
                  Inventory Management
                </Link>
              </li>
              <li>
                <Link
                  to="/pos"
                  className="hover:text-foreground transition-colors"
                >
                  Point of Sale
                </Link>
              </li>
              <li>
                <Link
                  to="/automation"
                  className="hover:text-foreground transition-colors"
                >
                  Automation
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  className="hover:text-foreground transition-colors"
                >
                  AI Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/ecommerce"
                  className="hover:text-foreground transition-colors"
                >
                  E-commerce Sync
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Solutions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/solutions/retail"
                  className="hover:text-foreground transition-colors"
                >
                  Retail
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/wholesale"
                  className="hover:text-foreground transition-colors"
                >
                  Wholesale
                </Link>
              </li>
              <li>
                <Link
                  to="/solutions/manufacturing"
                  className="hover:text-foreground transition-colors"
                >
                  Manufacturing
                </Link>
              </li>
              <li>
                <Link
                  to="/consulting"
                  className="hover:text-foreground transition-colors"
                >
                  MSME Consulting
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-foreground transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Uneora. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/security"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
