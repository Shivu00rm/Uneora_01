import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCcw, CreditCard, DollarSign } from "lucide-react";

interface StripeEvent { id: string; type: string; created_at: string; }

export default function StripeOps() {
  const [events, setEvents] = useState<StripeEvent[]>([]);
  const [queue, setQueue] = useState<{org: string; amount: number; days: number}[]>([
    { org: "Fashion Boutique", amount: 2999, days: 15 }, { org: "StartupXYZ", amount: 0, days: 0 }
  ]);

  const fetchEvents = async () => {
    const res = await fetch("/api/admin/stripe/events");
    const json = await res.json();
    if (json?.success) setEvents(json.data.events);
  };

  useEffect(()=>{ fetchEvents(); },[]);

  const reconcile = async () => {
    await fetch("/api/admin/subscriptions/reconcile", { method: "POST" });
    alert("Reconciliation started (mock)");
  };

  const refund = async () => { alert("Refund initiated (mock)"); };

  const retryFailed = async () => { alert("Retry scheduled (mock)"); };

  const setGrace = async () => { alert("Grace period updated (mock)"); };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5"/>Stripe Event Stream</CardTitle>
          <Button variant="outline" onClick={fetchEvents}><RefreshCw className="h-4 w-4 mr-2"/>Refresh</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map(e => (
                <TableRow key={e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(e.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5"/>Payment Issues & Controls</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reconcile}><RefreshCw className="h-4 w-4 mr-2"/>Reconcile</Button>
            <Button variant="outline" onClick={retryFailed}><RotateCcw className="h-4 w-4 mr-2"/>Retry Failures</Button>
            <Button variant="outline" onClick={setGrace}>Grace Period</Button>
            <Button onClick={refund}>Refund/Escalate</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Days Overdue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map(q => (
                <TableRow key={q.org}>
                  <TableCell>{q.org}</TableCell>
                  <TableCell>₹{q.amount}</TableCell>
                  <TableCell>{q.days}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
