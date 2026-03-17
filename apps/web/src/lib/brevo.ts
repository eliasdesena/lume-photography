const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_BASE = "https://api.brevo.com/v3";

interface SendEmailParams {
  to: { email: string; name?: string }[];
  templateId: number;
  params?: Record<string, string>;
}

/**
 * Send a transactional email via Brevo
 */
export async function sendTransactionalEmail({
  to,
  templateId,
  params,
}: SendEmailParams) {
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY not set — skipping email send");
    return null;
  }

  const res = await fetch(`${BREVO_BASE}/smtp/email`, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      to,
      templateId,
      params,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Brevo email send failed:", res.status, body);
    throw new Error(`Brevo email failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Add or update a contact in Brevo and optionally add to lists
 */
export async function addContact(
  email: string,
  name: string,
  listIds: number[] = []
) {
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY not set — skipping contact add");
    return null;
  }

  const res = await fetch(`${BREVO_BASE}/contacts`, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      attributes: { FIRSTNAME: name.split(" ")[0], LASTNAME: name.split(" ").slice(1).join(" ") },
      listIds,
      updateEnabled: true,
    }),
  });

  if (!res.ok && res.status !== 204) {
    const body = await res.text();
    console.error("Brevo add contact failed:", res.status, body);
  }

  return res.ok;
}
