/**
 * The article body's styles, in the site's own design.
 *
 * The articles keep their source markup (the class names the writers used:
 * `.lead`, `.pquote`, `.cards`, `.callout`, `.tbl`, `.gar`, `.cta` …), but
 * none of the source's look. Every component is drawn here from the site's
 * parts:
 *
 *   headings / text   the site's type: carbon headings, graphite body
 *   lists             orange square markers (status colours on the
 *                     do / risk / gap / no variants)
 *   .pquote           large statement with an orange rule
 *   .cards / .card    the platform pages' icon card, orange icon tile
 *   .callout          orange-tint panel with a mono orange label
 *   .tbl              hairline table, mono uppercase header
 *   .gar              Green / Amber / Red chips in the hero animations'
 *                     status colours
 *   .takeaways        offWhite panel
 *   .cta              the dark talent-network card with the orange pill
 *   svg.art           the illustrations, on the animated-screen dark ground
 *
 * Scoped to `.blog-body`.
 */

const O = "#FF6A00";
const CARBON = "#0E0E0F";
const BODY = "rgba(51,54,58,0.78)";
const MUTED = "rgba(51,54,58,0.55)";
const HAIR = "#ECECEF";
const G = "#2BCB74";
const A = "#E9A21B";
const R = "#FF4D4D";

