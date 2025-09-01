import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

const plans = [
  { id: "starter", name: "Starter", price: "$0", features: ["Up to 3 users", "Community support" ] },
  { id: "growth", name: "Growth", price: "$49/mo", features: ["Up to 25 users", "Priority support"] },
  { id: "pro", name: "Pro", price: "$199/mo", features: ["Unlimited users", "SLA support"] },
];

export default function Billing() {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (planId: string) => {
    try {
      setLoading(planId);
      setError(null);
      const res = await fetch(`/api/billing/checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const json = await res.json();
      if (json?.success && json?.data?.url) {
        window.location.href = json.data.url;
      } else {
        throw new Error(json?.message || "Unable to start checkout");
      }
    } catch (e: any) {
      setError(e?.message || "Checkout failed");
    } finally {
      setLoading(null);
    }
  };

  const openPortal = async () => {
    try {
      setLoading("portal");
      setError(null);
      const res = await fetch(`/api/billing/portal`);
      const json = await res.json();
      if (json?.success && json?.data?.url) {
        window.location.href = json.data.url;
      } else {
        throw new Error(json?.message || "Unable to open billing portal");
      }
    } catch (e: any) {
      setError(e?.message || "Portal failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Billing</h1>
      {error && (
        <div className="mb-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded p-2">{error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{p.name}</span>
                <span className="text-brand-600">{p.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground mb-4 list-disc pl-5">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Button className="w-full" disabled={loading === p.id} onClick={() => startCheckout(p.id)}>
                {loading === p.id ? "Starting…" : "Choose Plan"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={openPortal} disabled={loading === "portal"}>
              {loading === "portal" ? "Opening…" : "Open Customer Portal"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
