import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users,
  Store,
  Shield,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { StorePermission, UserRole } from "@shared/api";

interface StorePermissionsProps {
  storeId: string;
  storeName: string;
}

// Mock data for demonstration
const mockStorePermissions: StorePermission[] = [
  {
    id: "perm-1",
    userId: "user-1",
    storeId: "store-1",
    role: "STORE_MANAGER",
    permissions: {
      inventory: ["view", "create", "edit", "delete", "export"],
      pos: ["view", "create", "refund"],
      reports: ["view", "export"],
      settings: ["view", "edit"],
      staff: ["view", "create", "edit"],
      ecommerce: ["view", "sync"]
    },
    isActive: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "perm-2",
    userId: "user-2",
    storeId: "store-1",
    role: "CASHIER",
    permissions: {
      inventory: ["view"],
      pos: ["view", "create"],
      reports: [],
      settings: [],
      staff: [],
      ecommerce: []
    },
    isActive: true,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z"
  },
  {
    id: "perm-3",
    userId: "user-3",
    storeId: "store-1",
    role: "ONLINE_OPS_MANAGER",
    permissions: {
      inventory: ["view", "edit"],
      pos: [],
      reports: ["view"],
      settings: [],
      staff: [],
      ecommerce: ["view", "create", "edit", "sync", "manage"]
    },
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z"
  }
];

const mockUsers = [
  { id: "user-1", name: "Rajesh Kumar", email: "rajesh@company.com", role: "STORE_MANAGER" },
  { id: "user-2", name: "Priya Sharma", email: "priya@company.com", role: "CASHIER" },
  { id: "user-3", name: "Amit Patel", email: "amit@company.com", role: "ONLINE_OPS_MANAGER" },
  { id: "user-4", name: "Neha Singh", email: "neha@company.com", role: "ORG_USER" }
];

const permissionModules = [
  {
    key: "inventory",
    label: "Inventory Management",
    description: "Product catalog, stock levels, and inventory tracking",
    actions: ["view", "create", "edit", "delete", "export"]
  },
  {
    key: "pos",
    label: "Point of Sale",
    description: "Sales transactions, billing, and customer management",
    actions: ["view", "create", "refund"]
  },
  {
    key: "reports",
    label: "Reports & Analytics",
    description: "Sales reports, analytics, and performance metrics",
    actions: ["view", "export"]
  },
  {
    key: "settings",
    label: "Store Settings",
    description: "Store configuration and operational settings",
    actions: ["view", "edit"]
  },
  {
    key: "staff",
    label: "Staff Management",
    description: "Manage store team members and their permissions",
    actions: ["view", "create", "edit", "delete"]
  },
  {
    key: "ecommerce",
    label: "E-commerce Integration",
    description: "Online platform sync and management",
    actions: ["view", "create", "edit", "sync", "manage"]
  }
];

const roleTemplates: Record<UserRole, Record<string, string[]>> = {
  SUPER_ADMIN: {
    inventory: ["view", "create", "edit", "delete", "export"],
    pos: ["view", "create", "refund"],
    reports: ["view", "export"],
    settings: ["view", "edit"],
    staff: ["view", "create", "edit", "delete"],
    ecommerce: ["view", "create", "edit", "sync", "manage"]
  },
  ORG_ADMIN: {
    inventory: ["view", "create", "edit", "delete", "export"],
    pos: ["view", "create", "refund"],
    reports: ["view", "export"],
    settings: ["view", "edit"],
    staff: ["view", "create", "edit", "delete"],
    ecommerce: ["view", "create", "edit", "sync", "manage"]
  },
  STORE_MANAGER: {
    inventory: ["view", "create", "edit", "delete", "export"],
    pos: ["view", "create", "refund"],
    reports: ["view", "export"],
    settings: ["view", "edit"],
    staff: ["view", "create", "edit"],
    ecommerce: ["view", "sync"]
  },
  CASHIER: {
    inventory: ["view"],
    pos: ["view", "create"],
    reports: [],
    settings: [],
    staff: [],
    ecommerce: []
  },
  ONLINE_OPS_MANAGER: {
    inventory: ["view", "edit"],
    pos: [],
    reports: ["view"],
    settings: [],
    staff: [],
    ecommerce: ["view", "create", "edit", "sync", "manage"]
  },
  ORG_USER: {
    inventory: ["view", "edit"],
    pos: ["view", "create"],
    reports: ["view"],
    settings: [],
    staff: [],
    ecommerce: []
  }
};

