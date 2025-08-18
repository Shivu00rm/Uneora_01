import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { hasValidSupabaseConfig } from "@/lib/supabase";
import { Eye, EyeOff, Loader2, AlertCircle, Info } from "lucide-react";

export default function SupabaseLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loading, error } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);

      // Navigate to the intended route or default route
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDemoAccounts = () => [
    {
      role: "Super Admin",
      email: "admin@uneora.com",
      password: "admin123",
      description: "Full platform access",
      variant: "destructive" as const,
    },
    {
      role: "Org Admin",
      email: "admin@techcorp.com",
      password: "admin123",
      description: "Organization management",
      variant: "secondary" as const,
    },
    {
      role: "Org User",
      email: "user@techcorp.com",
      password: "user123",
      description: "Basic inventory access",
      variant: "outline" as const,
    },
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fb7155483f4aa4218b0fd455934ead78a%2F70167a20be274a39b7819818c11d0910?format=webp&width=800"
              alt="Uneora Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold text-foreground">
              Uneora
            </span>
          </Link>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your Uneora dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasValidSupabaseConfig && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Development Mode:</strong> Using mock authentication.
                  Set real Supabase credentials for production.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                className="w-full"
                type="submit"
                disabled={loading || isSubmitting || !email || !password}
              >
                {(loading || isSubmitting) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading || isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Demo Accounts Section */}
            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm text-muted-foreground text-center font-medium">
                Demo Accounts:
              </p>
              <div className="space-y-2">
                {getDemoAccounts().map((account, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted/50 rounded-lg border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="text-sm font-medium">{account.role}</p>
                        <p className="text-xs text-muted-foreground">
                          {account.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {account.email}
                        </p>
                      </div>
                      <Button
                        variant={account.variant}
                        size="sm"
                        onClick={() =>
                          fillDemoCredentials(account.email, account.password)
                        }
                        disabled={loading || isSubmitting}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Click "Use" to auto-fill credentials for testing
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Contact your administrator
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
