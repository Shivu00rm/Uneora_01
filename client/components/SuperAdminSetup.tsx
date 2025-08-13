import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DatabaseService } from '../lib/database';

export function SuperAdminSetup() {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSuperAdmin = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Create the super admin account through Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'superadmin@flowstock.com',
        password: 'SuperAdmin123!'
      });

      if (signUpError) {
        if (signUpError.message.includes('already been registered')) {
          // User already exists, just update the profile
          console.log('Super admin user already exists, updating profile...');
          
          // Get the existing user
          const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
          if (listError) throw listError;
          
          const superAdminUser = users.find(u => u.email === 'superadmin@flowstock.com');
          if (!superAdminUser) throw new Error('Could not find super admin user');

          // Update the profile to ensure it's set to super_admin
          await DatabaseService.upsertProfile({
            id: superAdminUser.id,
            organization_id: null,
            email: 'superadmin@flowstock.com',
            name: 'FlowStock Super Admin',
            role: 'super_admin'
          });

          setIsComplete(true);
          return;
        } else {
          throw signUpError;
        }
      }

      if (data.user) {
        // Update the profile to super_admin role
        await DatabaseService.upsertProfile({
          id: data.user.id,
          organization_id: null,
          email: 'superadmin@flowstock.com',
          name: 'FlowStock Super Admin',
          role: 'super_admin'
        });

        console.log('Super admin created successfully');
        setIsComplete(true);
      }
    } catch (err: any) {
      console.error('Super admin creation error:', err);
      setError(err.message || 'Failed to create super admin');
    } finally {
      setIsCreating(false);
    }
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Super Admin Ready
          </CardTitle>
          <CardDescription>
            Super admin account has been set up successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Email:</strong> superadmin@flowstock.com<br />
                <strong>Password:</strong> SuperAdmin123!
              </p>
            </div>
            <p className="text-sm text-gray-600">
              You can now login with these credentials to access the super admin interface.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Setup Super Admin
        </CardTitle>
        <CardDescription>
          Create the super admin account for FlowStock management.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              This will create a super admin account with full system access:
            </p>
            <ul className="text-xs text-blue-700 mt-2 space-y-1">
              <li>• Email: superadmin@flowstock.com</li>
              <li>• Password: SuperAdmin123!</li>
              <li>• Full system administration rights</li>
              <li>• Access to all organizations</li>
            </ul>
          </div>

          <Button
            onClick={createSuperAdmin}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating Super Admin...' : 'Create Super Admin Account'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
