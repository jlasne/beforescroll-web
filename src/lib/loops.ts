const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_BASE_URL = "https://app.loops.so/api/v1";

if (!LOOPS_API_KEY) {
  console.warn("[Loops] LOOPS_API_KEY not set — emails will not be sent");
}

async function loopsFetch(path: string, body: Record<string, unknown>) {
  if (!LOOPS_API_KEY) {
    console.warn(`[Loops] Skipping ${path} — no API key`);
    return { ok: false, status: 0, data: null };
  }

  const res = await fetch(`${LOOPS_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOOPS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    console.error(`[Loops] ${path} failed:`, res.status, data);
  }
  return { ok: res.ok, status: res.status, data };
}

/** Create or update a contact in Loops. */
export async function upsertContact(data: {
  email: string;
  firstName?: string;
  properties?: Record<string, unknown>;
}) {
  return loopsFetch("/contacts/update", {
    email: data.email,
    firstName: data.firstName,
    ...data.properties,
  });
}

/** Send a transactional email (milestone emails, etc.). */
export async function sendTransactional(data: {
  transactionalId: string;
  email: string;
  dataVariables?: Record<string, string>;
}) {
  return loopsFetch("/transactional", {
    transactionalId: data.transactionalId,
    email: data.email,
    dataVariables: data.dataVariables ?? {},
  });
}

/** Send an event to trigger event-based sequences. */
export async function sendEvent(data: {
  email: string;
  eventName: string;
  eventProperties?: Record<string, unknown>;
}) {
  return loopsFetch("/events/send", {
    email: data.email,
    eventName: data.eventName,
    eventProperties: data.eventProperties ?? {},
  });
}
