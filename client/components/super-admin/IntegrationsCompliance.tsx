import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { KeyRound, ShieldCheck, RefreshCw, RotateCcw } from "lucide-react";

const rows = [
  { org: "TechCorp", connectors: [
    { name: "Google Drive", keyRotatedAt: "2024-05-01", status: "ok" },
    { name: "Slack", keyRotatedAt: "2024-06-15", status: "ok" },
  ]},
  { org: "StartupXYZ", connectors: [
    { name: "Zapier", keyRotatedAt: "2024-04-20", status: "circuit_breaker" },
  ]},
];

export default function IntegrationsCompliance() {
  const rotate = async () => alert("Key rotation scheduled (mock)");
  const revoke = async () => alert("Keys revoked (mock)");
  const retry = async () => alert("Sync retry queued (mock)");

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5"/>Integrations & Compliance</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={rotate}><KeyRound className="h-4 w-4 mr-2"/>Rotate Keys</Button>
          <Button variant="outline" onClick={revoke}>Revoke</Button>
          <Button variant="outline" onClick={retry}><RotateCcw className="h-4 w-4 mr-2"/>Retry Syncs</Button>
          <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2"/>Refresh</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Connectors</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Key Rotated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => (
              r.connectors.map(c => (
                <TableRow key={`${r.org}-${c.name}`}>
                  <TableCell>{r.org}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.status}</TableCell>
                  <TableCell>{c.keyRotatedAt}</TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
