import React, { useEffect, useState } from "react";
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
import { Activity, Flag, ListChecks, RefreshCw, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";

interface OutboxEvent {
  topic: string;
  payload: any;
  createdAt: string;
}
interface FlagRow {
  key: string;
  enabled: boolean;
}

export default function OpsCenter() {
  const [events, setEvents] = useState<OutboxEvent[]>([]);
  const [dlq, setDlq] = useState<{ id: string; reason: string }[]>([]);
  const [flags, setFlags] = useState<FlagRow[]>([]);
  const [config, setConfig] = useState<
    { id: string; change: string; at: string }[]
  >([]);

  const load = async () => {
    const [e, q, f, c] = await Promise.all([
      fetch("/api/admin/events/outbox").then((r) => r.json()),
      fetch("/api/admin/dlq").then((r) => r.json()),
      fetch("/api/admin/feature-flags").then((r) => r.json()),
      fetch("/api/admin/config-changes").then((r) => r.json()),
    ]);
    if (e?.success) setEvents(e.data.events);
    if (q?.success) setDlq(q.data.items);
    if (f?.success) setFlags(f.data.flags);
    if (c?.success) setConfig(c.data.items);
  };

  useEffect(() => {
    load();
  }, []);

  const replay = async (id: string) => {
    await fetch("/api/admin/dlq/replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  };

  const toggleFlag = async (key: string) => {
    const next = flags.map((f) =>
      f.key === key ? { ...f, enabled: !f.enabled } : f,
    );
    setFlags(next);
    await fetch("/api/admin/feature-flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flags: next }),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Event Bus Outbox
          </CardTitle>
          <Button variant="outline" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Payload</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((ev, i) => (
                <TableRow key={i}>
                  <TableCell>{ev.topic}</TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate max-w-[420px]">
                    {JSON.stringify(ev.payload)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(ev.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Webhook DLQ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dlq.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => replay(item.id)}>
                      Replay
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Feature Flags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {flags.map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between border rounded p-2"
              >
                <span>{f.key}</span>
                <label className="flex items-center gap-2 text-sm">
                  <span>{f.enabled ? "On" : "Off"}</span>
                  <input
                    type="checkbox"
                    checked={f.enabled}
                    onChange={() => toggleFlag(f.key)}
                  />
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Config Change Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {config.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.change}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(c.at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
