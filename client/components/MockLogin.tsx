import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, Shield, Building2 } from 'lucide-react';

export function MockLogin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Mock login function for testing
  const mockLogin = async (role: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'ORG_USER') => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser = {
      id: `mock-${role.toLowerCase()}`,
      name: role === 'SUPER_ADMIN' ? 'System Admin' : role === 'ORG_ADMIN' ? 'Organization Admin' : 'Regular User',
      email: `${role.toLowerCase()}@flowstock.com`,
      role,
      status: 'active' as const,
      organizationId: role === 'SUPER_ADMIN' ? null : 'mock-org-1',
      organizationName: role === 'SUPER_ADMIN' ? undefined : 'Demo Company',
      permissions: {} // Will be filled by role
    };
    
    // Trigger navigation by setting localStorage and reloading
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    window.location.reload();
    
    setLoading(false);
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Already Logged In</CardTitle>
            <CardDescription>
              You are logged in as {user.name} ({user.role})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                localStorage.removeItem('mock_user');
                window.location.reload();
              }}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>FlowStock Demo Login</CardTitle>
          <CardDescription>
            Choose a role to test the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => mockLogin('SUPER_ADMIN')}
            disabled={loading}
            className="w-full flex items-center gap-2"
            variant="default"
          >
            <Shield className="h-4 w-4" />
            Login as Super Admin
          </Button>
          
          <Button
            onClick={() => mockLogin('ORG_ADMIN')}
            disabled={loading}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Building2 className="h-4 w-4" />
            Login as Organization Admin
          </Button>
          
          <Button
            onClick={() => mockLogin('ORG_USER')}
            disabled={loading}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <User className="h-4 w-4" />
            Login as Organization User
          </Button>
          
          {loading && (
            <p className="text-center text-sm text-gray-600">
              Logging in...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