export const BLOG_CSS = `
.blog-body{color:${BODY};font-size:17px;line-height:1.75}
.blog-body article > *:first-child{margin-top:0}
.blog-body p{margin:0 0 20px}
.blog-body .lead{font-size:20px;line-height:1.65;color:${CARBON};font-weight:500}
.blog-body strong,.blog-body b{color:${CARBON};font-weight:600}
.blog-body h2{font-family:var(--font-heading),system-ui,sans-serif;font-weight:700;font-size:clamp(24px,3vw,32px);line-height:1.18;letter-spacing:-0.025em;color:${CARBON};margin:52px 0 16px}
.blog-body h2.top{margin-top:8px}
.blog-body h3{font-family:var(--font-heading),system-ui,sans-serif;font-weight:700;font-size:19px;letter-spacing:-0.015em;color:${CARBON};margin:30px 0 8px}
.blog-body a{color:${CARBON};text-decoration:underline;text-underline-offset:3px}

/* lists */
.blog-body ul{margin:0 0 24px;padding:0;list-style:none}
.blog-body ul li{position:relative;padding:7px 0 7px 26px}
.blog-body ul li:before{content:"";position:absolute;left:2px;top:17px;width:7px;height:7px;border-radius:2px;background:${O}}
.blog-body ul.clean li{border-bottom:1px solid ${HAIR}}
.blog-body ul.clean li:last-child{border-bottom:0}
.blog-body ul.no li:before,.blog-body ul.risk li:before{background:${R};border-radius:50%}
.blog-body ul.do li:before{background:${G};border-radius:50%}
.blog-body ul.gap li:before{background:${A};border-radius:50%}
.blog-body ul.fix{padding:18px 22px;border-radius:16px;background:#F7F7F9;box-shadow:inset 0 0 0 1px ${HAIR}}
.blog-body ul.fix li{padding:6px 0 6px 28px}
.blog-body ul.fix li:before{content:"✓";width:auto;height:auto;background:none;top:6px;left:2px;color:${O};font-weight:700;font-size:14px}

/* the cause number above a section */
.blog-body .causenum{display:inline-block;margin-top:44px;font-family:var(--font-mono),ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${O};padding:5px 10px;border-radius:999px;background:rgba(255,106,0,0.08)}
.blog-body .causenum + h2{margin-top:12px}

/* statement */
.blog-body .pquote{font-family:var(--font-heading),system-ui,sans-serif;font-size:clamp(22px,2.8vw,28px);line-height:1.3;letter-spacing:-0.02em;color:${CARBON};font-weight:700;border-left:3px solid ${O};padding:4px 0 4px 24px;margin:40px 0}

/* icon cards */
.blog-body .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:8px 0 28px}
.blog-body .card{padding:22px;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 1px ${HAIR}}
.blog-body .card .ic{width:44px;height:44px;padding:11px;border-radius:10px;background:rgba(255,106,0,0.08);box-shadow:inset 0 0 0 1px rgba(255,106,0,0.18);display:block;margin-bottom:16px}
.blog-body .card .ic *{stroke:${O} !important}
.blog-body .card .ic [fill]:not([fill="none"]){fill:${O} !important}
.blog-body .card h3{margin:0;font-size:18px}
.blog-body .card .one{margin:4px 0 10px;color:${O};font-size:14px;font-weight:600}
.blog-body .card ul{margin:0}
.blog-body .card li{font-size:14px;padding:4px 0 4px 18px;line-height:1.5}
.blog-body .card li:before{top:12px;width:5px;height:5px}

/* the three-word approach */
.blog-body .approach{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 18px}
.blog-body .approach span{font-family:var(--font-mono),ui-monospace,monospace;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:${CARBON};padding:8px 14px;border-radius:999px}

/* call-outs and notes */
.blog-body .callout,.blog-body .illus{margin:28px 0;padding:20px 24px;border-radius:16px;color:${CARBON};background:linear-gradient(180deg,rgba(255,106,0,0.08),rgba(255,106,0,0.02));box-shadow:inset 0 0 0 1px rgba(255,106,0,0.22)}
.blog-body .illus{background:#F7F7F9;box-shadow:inset 0 0 0 1px ${HAIR};color:${BODY}}
.blog-body .lbl{display:block;margin-bottom:6px;font-family:var(--font-mono),ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${O}}
.blog-body .illus .lbl{color:${MUTED}}
.blog-body .smenote{margin:24px 0;padding:16px 20px;border-radius:14px;font-size:14px;line-height:1.6;background:#F7F7F9;box-shadow:inset 0 0 0 1px ${HAIR}}
.blog-body .smenote .lbl{color:${MUTED}}
.blog-body .disc{font-size:13px;color:${MUTED};font-style:italic}

/* tables */
.blog-body table.tbl{width:100%;border-collapse:collapse;margin:8px 0 28px;font-size:14.5px;line-height:1.5;border-radius:14px;overflow:hidden;box-shadow:inset 0 0 0 1px ${HAIR}}
.blog-body .tbl th{text-align:left;font-family:var(--font-mono),ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${MUTED};background:#F7F7F9;padding:12px 14px;border-bottom:1px solid ${HAIR}}
.blog-body .tbl td{padding:12px 14px;border-bottom:1px solid ${HAIR};vertical-align:top}
.blog-body .tbl tr:last-child td{border-bottom:0}
.blog-body .tbl .m{color:${CARBON};font-weight:600}
.blog-body .tbl .up{color:${O};font-weight:700}
.blog-body .tbl .r{color:${R};font-weight:600}
.blog-body .dodont th:first-child{color:#1E9E5A}
.blog-body .dodont th:last-child{color:${R}}

/* Green / Amber / Red */
.blog-body ul.gar{display:grid;gap:10px;margin:8px 0 26px}
.blog-body ul.gar li{padding:14px 16px 14px 44px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px ${HAIR}}
.blog-body ul.gar li:before{left:16px;top:20px;width:12px;height:12px;border-radius:50%}
.blog-body ul.gar li.g:before{background:${G}}
.blog-body ul.gar li.a:before{background:${A}}
.blog-body ul.gar li.r:before{background:${R}}

/* key takeaways */
.blog-body .takeaways{margin:40px 0;padding:24px 26px;border-radius:20px;background:#F5F5F7}
.blog-body .takeaways h3{margin-top:0;font-family:var(--font-mono),ui-monospace,monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${O}}
.blog-body .takeaways ul{margin:0}

/* closing call to action: the talent-network card */
.blog-body .cta{position:relative;overflow:hidden;margin:52px 0 0;padding:34px 32px;border-radius:24px;color:rgba(255,255,255,0.6);background:radial-gradient(70% 120% at 0% 0%,rgba(255,106,0,0.22) 0%,transparent 60%),linear-gradient(135deg,#17171B 0%,#0C0C0F 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.09)}
.blog-body .cta h3{margin:0 0 8px;color:#fff;font-size:24px;letter-spacing:-0.025em}
.blog-body .cta p{margin:0 0 22px;font-size:15px;line-height:1.65}
.blog-body .cta .btn{display:inline-flex;align-items:center;gap:8px;background:${O};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:999px;transition:background .2s}
.blog-body .cta .btn:hover{background:#E55F00}

/* illustrations: the animated-screen ground */
.blog-body figure{margin:30px 0}
.blog-art svg,.blog-body svg.art{width:100%;height:auto;display:block;border-radius:20px;background:#0B1016;box-shadow:0 1px 0 rgba(255,255,255,0.04) inset,0 24px 50px -30px rgba(0,0,0,0.45)}
.blog-art svg text,.blog-body svg.art text{font-family:var(--font-heading),system-ui,sans-serif}
.blog-art svg text[font-family*="Mono"],.blog-body svg.art text[font-family*="Mono"]{font-family:var(--font-mono),ui-monospace,monospace}
.blog-body figcaption,.blog-art figcaption{margin-top:12px;font-size:13px;line-height:1.5;color:${MUTED};text-align:center}
.blog-body [id]{scroll-margin-top:110px}
`;
