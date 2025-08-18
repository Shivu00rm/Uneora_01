import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { DatabaseService } from "../lib/database";

export function SuperAdminSetup() {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if super admin already exists
  React.useEffect(() => {
    checkSuperAdminExists();
  }, []);

  const checkSuperAdminExists = async () => {
    try {
      // Try to find super admin profile
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("email", "superadmin@uneora.com")
        .eq("role", "super_admin")
        .single();

      if (data) {
        setIsComplete(true);
      }
    } catch (err) {
      // Super admin doesn't exist yet
      console.log("Super admin not found, can create new one");
    } finally {
      setIsChecking(false);
    }
  };

  const createSuperAdmin = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Create the super admin account through Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: "superadmin@uneora.com",
        password: "SuperAdmin123!",
      });

      if (signUpError) {
        console.error("Signup error details:", signUpError);

        if (
          signUpError.message.includes("already been registered") ||
          signUpError.message.includes("already registered")
        ) {
          console.log(
            "Super admin user already exists, will set up profile...",
          );

          // Try to get the user through auth and create/update profile
          try {
            // Try to sign in to get the user ID
            const { data: signInData, error: signInError } =
              await supabase.auth.signInWithPassword({
                email: "superadmin@uneora.com",
                password: "SuperAdmin123!",
              });

            if (signInData.user) {
              console.log("Found existing user, updating profile...");

              await DatabaseService.upsertProfile({
                id: signInData.user.id,
                organization_id: null,
                email: "superadmin@uneora.com",
                name: "Uneora Super Admin",
                role: "super_admin",
              });

              // Sign out after profile update
              await supabase.auth.signOut();

              setIsComplete(true);
              return;
            }
          } catch (profileError) {
            console.error("Profile update error:", profileError);
            // Continue to create new user if profile update fails
          }
        }

        // If it's not a duplicate user error, throw it
        if (!signUpError.message.includes("already")) {
          throw new Error(`Signup failed: ${signUpError.message}`);
        }
      }

      if (data.user) {
        // Update the profile to super_admin role
        await DatabaseService.upsertProfile({
          id: data.user.id,
          organization_id: null,
          email: "superadmin@uneora.com",
          name: "Uneora Super Admin",
          role: "super_admin",
        });

        console.log("Super admin created successfully");
        setIsComplete(true);
      }
    } catch (err: any) {
      console.error("Super admin creation error:", err);

      // Extract meaningful error message
      let errorMessage = "Failed to create super admin";
      if (err.message) {
        errorMessage = err.message;
      } else if (err.error_description) {
        errorMessage = err.error_description;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err.toString && err.toString() !== "[object Object]") {
        errorMessage = err.toString();
      }

      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  if (isChecking) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Checking super admin status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <strong>Email:</strong> superadmin@uneora.com
                <br />
                <strong>Password:</strong> SuperAdmin123!
              </p>
            </div>
            <p className="text-sm text-gray-600">
              You can now login with these credentials to access the super admin
              interface.
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
          Create the super admin account for Uneora management.
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
              <li>• Email: superadmin@uneora.com</li>
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
            {isCreating
              ? "Creating Super Admin..."
              : "Create Super Admin Account"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
