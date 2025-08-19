import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader2, AlertCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { SuperAdminSetup } from "./SuperAdminSetup";

export function SupabaseLogin() {
  const { login, signUp, loading, user, getDefaultRoute } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signup");
  const [showSuperAdminSetup, setShowSuperAdminSetup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "ORG_USER" as const,
    companyName: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Update isSignUp state when route changes
  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      const defaultRoute = getDefaultRoute();
      console.log("User is logged in, redirecting to:", defaultRoute);
      navigate(defaultRoute, { replace: true });
    }
  }, [user, loading, navigate, getDefaultRoute]);

  if (showSuperAdminSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <SuperAdminSetup />
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setShowSuperAdminSetup(false)}
              className="text-sm"
            >
              ← Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (isSignUp) {
      if (!formData.name.trim()) {
        setError("Name is required for sign up");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      if (formData.role === "ORG_ADMIN" && !formData.companyName.trim()) {
        setError("Company name is required for Organization Admin");
        return;
      }
    }

    try {
      if (isSignUp) {
        // For org admins, create company first if provided
        if (formData.role === "ORG_ADMIN" && formData.companyName) {
          // Company creation will be handled in the signup process
          await signUp(
            formData.email,
            formData.password,
            formData.name,
            formData.role,
            formData.companyName,
          );
        } else {
          await signUp(
            formData.email,
            formData.password,
            formData.name,
            formData.role,
          );
        }
      } else {
        await login(formData.email, formData.password);
        // After successful login, redirect to appropriate dashboard
        // Note: The redirect will be handled by the useEffect above when user state updates
      }
    } catch (err: any) {
      console.error("Login error:", err?.message || err?.error || err);

      // Extract proper error message from error object
      let errorMessage = "Authentication failed";

      if (err && typeof err === "object") {
        if (err.message) {
          errorMessage = err.message;
        } else if (err.error_description) {
          errorMessage = err.error_description;
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.msg) {
          errorMessage = err.msg;
        } else if (err.details) {
          errorMessage = err.details;
        } else {
          // Handle complex error objects by extracting meaningful info
          try {
            const errorStr = JSON.stringify(err);
            if (errorStr !== "{}" && errorStr !== "[object Object]") {
              // Try to extract meaningful error info from JSON
              const parsed = JSON.parse(errorStr);
              errorMessage =
                parsed.message ||
                parsed.error ||
                parsed.statusText ||
                "Authentication failed";
            }
          } catch {
            errorMessage = "Authentication failed";
          }
        }
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && err.toString && typeof err.toString === "function") {
        const stringified = err.toString();
        if (stringified !== "[object Object]") {
          errorMessage = stringified;
        }
      }

      // Handle specific Supabase errors
      if (errorMessage.includes("Invalid API key")) {
        errorMessage =
          "Database configuration error. Please check Supabase setup.";
      } else if (errorMessage.includes("Invalid login credentials")) {
        errorMessage =
          "Invalid email or password. Please try again or create an account.";
      } else if (errorMessage.includes("Email not confirmed")) {
        errorMessage = "Please check your email and confirm your account.";
      } else if (errorMessage.includes("User already registered")) {
        errorMessage =
          "An account with this email already exists. Try signing in instead.";
      } else if (errorMessage.includes("infinite recursion")) {
        errorMessage = "Database configuration issue. Please try again.";
      } else if (
        errorMessage.includes("Password should be at least 6 characters")
      ) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (errorMessage.includes("Email not confirmed")) {
        errorMessage =
          "Please wait a moment and try again. If the issue persists, contact support.";
      } else if (errorMessage.includes("row-level security")) {
        errorMessage =
          "Account creation is temporarily disabled. Please contact support.";
      } else if (errorMessage.includes("Permission error")) {
        errorMessage =
          "Account creation failed. Please try again or contact support.";
      }

      // Final safety check to ensure we never display [object Object]
      if (
        errorMessage === "[object Object]" ||
        !errorMessage ||
        errorMessage.trim() === ""
      ) {
        errorMessage = "Authentication failed. Please try again.";
      }

      setError(errorMessage);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-4">
        {/* Development mode indicator */}
        <div className="text-center text-xs text-gray-500">
          🛠️ Development Mode - Demo accounts available below
        </div>

        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col items-center space-y-2 mb-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fb7155483f4aa4218b0fd455934ead78a%2F70167a20be274a39b7819818c11d0910?format=webp&width=800"
                alt="Uneora Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-lg font-semibold text-foreground">Uneora</span>
            </div>
            <CardTitle className="text-center">
              {isSignUp ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp
                ? "Create your Uneora account to get started"
                : "Sign in to your Uneora account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password{" "}
                  {isSignUp && (
                    <span className="text-xs text-gray-500">
                      (min 6 characters)
                    </span>
                  )}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isSignUp
                      ? "Enter password (min 6 characters)"
                      : "Enter your password"
                  }
                  required
                  minLength={isSignUp ? 6 : undefined}
                />
              </div>

              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="ORG_USER">Organization User</option>
                      <option value="ORG_ADMIN">Organization Admin</option>
                    </select>
                  </div>

                  {(formData.role === "ORG_ADMIN" ||
                    formData.role === "SUPER_ADMIN") && (
                    <div className="space-y-2">
                      <label
                        htmlFor="companyName"
                        className="text-sm font-medium"
                      >
                        Company Name{" "}
                        {formData.role === "ORG_ADMIN"
                          ? "(Required)"
                          : "(Optional)"}
                      </label>
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        required={formData.role === "ORG_ADMIN"}
                      />
                    </div>
                  )}
                </>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </Button>

                {!isSignUp && (
                  <div className="border-t pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSuperAdminSetup(true)}
                      className="text-xs flex items-center gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      Setup Super Admin
                    </Button>
                  </div>
                )}
              </div>

              {/* Demo Accounts Section - Show for both login and signup */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  💡 Demo Accounts:
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        email: "admin@uneora.com",
                        password: "admin123",
                      }));
                    }}
                    className="w-full text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-xs text-blue-700">
                      <strong>Super Admin:</strong> admin@uneora.com / admin123
                      <div className="text-gray-600">Full platform access</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        email: "admin@techcorp.com",
                        password: "admin123",
                      }));
                    }}
                    className="w-full text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-xs text-blue-700">
                      <strong>Org Admin:</strong> admin@techcorp.com / admin123
                      <div className="text-gray-600">
                        Organization management
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        email: "user@techcorp.com",
                        password: "user123",
                      }));
                    }}
                    className="w-full text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-xs text-blue-700">
                      <strong>Org User:</strong> user@techcorp.com / user123
                      <div className="text-gray-600">
                        Basic inventory access
                      </div>
                    </div>
                  </button>
                </div>
                {isSignUp && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                    <strong>✅ Super Admin Setup:</strong> superadmin@uneora.com
                    / SuperAdmin123!
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
