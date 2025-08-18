import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  Users as UsersIcon,
  Crown,
  Briefcase,
  User,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock
} from "lucide-react";

// Define all available permissions
const ALL_PERMISSIONS = {
  dashboard: {
    label: "Dashboard",
    description: "View business overview and analytics",
    actions: ["view"]
  },
  inventory: {
    label: "Inventory Management",
    description: "Manage products, stock levels, and inventory",
    actions: ["view", "create", "edit", "delete", "export"]
  },
  stock_movements: {
    label: "Stock Movements",
    description: "Track and record stock in/out transactions",
    actions: ["view", "create", "edit"]
  },
  pos: {
    label: "Point of Sale",
    description: "Process sales and handle billing",
    actions: ["view", "create", "refund"]
  },
  vendors: {
    label: "Vendor Management",
    description: "Manage supplier information and relationships",
    actions: ["view", "create", "edit", "delete"]
  },
  purchase_orders: {
    label: "Purchase Orders",
    description: "Create and manage purchase orders",
    actions: ["view", "create", "edit", "approve", "delete"]
  },
  analytics: {
    label: "Analytics & Reports",
    description: "View business insights and generate reports",
    actions: ["view", "export"]
  },
  users: {
    label: "User Management",
    description: "Manage team members and permissions",
    actions: ["view", "create", "edit", "delete", "permissions"]
  },
  files: {
    label: "File Storage",
    description: "Upload and manage business files",
    actions: ["view", "upload", "delete"]
  },
  settings: {
    label: "System Settings",
    description: "Configure system preferences and business settings",
    actions: ["view", "edit"]
  }
};

// Role definitions with default permissions
const ROLE_DEFINITIONS = {
  owner: {
    label: "Owner",
    description: "Full system access and control",
    defaultPermissions: Object.keys(ALL_PERMISSIONS).reduce((acc, module) => {
      acc[module] = ALL_PERMISSIONS[module as keyof typeof ALL_PERMISSIONS].actions;
      return acc;
    }, {} as Record<string, string[]>),
    canModify: false
  },
  manager: {
    label: "Manager",
    description: "Advanced access with oversight capabilities",
    defaultPermissions: {
      dashboard: ["view"],
      inventory: ["view", "create", "edit", "export"],
      stock_movements: ["view", "create", "edit"],
      pos: ["view", "create", "refund"],
      vendors: ["view", "create", "edit"],
      purchase_orders: ["view", "create", "edit", "approve"],
      analytics: ["view", "export"],
      users: ["view"],
      files: ["view", "upload"],
      settings: ["view"]
    },
    canModify: true
  },
  cashier: {
    label: "Cashier",
    description: "POS and basic inventory access",
    defaultPermissions: {
      dashboard: ["view"],
      inventory: ["view"],
      stock_movements: ["view"],
      pos: ["view", "create"],
      analytics: ["view"],
      files: ["view"]
    },
    canModify: true
  },
  staff: {
    label: "Staff",
    description: "Limited access for general tasks",
    defaultPermissions: {
      dashboard: ["view"],
      inventory: ["view"],
      stock_movements: ["view"],
      files: ["view"]
    },
    canModify: true
  }
};

const mockUsers = [
  {
    id: 1,
    name: "Rajesh Sharma",
    email: "rajesh@uneora.com",
    role: "owner",
    status: "active",
    lastLogin: "2 hours ago",
    permissions: ROLE_DEFINITIONS.owner.defaultPermissions,
    pendingApproval: false
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@uneora.com", 
    role: "manager",
    status: "active",
    lastLogin: "1 day ago",
    permissions: ROLE_DEFINITIONS.manager.defaultPermissions,
    pendingApproval: false
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@uneora.com",
    role: "cashier",
    status: "active", 
    lastLogin: "5 minutes ago",
    permissions: ROLE_DEFINITIONS.cashier.defaultPermissions,
    pendingApproval: false
  },
  {
    id: 4,
    name: "Sunita Singh",
    email: "sunita@uneora.com",
    role: "staff",
    status: "inactive",
    lastLogin: "3 days ago",
    permissions: ROLE_DEFINITIONS.staff.defaultPermissions,
    pendingApproval: true
  }
];

const roleIcons = {
  owner: Crown,
  manager: Briefcase,
  cashier: User,
  staff: User
};