export function StorePermissions({ storeId, storeName }: StorePermissionsProps) {
  const { hasPermission, canManageStore } = useAuth();
  const [permissions, setPermissions] = useState<StorePermission[]>(mockStorePermissions);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("CASHIER");
  const [customPermissions, setCustomPermissions] = useState<Record<string, string[]>>({});

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'STORE_MANAGER': return 'bg-blue-500';
      case 'CASHIER': return 'bg-green-500';
      case 'ONLINE_OPS_MANAGER': return 'bg-purple-500';
      case 'ORG_USER': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setCustomPermissions(roleTemplates[role]);
  };

  const handlePermissionToggle = (module: string, action: string) => {
    setCustomPermissions(prev => {
      const modulePerms = prev[module] || [];
      const hasPermission = modulePerms.includes(action);
      
      return {
        ...prev,
        [module]: hasPermission 
          ? modulePerms.filter(p => p !== action)
          : [...modulePerms, action]
      };
    });
  };

  const handleAddUser = () => {
    if (!selectedUser) return;

    const newPermission: StorePermission = {
      id: `perm-${Date.now()}`,
      userId: selectedUser,
      storeId,
      role: selectedRole,
      permissions: customPermissions,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPermissions(prev => [...prev, newPermission]);
    setShowAddUser(false);
    setSelectedUser("");
    setSelectedRole("CASHIER");
    setCustomPermissions({});
  };

  const handleToggleUser = (permissionId: string) => {
    setPermissions(prev => prev.map(p => 
      p.id === permissionId 
        ? { ...p, isActive: !p.isActive }
        : p
    ));
  };

  const handleRemoveUser = (permissionId: string) => {
    if (confirm("Are you sure you want to remove this user's access?")) {
      setPermissions(prev => prev.filter(p => p.id !== permissionId));
    }
  };

  const getUserInfo = (userId: string) => {
    return mockUsers.find(u => u.id === userId);
  };

  const getAvailableUsers = () => {
    const assignedUserIds = permissions.map(p => p.userId);
    return mockUsers.filter(u => !assignedUserIds.includes(u.id));
  };

  if (!hasPermission("staff", "view") && !canManageStore(storeId)) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">You don't have permission to view store permissions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Store Permissions
          </h2>
          <p className="text-gray-600">Manage user access and permissions for {storeName}</p>
        </div>
        {(hasPermission("staff", "create") || canManageStore(storeId)) && (
          <Button onClick={() => setShowAddUser(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">User Access</TabsTrigger>
          <TabsTrigger value="roles">Role Templates</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Current Users */}
          <div className="grid gap-4">
            {permissions.map((permission) => {
              const user = getUserInfo(permission.userId);
              if (!user) return null;

              return (
                <Card key={permission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {permission.isActive ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${getRoleColor(permission.role)} text-white border-none`}
                        >
                          {permission.role.replace('_', ' ')}
                        </Badge>
                        {!permission.isActive && (
                          <Badge variant="outline" className="text-gray-500">
                            Inactive
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Permission Summary */}
                        <div className="text-sm text-gray-600 mr-4">
                          {Object.values(permission.permissions).flat().length} permissions
                        </div>

                        {/* Actions */}
                        {(hasPermission("staff", "edit") || canManageStore(storeId)) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleUser(permission.id)}
                            >
                              {permission.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => console.log("Edit user:", permission.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveUser(permission.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Permission Details */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {permissionModules.map((module) => {
                        const modulePerms = permission.permissions[module.key] || [];
                        return (
                          <div key={module.key} className="text-sm">
                            <div className="font-medium text-gray-700">{module.label}</div>
                            <div className="text-gray-600">
                              {modulePerms.length > 0 
                                ? modulePerms.join(", ")
                                : "No access"
                              }
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {permissions.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users assigned</h3>
                <p className="text-gray-500 mb-4">
                  Start by adding team members to this store
                </p>
                {(hasPermission("staff", "create") || canManageStore(storeId)) && (
                  <Button onClick={() => setShowAddUser(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First User
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(roleTemplates).map(([role, permissions]) => (
              <Card key={role}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className={`${getRoleColor(role as UserRole)} text-white`}>
                      {role.replace('_', ' ')}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Default permissions for this role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {permissionModules.map((module) => {
                      const modulePerms = permissions[module.key] || [];
                      return (
                        <div key={module.key} className="text-sm">
                          <div className="font-medium text-gray-700">{module.label}</div>
                          <div className="text-gray-600">
                            {modulePerms.length > 0 
                              ? modulePerms.join(", ")
                              : "No access"
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Complete overview of all permissions by module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Module</th>
                      <th className="text-left py-2">Store Manager</th>
                      <th className="text-left py-2">Cashier</th>
                      <th className="text-left py-2">Online Ops</th>
                      <th className="text-left py-2">Org User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionModules.map((module) => (
                      <tr key={module.key} className="border-b">
                        <td className="py-3">
                          <div className="font-medium">{module.label}</div>
                          <div className="text-gray-600 text-xs">{module.description}</div>
                        </td>
                        <td className="py-3">
                          <div className="text-xs text-gray-600">
                            {roleTemplates.STORE_MANAGER[module.key]?.join(", ") || "None"}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-xs text-gray-600">
                            {roleTemplates.CASHIER[module.key]?.join(", ") || "None"}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-xs text-gray-600">
                            {roleTemplates.ONLINE_OPS_MANAGER[module.key]?.join(", ") || "None"}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-xs text-gray-600">
                            {roleTemplates.ORG_USER[module.key]?.join(", ") || "None"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">Add User to Store</h3>
              <Button variant="ghost" onClick={() => setShowAddUser(false)}>
                ×
              </Button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* User Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select User</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableUsers().map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={selectedRole} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STORE_MANAGER">Store Manager</SelectItem>
                    <SelectItem value="CASHIER">Cashier</SelectItem>
                    <SelectItem value="ONLINE_OPS_MANAGER">Online Ops Manager</SelectItem>
                    <SelectItem value="ORG_USER">Organization User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Permissions */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Permissions</label>
                {permissionModules.map((module) => (
                  <Card key={module.key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{module.label}</CardTitle>
                      <CardDescription className="text-sm">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {module.actions.map((action) => (
                          <div key={action} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${module.key}-${action}`}
                              checked={customPermissions[module.key]?.includes(action) || false}
                              onCheckedChange={() => handlePermissionToggle(module.key, action)}
                            />
                            <label 
                              htmlFor={`${module.key}-${action}`}
                              className="text-sm font-medium capitalize cursor-pointer"
                            >
                              {action}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setShowAddUser(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser} disabled={!selectedUser}>
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
