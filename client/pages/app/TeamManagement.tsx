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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  Shield,
  Users as UsersIcon,
  Briefcase,
  User,
  Building2,
  Crown,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Download,
  Mail,
  UserX,
  CheckCircle,
  ArrowUpDown,
  RefreshCw
} from "lucide-react";

// Mock team data for the current organization
const mockTeamMembers = [
  {
    id: 1,
    name: "Rajesh Sharma",
    email: "rajesh@techcorp.com",
    role: "ORG_ADMIN",
    status: "active",
    lastLogin: "2 hours ago",
    joinedDate: "2023-01-15",
    permissions: ["inventory", "pos", "vendors", "purchase_orders", "analytics", "users", "settings"]
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@techcorp.com", 
    role: "ORG_USER",
    status: "active",
    lastLogin: "1 day ago",
    joinedDate: "2023-03-20",
    permissions: ["inventory", "pos", "vendors", "analytics"]
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@techcorp.com",
    role: "ORG_USER",
    status: "active", 
    lastLogin: "5 minutes ago",
    joinedDate: "2023-06-10",
    permissions: ["pos", "inventory"]
  },
  {
    id: 4,
    name: "Sunita Singh",
    email: "sunita@techcorp.com",
    role: "ORG_USER",
    status: "inactive",
    lastLogin: "3 days ago",
    joinedDate: "2023-09-05",
    permissions: ["inventory"]
  }
];

const roleIcons = {
  ORG_ADMIN: Briefcase,
  ORG_USER: User
};

const roleColors = {
  ORG_ADMIN: "default",
  ORG_USER: "secondary"
} as const;

export default function TeamManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredAndSortedMembers = mockTeamMembers
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === "all" || member.role === filterRole;
      const matchesStatus = filterStatus === "all" || member.status === filterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      }

      return 0;
    });

  const activeMembers = mockTeamMembers.filter(m => m.status === "active").length;
  const totalMembers = mockTeamMembers.length;

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredAndSortedMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredAndSortedMembers.map(m => m.id));
    }
  };

  const handleSelectMember = (memberId: number) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleBulkAction = async (action: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (action) {
      case "deactivate":
        console.log("Deactivating members:", selectedMembers);
        break;
      case "activate":
        console.log("Activating members:", selectedMembers);
        break;
      case "delete":
        console.log("Deleting members:", selectedMembers);
        break;
      case "export":
        console.log("Exporting members:", selectedMembers);
        break;
    }

    setSelectedMembers([]);
    setIsLoading(false);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Team Management</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Manage team members for {user?.organizationName}
          </p>
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member to {user?.organizationName}
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
                    <SelectItem value="ORG_ADMIN">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Organization Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="ORG_USER">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Organization User
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> New team members will be added to your organization 
                  ({user?.organizationName}) and will only have access to your organization's data.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="send-invite" defaultChecked />
                <Label htmlFor="send-invite">Send invitation email</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Send Invitation</Button>
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
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">in your organization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Shield className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeMembers / totalMembers) * 100)}% active rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTeamMembers.filter(m => m.role === "ORG_ADMIN").length}
            </div>
            <p className="text-xs text-muted-foreground">Full permissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTeamMembers.filter(m => m.role === "ORG_USER").length}
            </div>
            <p className="text-xs text-muted-foreground">Limited access</p>
          </CardContent>
        </Card>
      </div>

      {/* Organization Context */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Organization Name</Label>
              <p className="text-sm text-muted-foreground">{user?.organizationName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Your Role</Label>
              <div className="flex items-center gap-2">
                <Badge variant="default">
                  {user?.role?.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Team Size</Label>
              <p className="text-sm text-muted-foreground">{totalMembers} members</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Data Isolation:</strong> All team members you manage here will only have access 
              to {user?.organizationName}'s data. They cannot see or modify other organizations' information.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
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
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => {
                const RoleIcon = roleIcons[member.role as keyof typeof roleIcons];
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <RoleIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleColors[member.role as keyof typeof roleColors]}>
                        {member.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === "active" ? "default" : "secondary"}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {member.lastLogin}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.slice(0, 2).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {member.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.permissions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          disabled={member.id === user?.id} // Can't delete yourself
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
    </div>
  );
}
