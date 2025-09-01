import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const modules = ["dashboard","inventory","stock_movements","pos","vendors","purchase_orders","analytics","files","settings","organizations","billing","api_keys","system"] as const;
const actions = ["view","create","edit","delete","manage","export","approve","refund"] as const;

export default function RBACEditor() {
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(()=>{
    const m: Record<string, Record<string, boolean>> = {};
    for (const mod of modules) { m[mod] = {}; for (const act of actions) m[mod][act] = false; }
    m.dashboard.view = true; m.inventory.view = true; m.analytics.view = true;
    return m;
  });

  const toggle = (mod: string, act: string) => setMatrix(prev => ({ ...prev, [mod]: { ...prev[mod], [act]: !prev[mod][act] }}));

  const save = async () => {
    await fetch("/api/admin/rbac/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ matrix }) });
    alert("RBAC matrix updated (mock)");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Matrix / RBAC Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                {actions.map(a => (<TableHead key={a} className="text-center capitalize">{a}</TableHead>))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map(mod => (
                <TableRow key={mod}>
                  <TableCell className="font-medium">{mod}</TableCell>
                  {actions.map(a => (
                    <TableCell key={a} className="text-center">
                      <input type="checkbox" checked={!!matrix[mod][a]} onChange={()=>toggle(mod,a)} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="pt-4"><Button onClick={save}>Save</Button></div>
      </CardContent>
    </Card>
  );
}
