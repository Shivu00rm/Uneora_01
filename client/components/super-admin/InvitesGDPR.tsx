import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InvitesGDPR() {
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");

  const invite = async () => {
    await fetch("/api/admin/invites/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, org }) });
    alert("Invite sent (mock)");
  };

  const gdprExport = async () => {
    const res = await fetch("/api/admin/gdpr/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    if (res.ok) alert("GDPR export requested");
  };

  const gdprDelete = async () => {
    const confirmed = confirm("This will schedule account deletion per GDPR. Proceed?");
    if (!confirmed) return;
    const res = await fetch("/api/admin/gdpr/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    if (res.ok) alert("GDPR delete scheduled");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invites & GDPR</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-center">
          <Input placeholder="Invite email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Organization (optional)" value={org} onChange={e=>setOrg(e.target.value)} />
          <Button onClick={invite}>Send Invite</Button>
        </div>
        <div className="flex gap-2 items-center">
          <Input placeholder="User email for GDPR" value={email} onChange={e=>setEmail(e.target.value)} />
          <Button variant="outline" onClick={gdprExport}>GDPR Export</Button>
          <Button variant="destructive" onClick={gdprDelete}>GDPR Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
}
