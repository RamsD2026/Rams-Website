/**
 * POST /api/webinars/register — a webinar registration from /resources/webinars.
 *
 * Sends the registration to the RAMS team by email through Resend, the same
 * way /api/careers/apply sends applications. Environment:
 *
 *   RESEND_API_KEY        required. The Resend API key.
 *   WEBINARS_FROM_EMAIL   the sender, on a domain verified in Resend, e.g.
 *                         "RAMS Webinars <webinars@rams.digital>". Falls back
 *                         to CAREERS_FROM_EMAIL so one verified sender serves
 *                         both forms.
 *   WEBINARS_TO_EMAIL     optional. Where registrations go; defaults to
 *                         connect@rams.digital, the address the page publishes.
 *
 * Without a key and a sender the route answers 503 with
 * `fallback: "mailto"`, and the form offers the visitor a ready-made email
 * instead — so a registration is never lost while email sending is off.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Could not read the registration." }, { status: 400 });
  }
  const f = (name: string, max = 200) => {
    const v = body[name];
    return typeof v === "string" ? v.trim().slice(0, max) : "";
  };

  // A field people never see. Bots fill it; pretend success and drop it.
  if (f("website")) return Response.json({ ok: true });

  const d = {
    session: f("session", 200),
    when: f("when", 80),
    firstName: f("firstName", 80),
    lastName: f("lastName", 80),
    email: f("email", 160),
    company: f("company", 160),
    designation: f("designation", 120),
    phone: f("phone", 40),
  };

  if (!d.session || !d.firstName || !d.lastName || !EMAIL.test(d.email) || !d.company) {
    return Response.json(
      { ok: false, error: "Session, name, a valid work email and company are required." },
      { status: 400 },
    );
  }
  if (body.consent !== true) {
    return Response.json({ ok: false, error: "Please agree to the privacy notice." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.WEBINARS_FROM_EMAIL || process.env.CAREERS_FROM_EMAIL;
  const to = process.env.WEBINARS_TO_EMAIL || "connect@rams.digital";
  if (!key || !from) {
    return Response.json(
      { ok: false, fallback: "mailto", error: "Online registration is not switched on yet." },
      { status: 503 },
    );
  }

  const rows = [
    ["Session", d.session],
    ["Date", d.when],
    ["Name", `${d.firstName} ${d.lastName}`],
    ["Email", d.email],
    ["Company", d.company],
    ["Designation", d.designation],
    ["Phone", d.phone],
  ].filter(([, v]) => v);

  const html = `
    <h2 style="font-family:sans-serif">Webinar registration — ${esc(d.session)}</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`).join("")}
    </table>
    <p style="font-family:sans-serif;font-size:12px;color:#888">Sent from the webinars page at rams.digital.</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: d.email,
      subject: `Webinar registration: ${d.session} — ${d.firstName} ${d.lastName}`,
      html,
    }),
  });

  if (!res.ok) {
    return Response.json(
      { ok: false, fallback: "mailto", error: "The registration could not be sent. Please try again or email us." },
      { status: 502 },
    );
  }
  return Response.json({ ok: true });
}
