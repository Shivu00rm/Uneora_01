import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Download,
  Shield,
  UserX,
  UserCheck,
  UserCog,
  Search,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER";
  organization?: string | null;
  status: "active" | "suspended";
  lastLogin: string;
}

const mockUsers: AdminUser[] = [
  {
    id: "u-1",
    email: "owner@flowstock.com",
    name: "System Owner",
    role: "SUPER_ADMIN",
    organization: null,
    status: "active",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "u-2",
    email: "admin@techcorp.com",
    name: "Rajesh Sharma",
    role: "ORG_ADMIN",
    organization: "TechCorp Solutions",
    status: "active",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "u-3",
    email: "user@techcorp.com",
    name: "Priya Patel",
    role: "ORG_USER",
    organization: "TechCorp Solutions",
    status: "active",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "u-4",
    email: "admin@startupxyz.com",
    name: "Anil Kumar",
    role: "ORG_ADMIN",
    organization: "StartupXYZ",
    status: "suspended",
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
  },
];

function toCSV(rows: AdminUser[]) {
  const header = [
    "id",
    "email",
    "name",
    "role",
    "organization",
    "status",
    "lastLogin",
  ].join(",");
  const body = rows
    .map((r) =>
      [
        r.id,
        r.email,
        r.name,
        r.role,
        r.organization ?? "",
        r.status,
        r.lastLogin,
      ]
        .map((v) => `"${String(v).replaceAll('"', '\"')}"`)
        .join(","),
    )
    .join("\n");
  return header + "\n" + body;
}

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [rows, setRows] = useState<AdminUser[]>(mockUsers);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (q === "" ||
            r.email.toLowerCase().includes(q.toLowerCase()) ||
            r.name.toLowerCase().includes(q.toLowerCase())) &&
          (role === "all" || r.role === role) &&
          (status === "all" || r.status === status),
      ),
    [rows, q, role, status],
  );

  const exportCSV = () => {
    const blob = new Blob([toCSV(filtered)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const setUserStatus = (id: string, newStatus: AdminUser["status"]) => {
    setRows((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
    );
  };

  const changeRole = (id: string, newRole: AdminUser["role"]) => {
    setRows((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)),
    );
  };

  const impersonate = async (user: AdminUser) => {
    await fetch("/api/admin/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    alert(
      `Impersonation requested for ${user.email}. This is a secure, audited action.`,
    );
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Global Users
        </CardTitle>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-8 w-56"
            />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="ORG_ADMIN">Org Admin</SelectItem>
              <SelectItem value="ORG_USER">Org User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Org</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {u.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{u.organization ?? "—"}</TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onValueChange={(val) =>
                      changeRole(u.id, val as AdminUser["role"])
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORG_USER">Org User</SelectItem>
                      <SelectItem value="ORG_ADMIN">Org Admin</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={u.status === "active" ? "default" : "destructive"}
                  >
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(u.lastLogin).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {u.status === "active" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUserStatus(u.id, "suspended")}
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUserStatus(u.id, "active")}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Reactivate
                      </Button>
                    )}
                    <Button size="sm" onClick={() => impersonate(u)}>
                      <UserCog className="h-4 w-4 mr-1" />
                      Impersonate
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
