import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function SupabaseLogin() {
  const { login, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'ORG_USER' as const
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.name, formData.role);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err: any) {
      console.error('Login error:', err);

      // Extract proper error message from Supabase error object
      let errorMessage = 'Authentication failed';

      if (err.message) {
        errorMessage = err.message;
      } else if (err.error_description) {
        errorMessage = err.error_description;
      } else if (err.msg) {
        errorMessage = err.msg;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.toString && err.toString() !== '[object Object]') {
        errorMessage = err.toString();
      }

      // Handle specific Supabase errors
      if (errorMessage.includes('Invalid API key')) {
        errorMessage = 'Database configuration error. Please check Supabase setup.';
      } else if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again or create an account.';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account.';
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Try signing in instead.';
      } else if (errorMessage.includes('infinite recursion')) {
        errorMessage = 'Database configuration issue. Please try again.';
      }

      setError(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isSignUp ? 'Create Account' : 'Sign In'} - FlowStock
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Create your FlowStock account to get started'
              : 'Sign in to your FlowStock account'
            }
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
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
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
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