const roleColors = {
  owner: "default",
  manager: "secondary", 
  cashier: "outline",
  staff: "outline"
} as const;

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditPermissionsOpen, setIsEditPermissionsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pendingPermissions, setPendingPermissions] = useState<Record<string, string[]>>({});

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingApprovals = mockUsers.filter(user => user.pendingApproval);

  const handleEditPermissions = (user: any) => {
    setSelectedUser(user);
    setPendingPermissions(user.permissions);
    setIsEditPermissionsOpen(true);
  };

  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    setPendingPermissions(prev => {
      const current = prev[module] || [];
      if (checked) {
        return { ...prev, [module]: [...current, action] };
      } else {
        return { ...prev, [module]: current.filter(a => a !== action) };
      }
    });
  };

  const getPermissionCount = (permissions: Record<string, string[]>) => {
    return Object.values(permissions).reduce((total, actions) => total + actions.length, 0);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage team members with role-based access control and permissions
          </p>
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new team member account with role-based permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
                      <SelectItem key={key} value={key} disabled={key === "owner"}>
                        <div className="flex items-center gap-2">
                          <span>{role.label}</span>
                          {key === "owner" && <Badge variant="outline" className="text-xs">Owner Only</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Default permissions will be assigned based on the selected role. 
                  You can customize permissions after creating the user.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="send-invite" />
                <Label htmlFor="send-invite">Send invitation email</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Create User</Button>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">+1 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.filter(u => u.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockUsers.filter(u => u.status === "active").length / mockUsers.length) * 100)}% active rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Defined</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(ROLE_DEFINITIONS).length}</div>
            <p className="text-xs text-muted-foreground">Permission levels</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="roles">Role Definitions</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Team Members ({filteredUsers.length})</CardTitle>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const RoleIcon = roleIcons[user.role as keyof typeof roleIcons];
                    const permissionCount = getPermissionCount(user.permissions);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <RoleIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant={roleColors[user.role as keyof typeof roleColors]}>
                              {ROLE_DEFINITIONS[user.role as keyof typeof ROLE_DEFINITIONS].label}
                            </Badge>
                            {user.pendingApproval && (
                              <Badge variant="secondary" className="text-xs">
                                Pending Approval
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={user.status === "active" ? "default" : "secondary"}>
                              {user.status}
                            </Badge>
                            {user.status === "active" ? (
                              <Unlock className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{permissionCount} permissions</div>
                            <div className="flex flex-wrap gap-1">
                              {Object.keys(user.permissions).slice(0, 2).map((module) => (
                                <Badge key={module} variant="outline" className="text-xs">
                                  {ALL_PERMISSIONS[module as keyof typeof ALL_PERMISSIONS].label}
                                </Badge>
                              ))}
                              {Object.keys(user.permissions).length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{Object.keys(user.permissions).length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {user.lastLogin}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditPermissions(user)}
                              disabled={user.role === "owner"}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              disabled={user.role === "owner"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(ROLE_DEFINITIONS).map(([key, role]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {React.createElement(roleIcons[key as keyof typeof roleIcons], { 
                        className: "h-5 w-5 text-primary" 
                      })}
                      <CardTitle>{role.label}</CardTitle>
                    </div>
                    <Badge variant={roleColors[key as keyof typeof roleColors]}>
                      {key}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Default Permissions:</div>
                    <div className="space-y-2">
                      {Object.entries(role.defaultPermissions).map(([module, actions]) => (
                        <div key={module} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span className="text-sm">
                            {ALL_PERMISSIONS[module as keyof typeof ALL_PERMISSIONS].label}
                          </span>
                          <div className="flex gap-1">
                            {actions.map((action: string) => (
                              <Badge key={action} variant="outline" className="text-xs">
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Can modify permissions:</span>
                        <span className={role.canModify ? "text-emerald-600" : "text-red-600"}>
                          {role.canModify ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Pending Permission Approvals ({pendingApprovals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <Badge variant="secondary" className="text-xs">
                          Requested: {ROLE_DEFINITIONS[user.role as keyof typeof ROLE_DEFINITIONS].label}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Review Permissions
                        </Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Permissions Dialog */}
      <Dialog open={isEditPermissionsOpen} onOpenChange={setIsEditPermissionsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User Permissions</DialogTitle>
            <DialogDescription>
              Customize permissions for {selectedUser?.name} ({selectedUser?.role})
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(ALL_PERMISSIONS).map(([module, config]) => (
                  <Card key={module}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{config.label}</CardTitle>
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        </div>
                        <Switch 
                          checked={(pendingPermissions[module] || []).length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPendingPermissions(prev => ({ 
                                ...prev, 
                                [module]: [...config.actions] 
                              }));
                            } else {
                              setPendingPermissions(prev => ({ 
                                ...prev, 
                                [module]: [] 
                              }));
                            }
                          }}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {config.actions.map((action) => (
                          <div key={action} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${module}-${action}`}
                              checked={(pendingPermissions[module] || []).includes(action)}
                              onCheckedChange={(checked) => 
                                handlePermissionChange(module, action, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={`${module}-${action}`}
                              className="text-sm capitalize"
                            >
                              {action}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Total permissions: {getPermissionCount(pendingPermissions)}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditPermissionsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // Save permissions logic here
                    setIsEditPermissionsOpen(false);
                  }}>
                    Save Permissions
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
