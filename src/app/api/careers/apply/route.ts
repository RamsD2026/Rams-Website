/**
 * POST /api/careers/apply — receives a job application from the careers page
 * and emails it, resume attached, to the careers inbox through Resend.
 *
 * ── Configuration (Vercel → Project → Settings → Environment Variables) ──
 *   RESEND_API_KEY      required. A Resend API key.
 *   CAREERS_FROM_EMAIL  required. A sender on a domain verified in Resend,
 *                       e.g. "RAMS Careers <careers@rams.digital>".
 *   CAREERS_TO_EMAIL    optional. Where applications go; defaults to
 *                       hr@rams.digital, the careers address the site publishes.
 *
 * Without the two required values the route answers 503 with
 * `fallback: "mailto"`, and the page offers the candidate a ready-made email
 * instead — so the form is never a dead end while email is being set up.
 *
 * Nothing is stored here: the application goes out as one email and the
 * function keeps no copy. Personal data in it is handled under the privacy
 * policy the form links to.
 */

const MAX_BYTES = 4 * 1024 * 1024; // Vercel caps a request body at 4.5 MB
const TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const EXT = /\.(pdf|docx?)$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(form: FormData, name: string, max = 300): string {
  const v = form.get(name);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "Could not read the application." }, { status: 400 });
  }

  // A field people never see. Bots fill it; pretend success and drop it.
  if (field(form, "website")) return Response.json({ ok: true });

  const d = {
    jobId: field(form, "jobId", 80),
    jobTitle: field(form, "jobTitle", 160) || "General application",
    firstName: field(form, "firstName", 80),
    lastName: field(form, "lastName", 80),
    email: field(form, "email", 160),
    phone: field(form, "phone", 40),
    location: field(form, "location", 120),
    linkedin: field(form, "linkedin", 200),
    portfolio: field(form, "portfolio", 200),
    note: field(form, "note", 3000),
    method: field(form, "method", 40),
  };

  if (!d.firstName || !d.lastName || !EMAIL.test(d.email)) {
    return Response.json({ ok: false, error: "Name and a valid email are required." }, { status: 400 });
  }
  if (form.get("consent") !== "yes") {
    return Response.json({ ok: false, error: "Please agree to the privacy notice." }, { status: 400 });
  }

  const resume = form.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return Response.json({ ok: false, error: "Please attach your resume." }, { status: 400 });
  }
  if (resume.size > MAX_BYTES) {
    return Response.json({ ok: false, error: "Resume must be 4 MB or smaller." }, { status: 413 });
  }
  if (!TYPES.includes(resume.type) && !EXT.test(resume.name)) {
    return Response.json({ ok: false, error: "Resume must be a PDF or Word document." }, { status: 415 });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CAREERS_FROM_EMAIL;
  const to = process.env.CAREERS_TO_EMAIL || "hr@rams.digital";
  if (!key || !from) {
    return Response.json(
      { ok: false, fallback: "mailto", error: "Online applications are not switched on yet." },
      { status: 503 },
    );
  }

  const rows = [
    ["Role", `${d.jobTitle}${d.jobId ? ` (${d.jobId})` : ""}`],
    ["Name", `${d.firstName} ${d.lastName}`],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Location", d.location],
    ["LinkedIn", d.linkedin],
    ["Portfolio", d.portfolio],
    ["Applied via", d.method],
  ].filter(([, v]) => v);

  const html = `
    <h2 style="font-family:sans-serif">New application — ${esc(d.jobTitle)}</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`).join("")}
    </table>
    ${d.note ? `<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap"><b>Note</b><br>${esc(d.note)}</p>` : ""}
    <p style="font-family:sans-serif;font-size:12px;color:#888">Sent from the careers page at rams.digital. Resume attached.</p>`;

  const safeName = resume.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120) || "resume.pdf";
  const content = Buffer.from(await resume.arrayBuffer()).toString("base64");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: d.email,
      subject: `Application: ${d.jobTitle} — ${d.firstName} ${d.lastName}`,
      html,
      attachments: [{ filename: safeName, content }],
    }),
  });

  if (!res.ok) {
    return Response.json(
      { ok: false, fallback: "mailto", error: "The application could not be sent. Please try again or email us." },
      { status: 502 },
    );
  }
  return Response.json({ ok: true });
}
