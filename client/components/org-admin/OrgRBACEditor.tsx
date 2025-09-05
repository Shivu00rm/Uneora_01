import { useState } from "react";
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
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

const MODULES = [
  "dashboard",
  "inventory",
  "stock_movements",
  "pos",
  "vendors",
  "purchase_orders",
  "analytics",
  "files",
  "users",
  "settings",
  "stores",
  "ecommerce",
  "billing",
] as const;

const ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "manage",
  "export",
  "approve",
  "refund",
  "sync",
] as const;

export default function OrgRBACEditor() {
  const { user } = useSupabaseAuth();
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(
    () => {
      const m: Record<string, Record<string, boolean>> = {};
      for (const mod of MODULES) {
        m[mod] = {} as Record<string, boolean>;
        for (const act of ACTIONS) m[mod][act] = act === "view"; // sensible defaults
      }
      return m;
    },
  );

  const toggle = (mod: string, act: string) =>
    setMatrix((prev) => ({
      ...prev,
      [mod]: { ...prev[mod], [act]: !prev[mod][act] },
    }));

  const save = async () => {
    await fetch("/api/admin/org-rbac/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId: user?.organizationId, matrix }),
    });
    alert("Organization RBAC updated (mock) for this organization only");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Organization Permissions
          <span className="block mt-1 text-sm font-normal text-muted-foreground">
            Applies only to {user?.organizationName} users. Other organizations
            are not affected.
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                {ACTIONS.map((a) => (
                  <TableHead key={a} className="text-center capitalize">
                    {a}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODULES.map((mod) => (
                <TableRow key={mod}>
                  <TableCell className="font-medium capitalize">
                    {mod.replace(/_/g, " ")}
                  </TableCell>
                  {ACTIONS.map((a) => (
                    <TableCell key={a} className="text-center">
                      <input
                        type="checkbox"
                        checked={!!matrix[mod][a]}
                        onChange={() => toggle(mod, a)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="pt-4">
          <Button onClick={save}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
