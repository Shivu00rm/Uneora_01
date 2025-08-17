import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  RefreshCw,
  User,
  Mail,
  Building2,
  Calendar,
  Shield,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { DatabaseService } from "../lib/database";
import { supabase } from "../lib/supabase";

interface UserData {
  id: string;
  email: string;
  name?: string;
  role?: string;
  company_id?: string;
  company_name?: string;
  created_at: string;
  email_confirmed: boolean;
}

export function UserDataViewer() {
  const { user, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    if (!isSuperAdmin()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get all users from auth and profiles
      const { data: authUsers, error: authError } = await supabase
        .from("profiles")
        .select(
          `
          id,
          name,
          email,
          role,
          company_id,
          created_at
        `,
        )
        .order("created_at", { ascending: false });

      if (authError) throw authError;

      // Get company names
      const usersWithCompanies = await Promise.all(
        (authUsers || []).map(async (user) => {
          let company_name = undefined;
          if (user.company_id) {
            try {
              const company = await DatabaseService.getCompany(user.company_id);
              company_name = company?.name;
            } catch (error) {
              console.warn("Failed to load company for user:", user.id);
            }
          }

          // Get email confirmation status from auth.users
          const { data: authUser } = await supabase.auth.admin.getUserById(
            user.id,
          );

          return {
            ...user,
            company_name,
            email_confirmed: !!authUser.user?.email_confirmed_at,
          };
        }),
      );

      setUsers(usersWithCompanies);
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user]);

  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">Only Super Admins can view user data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            All Users Data
          </CardTitle>
          <Button
            onClick={loadUserData}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading user data...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No users found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((userData) => (
              <div
                key={userData.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {userData.name || "No name provided"}
                      </span>
                      <Badge
                        variant={
                          userData.role === "SUPER_ADMIN"
                            ? "default"
                            : userData.role === "ORG_ADMIN"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {userData.role?.replace("_", " ") || "No role"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{userData.email || "No email"}</span>
                      {userData.email_confirmed ? (
                        <Badge variant="default" className="text-xs">
                          Confirmed
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Unconfirmed
                        </Badge>
                      )}
                    </div>

                    {userData.company_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span>{userData.company_name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Created:{" "}
                        {new Date(userData.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 font-mono">
                    ID: {userData.id.substring(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📊 Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Total Users:</span>
              <div className="font-bold text-blue-900">{users.length}</div>
            </div>
            <div>
              <span className="text-blue-700">Super Admins:</span>
              <div className="font-bold text-blue-900">
                {users.filter((u) => u.role === "SUPER_ADMIN").length}
              </div>
            </div>
            <div>
              <span className="text-blue-700">Org Admins:</span>
              <div className="font-bold text-blue-900">
                {users.filter((u) => u.role === "ORG_ADMIN").length}
              </div>
            </div>
            <div>
              <span className="text-blue-700">Org Users:</span>
              <div className="font-bold text-blue-900">
                {users.filter((u) => u.role === "ORG_USER").length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
