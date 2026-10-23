/**
 * The article body's styles, in the site's own design — calm and editorial.
 *
 * The articles keep their source markup (the class names the writers used:
 * `.lead`, `.pquote`, `.cards`, `.callout`, `.tbl`, `.gar`, `.cta` …) but
 * are set as reading pages, not as a stack of boxes:
 *
 *   - one text colour for body copy, carbon for headings, orange only for
 *     small labels, the quote rule and links
 *   - no tinted panels, pills or icon tiles: call-outs and notes are a thin
 *     rule beside the text, the takeaways sit between two hairlines, the
 *     card grid becomes sections divided by hairlines
 *   - grey bullets; Green / Amber / Red keep their status dots
 *   - tables and illustrations quiet, with room around them
 *   - one dark call to action at the end (the talent-network card)
 *
 * One type scale for every article, so no part of one reads off on its own:
 *
 *   label 11 · small 15 · body 17 · lead 19 · h3 21 · quote 23 · h2 28
 *
 * "small" is everything secondary — notes, tables, captions, the card
 * summaries; "body" is every paragraph and list, call-outs and card lists
 * included. On a phone each steps down one notch (see the media query at
 * the end).
 *
 * Scoped to `.blog-body`.
 */

const O = "#FF6A00";
const CARBON = "#0E0E0F";
const BODY = "rgba(51,54,58,0.82)";
const MUTED = "rgba(51,54,58,0.55)";
const HAIR = "#ECECEF";
const G = "#2BCB74";
const A = "#E9A21B";
const R = "#FF4D4D";
const LABEL = `font-family:var(--font-mono),ui-monospace,monospace;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase`;
const SMALL = `font-size:15px;line-height:1.6`;

