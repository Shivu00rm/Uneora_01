import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlugZap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const data = [
  {
    org: "TechCorp Solutions",
    services: [
      { name: "Google Drive", status: "connected" },
      { name: "Slack", status: "connected" },
      { name: "Zapier", status: "error" },
    ],
  },
  {
    org: "StartupXYZ",
    services: [
      { name: "Google Drive", status: "disconnected" },
      { name: "Zapier", status: "connected" },
    ],
  },
];

const statusVariant = (s: string) =>
  s === "connected"
    ? "default"
    : s === "error"
      ? "destructive"
      : ("outline" as const);

export default function TenantIntegrations() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <PlugZap className="h-5 w-5" />
          Tenant Integrations
        </CardTitle>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Integrations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.org}>
                <TableCell>{row.org}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {row.services.map((s) => (
                      <Badge key={s.name} variant={statusVariant(s.status)}>
                        {s.name}: {s.status}
                      </Badge>
                    ))}
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
