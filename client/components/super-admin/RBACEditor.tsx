import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSuperAdmin } from "@/contexts/SuperAdminContext";
import { ALL_FEATURES, PLAN_FEATURES, type Feature } from "@/lib/planFeatures";

const modules = ["dashboard","inventory","stock_movements","pos","vendors","purchase_orders","analytics","files","settings","organizations","billing","api_keys","system"] as const;
const actions = ["view","create","edit","delete","manage","export","approve","refund"] as const;

export default function RBACEditor() {
  const { organizations, setOrgFeature, applyPlanDefaults } = useSuperAdmin();
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[0]?.id || "");
  const selectedOrg = organizations.find(o => o.id === selectedOrgId);

  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>(()=>{
    const m: Record<string, Record<string, boolean>> = {};
    for (const mod of modules) { m[mod] = {}; for (const act of actions) m[mod][act] = false; }
    m.dashboard.view = true; m.inventory.view = true; m.analytics.view = true;
    return m;
  });

  const toggle = (mod: string, act: string) => setMatrix(prev => ({ ...prev, [mod]: { ...prev[mod], [act]: !prev[mod][act] }}));

  const toggleFeature = (feature: Feature, enabled: boolean) => {
    if (!selectedOrg) return;
    setOrgFeature(selectedOrg.id, feature, enabled);
  };

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
        {/* Per-Organization Feature Flags */}
        <div className="mb-6 p-4 border rounded">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Organization:</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={selectedOrgId}
                onChange={(e)=>setSelectedOrgId(e.target.value)}
              >
                {organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
              {selectedOrg && (
                <span className="text-xs text-muted-foreground ml-2">Plan: <strong className="uppercase">{selectedOrg.plan}</strong></span>
              )}
            </div>
            {selectedOrg && (
              <Button variant="outline" size="sm" onClick={()=>applyPlanDefaults(selectedOrg.id)}>
                Apply Plan Defaults
              </Button>
            )}
          </div>
          {selectedOrg && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ALL_FEATURES.map((f)=>{
                const enabled = !!selectedOrg.features?.includes(f);
                const inPlan = PLAN_FEATURES[selectedOrg.plan]?.includes(f as Feature);
                return (
                  <label key={f} className="flex items-center gap-2 p-2 border rounded text-sm">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e)=>toggleFeature(f as Feature, e.target.checked)}
                    />
                    <span className="capitalize">{f.replace(/_/g, " ")}</span>
                    {!inPlan && enabled && (
                      <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Addon</span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
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
