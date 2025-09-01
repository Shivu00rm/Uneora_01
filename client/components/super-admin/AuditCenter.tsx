import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

const logs = [
  { id: "e1", org: "TechCorp", user: "admin@techcorp.com", action: "billing.subscription_updated", created_at: new Date().toISOString() },
  { id: "e2", org: "StartupXYZ", user: "owner@startupxyz.com", action: "auth.user_signed_in", created_at: new Date().toISOString() },
];

function toCSV() {
  const header = "id,org,user,action,created_at";
  const body = logs.map(l => [l.id,l.org,l.user,l.action,l.created_at].map(v=>`"${String(v).replaceAll('"','\"')}"`).join(",")).join("\n");
  return header+"\n"+body;
}

export default function AuditCenter() {
  const exportCSV = () => {
    const blob = new Blob([toCSV()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `audit-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Audit Logs</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2"/>Export CSV</Button>
          <Button variant="outline" onClick={exportPDF}><FileText className="h-4 w-4 mr-2"/>Export PDF</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Org</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(l => (
              <TableRow key={l.id}>
                <TableCell>{l.id}</TableCell>
                <TableCell>{l.org}</TableCell>
                <TableCell>{l.user}</TableCell>
                <TableCell>{l.action}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