export const BLOG_CSS = `
.blog-body{color:${BODY};font-size:17px;line-height:1.75}
.blog-body article > *:first-child{margin-top:0}
.blog-body p{margin:0 0 22px}
.blog-body .lead{font-size:19px;line-height:1.65;color:${CARBON}}
.blog-body strong,.blog-body b{color:${CARBON};font-weight:600}
.blog-body h2{font-family:var(--font-heading),system-ui,sans-serif;font-weight:700;font-size:28px;line-height:1.2;letter-spacing:-0.025em;color:${CARBON};margin:64px 0 18px}
.blog-body h2.top{margin-top:12px}
.blog-body h3{font-family:var(--font-heading),system-ui,sans-serif;font-weight:700;font-size:21px;line-height:1.3;letter-spacing:-0.015em;color:${CARBON};margin:36px 0 10px}
.blog-body a{color:${CARBON};text-decoration:underline;text-decoration-color:rgba(255,106,0,0.5);text-underline-offset:3px}

/* lists: plain, grey bullets */
.blog-body ul{margin:0 0 26px;padding:0;list-style:none}
.blog-body ul li{position:relative;padding:5px 0 5px 22px}
.blog-body ul li:before{content:"";position:absolute;left:4px;top:17px;width:5px;height:5px;border-radius:50%;background:rgba(51,54,58,0.35)}
.blog-body ul.no li:before,.blog-body ul.risk li:before{background:${R}}
.blog-body ul.do li:before{background:${G}}
.blog-body ul.gap li:before{background:${A}}
.blog-body ul.fix li{padding-left:24px}
.blog-body ul.fix li:before{content:"✓";width:auto;height:auto;background:none;border-radius:0;top:5px;left:0;color:${O};font-weight:700;font-size:13px}

/* small labels */
.blog-body .causenum{display:block;margin-top:64px;${LABEL};color:${O}}
.blog-body .causenum + h2{margin-top:8px}
.blog-body .lbl{display:block;margin-bottom:6px;${LABEL};color:${MUTED}}

/* the pull quote */
.blog-body .pquote{font-family:var(--font-heading),system-ui,sans-serif;font-size:23px;line-height:1.4;letter-spacing:-0.015em;color:${CARBON};font-weight:600;border-left:2px solid ${O};padding:2px 0 2px 22px;margin:44px 0}

/* the card grid, as quiet sections */
.blog-body .cards{display:block;margin:12px 0 30px;border-top:1px solid ${HAIR}}
.blog-body .card{padding:20px 0;border-bottom:1px solid ${HAIR}}
.blog-body .card .ic{display:none}
.blog-body .card h3{margin:0}
.blog-body .card .one{margin:2px 0 8px;color:${MUTED};${SMALL}}
.blog-body .card ul{margin:0}
.blog-body .card li{padding:3px 0 3px 18px}
.blog-body .card li:before{top:15px}

/* the three words */
.blog-body .approach{display:flex;flex-wrap:wrap;gap:6px 18px;margin:0 0 16px;${LABEL};color:${CARBON}}
.blog-body .approach span{position:relative}
.blog-body .approach span + span:before{content:"·";position:absolute;left:-12px;color:${O}}

/* call-outs and notes: a thin rule beside the text */
.blog-body .callout,.blog-body .illus,.blog-body .smenote{margin:32px 0;padding:2px 0 2px 20px;border-left:2px solid ${HAIR}}
.blog-body .callout{border-left-color:${O};color:${CARBON}}
.blog-body .callout .lbl{color:${O}}
.blog-body .smenote{${SMALL};color:${MUTED}}
.blog-body .disc{${SMALL};color:${MUTED};font-style:italic}

/* tables */
.blog-body table.tbl{width:100%;border-collapse:collapse;margin:10px 0 32px;${SMALL}}
.blog-body .tbl th{text-align:left;${LABEL};color:${MUTED};padding:0 14px 12px 0;border-bottom:1px solid ${CARBON}}
.blog-body .tbl td{padding:13px 14px 13px 0;border-bottom:1px solid ${HAIR};vertical-align:top}
.blog-body .tbl .m{color:${CARBON};font-weight:600}
.blog-body .tbl .up{color:${O};font-weight:600}
.blog-body .tbl .r{color:${R};font-weight:600}
.blog-body .dodont th:first-child{color:#1E9E5A}
.blog-body .dodont th:last-child{color:${R}}
@media(max-width:640px){.blog-body table.tbl{display:block;overflow-x:auto;white-space:nowrap}}

/* Green / Amber / Red: a status dot, no box */
.blog-body ul.gar{margin:6px 0 28px}
.blog-body ul.gar li{padding:9px 0 9px 26px;border-bottom:1px solid ${HAIR}}
.blog-body ul.gar li:last-child{border-bottom:0}
.blog-body ul.gar li:before{left:2px;top:19px;width:10px;height:10px}
.blog-body ul.gar li.g:before{background:${G}}
.blog-body ul.gar li.a:before{background:${A}}
.blog-body ul.gar li.r:before{background:${R}}

/* key takeaways: between two hairlines */
.blog-body .takeaways{margin:52px 0;padding:26px 0;border-top:1px solid ${CARBON};border-bottom:1px solid ${HAIR}}
.blog-body .takeaways h3{margin:0 0 12px;${LABEL};color:${O}}
.blog-body .takeaways ul{margin:0}

/* the one call to action: the talent-network card */
.blog-body .cta{position:relative;overflow:hidden;margin:64px 0 0;padding:34px 32px;border-radius:24px;color:rgba(255,255,255,0.6);background:radial-gradient(70% 120% at 0% 0%,rgba(255,106,0,0.22) 0%,transparent 60%),linear-gradient(135deg,#17171B 0%,#0C0C0F 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.09)}
.blog-body .cta h3{margin:0 0 8px;color:#fff;font-size:24px;letter-spacing:-0.025em}
.blog-body .cta p{margin:0 0 22px;${SMALL}}
.blog-body .cta .btn{display:inline-flex;align-items:center;gap:8px;background:${O};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:999px;transition:background .2s}
.blog-body .cta .btn:hover{background:#E55F00}

/* illustrations: the animated-screen ground, quietly framed */
.blog-body figure{margin:40px 0}
.blog-art svg,.blog-body svg.art{width:100%;height:auto;display:block;border-radius:10px;background:#0B1016}
.blog-art svg text,.blog-body svg.art text{font-family:var(--font-heading),system-ui,sans-serif}
.blog-art svg text[font-family*="Mono"],.blog-body svg.art text[font-family*="Mono"]{font-family:var(--font-mono),ui-monospace,monospace}
.blog-body figcaption,.blog-art figcaption{margin-top:12px;${SMALL};color:${MUTED};text-align:left}
.blog-art figcaption{text-align:center}
.blog-body [id]{scroll-margin-top:110px}
.blog-body p[style]{font-size:15px !important;line-height:1.6;color:${MUTED} !important}

/* phones: each size one notch down */
@media(max-width:640px){
  .blog-body{font-size:16px}
  .blog-body .lead{font-size:18px}
  .blog-body h2{font-size:24px;margin-top:52px}
  .blog-body h3{font-size:19px}
  .blog-body .pquote{font-size:20px}
  .blog-body .card .one,.blog-body .smenote,.blog-body .disc,.blog-body table.tbl,.blog-body figcaption,.blog-art figcaption,.blog-body .cta p{font-size:14px}
}
`;
