import { createClient } from "@supabase/supabase-js";

type EventPayload = { topic: string; payload: any; createdAt: string };

const outbox: EventPayload[] = [];

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: any = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

export async function emitEvent(topic: string, payload: any) {
  const event: EventPayload = {
    topic,
    payload,
    createdAt: new Date().toISOString(),
  };
  outbox.push(event);

  if (supabase) {
    try {
      await supabase
        .from("events_outbox")
        .insert({ topic, payload, status: "pending" });
    } catch (e) {
      // Keep in-memory only on failure; no throw
      console.error("Outbox persist failed", e);
    }
  }
}

export function getOutboxSnapshot() {
  return [...outbox];
}
