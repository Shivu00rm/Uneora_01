import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Check } from "lucide-react";

interface ErrorItem { id: string; type: string; message: string; status: "open"|"resolved"; created_at: string; }
const initial: ErrorItem[] = [
  { id: "w1", type: "webhook_failed", message: "Stripe invoice.payment_failed", status: "open", created_at: new Date().toISOString() },
  { id: "i1", type: "integration_error", message: "Zapier sync failed for StartupXYZ", status: "open", created_at: new Date().toISOString() },
];

export default function ErrorCenter() {
  const [rows, setRows] = useState<ErrorItem[]>(initial);

  const replay = async (id: string) => {
    await fetch("/api/admin/errors/replay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    alert(`Replay triggered for ${id}`);
  };

  const resolve = (id: string) => setRows(prev => prev.map(r => r.id === id ? { ...r, status: "resolved" } : r));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5"/>Critical Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>{r.message}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={()=>replay(r.id)}><RotateCcw className="h-4 w-4 mr-1"/>Replay</Button>
                    <Button size="sm" onClick={()=>resolve(r.id)}><Check className="h-4 w-4 mr-1"/>Resolve</Button>
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
