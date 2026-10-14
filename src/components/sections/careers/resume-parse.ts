/**
 * "Autofill with résumé": read a PDF résumé in the browser and pull out the
 * contact fields a form needs.
 *
 * The file never leaves the device for this — pdf.js extracts the text
 * locally, and the fields are found with plain patterns. It is a convenience,
 * not a parser: anything it gets wrong the candidate corrects in the form, and
 * the résumé itself is still attached to the application as the record.
 *
 * pdf.js is imported only when this runs, and its worker is served from
 * `public/vendor/pdf.worker.min.mjs` — copied from `node_modules/pdfjs-dist`.
 * Re-copy it if the `pdfjs-dist` version changes; the two must match.
 */

export type ParsedResume = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
};

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE = /(\+?\d[\d\s().-]{8,}\d)/;
const LINKEDIN = /(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?/i;
const URL = /(https?:\/\/)?(www\.)?(github\.com\/[A-Za-z0-9_-]+|behance\.net\/[A-Za-z0-9_-]+|dribbble\.com\/[A-Za-z0-9_-]+)/i;

async function pdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = Math.min(doc.numPages, 3);
  const lines: string[] = [];
  for (let i = 1; i <= pages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      line += item.str;
      if (item.hasEOL) {
        lines.push(line);
        line = "";
      } else {
        line += " ";
      }
    }
    if (line.trim()) lines.push(line);
  }
  return lines.map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
}

/** The first line that looks like a person's name: 2–4 capitalised words. */
function findName(text: string): { firstName?: string; lastName?: string } {
  for (const raw of text.split("\n").slice(0, 8)) {
    const line = raw.trim();
    if (EMAIL.test(line) || /\d/.test(line) || line.length > 40) continue;
    const words = line.split(" ").filter(Boolean);
    if (words.length < 2 || words.length > 4) continue;
    if (!words.every((w) => /^[A-Z][A-Za-z.'-]*$/.test(w) || /^[A-Z.'-]+$/.test(w))) continue;
    const cap = (w: string) => w.charAt(0) + w.slice(1).toLowerCase();
    return { firstName: cap(words[0]), lastName: words.slice(1).map(cap).join(" ") };
  }
  return {};
}

export async function parseResume(file: File): Promise<ParsedResume> {
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (!isPdf) return {};
  const text = await pdfText(file);
  const out: ParsedResume = { ...findName(text) };
  const email = text.match(EMAIL);
  if (email) out.email = email[0];
  const phone = text.match(PHONE);
  if (phone) out.phone = phone[1].replace(/\s{2,}/g, " ").trim();
  const li = text.match(LINKEDIN);
  if (li) out.linkedin = li[0].startsWith("http") ? li[0] : `https://${li[0]}`;
  const site = text.match(URL);
  if (site) out.portfolio = site[0].startsWith("http") ? site[0] : `https://${site[0]}`;
  return out;
}
