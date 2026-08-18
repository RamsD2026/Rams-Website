"use client";

import { ArrowUpRight } from "lucide-react";

function Arrow() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
      border: "1px solid rgba(0,0,0,0.12)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <ArrowUpRight style={{ width: 13, height: 13, color: "#3C3C43" }} strokeWidth={2} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   WIDGETS — oversized, cropped, tilted
──────────────────────────────────────────────────────── */

/* Card 1 — Rack Safety
   Dark inspection panel: 120% wide, tilted -6°, exits right + bottom
   Small alert badge floats top-right, not tilted */
function RackWidget() {
  const bays = ["ok","ok","ok","ok","ok","ok","ok","warn","ok","ok","ok","ok","ok","crit","ok","ok","ok","ok","ok","ok","ok","ok","warn","ok"];
  return (
    <>
      {/* Oversized tilted panel — exits right and bottom */}
      <div style={{
        position: "absolute",
        bottom: -36,
        left: -12,
        width: "118%",
        transform: "rotate(-6deg)",
        transformOrigin: "bottom left",
        background: "rgba(8,8,9,0.92)",
        backdropFilter: "blur(16px)",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
        padding: "20px 22px 22px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "var(--color-signal-orange)", textTransform: "uppercase" }}>Rack Health Monitor</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Live</span>
          </div>
        </div>
        {/* Score */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 14 }}>
          <span style={{ fontSize: 42, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>94</span>
          <span style={{ fontSize: 16, color: "rgba(255,255,255,0.25)" }}>/100</span>
          <div style={{ marginLeft: 10, height: 6, width: 100, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
            <div style={{ height: "100%", width: "94%", background: "linear-gradient(90deg,#FF6A00,#FF9500)", borderRadius: 3 }} />
          </div>
        </div>
        {/* Bay grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 5 }}>
          {bays.map((s, i) => (
            <div key={i} style={{
              height: 22, borderRadius: 5,
              background: s === "crit" ? "rgba(255,106,0,0.75)" : s === "warn" ? "rgba(255,165,0,0.3)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${s === "crit" ? "#FF6A00" : s === "warn" ? "rgba(255,165,0,0.4)" : "rgba(255,255,255,0.05)"}`,
              boxShadow: s === "crit" ? "0 0 10px rgba(255,106,0,0.4)" : "none",
            }} />
          ))}
        </div>
        {/* Alert row */}
        <div style={{ marginTop: 14, background: "rgba(255,106,0,0.08)", border: "1px solid rgba(255,106,0,0.18)", borderRadius: 8, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-signal-orange)", boxShadow: "0 0 8px rgba(255,106,0,0.8)", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Impact detected — Bay 3B · 2 actions open</span>
        </div>
      </div>

      {/* Floating badge — not tilted, anchored top-right */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 10, padding: "8px 12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      }}>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", margin: "0 0 2px", fontWeight: 600 }}>COMPLIANCE</p>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#22C55E", margin: 0, letterSpacing: "-0.02em" }}>Certified</p>
      </div>
    </>
  );
}

/* Card 2 — MHE Tracking
   Glass fleet card: 112% wide, tilted +4°, exits right */
function MHEWidget() {
  return (
    <>
      <div style={{
        position: "absolute",
        bottom: -24,
        left: 18,
        width: "112%",
        transform: "rotate(4deg)",
        transformOrigin: "bottom left",
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 16,
        padding: "18px 20px",
        boxShadow: "0 28px 56px rgba(0,0,0,0.25)",
      }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 14 }}>Fleet Status — Shift 2</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[{ v: "22", l: "Active", c: "#4ADE80" }, { v: "2", l: "Alert", c: "#FF6A00" }, { v: "4", l: "Idle", c: "rgba(255,255,255,0.35)" }].map(k => (
            <div key={k.l}>
              <p style={{ fontSize: 30, fontWeight: 800, color: k.c, letterSpacing: "-0.04em", margin: "0 0 2px" }}>{k.v}</p>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: 0 }}>{k.l}</p>
            </div>
          ))}
        </div>
        {/* Bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 36 }}>
          {[55,42,68,50,78,60,85,55,72,90,68,82].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: i === 9 ? "#FF6A00" : "rgba(255,255,255,0.18)" }} />
          ))}
        </div>
      </div>
      {/* Speed alert — top-left, not tilted */}
      <div style={{
        position: "absolute", top: 14, left: 14,
        background: "rgba(255,106,0,0.2)", border: "1px solid rgba(255,106,0,0.4)",
        borderRadius: 20, padding: "5px 12px",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-signal-orange)", boxShadow: "0 0 8px #FF6A00" }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-signal-orange)" }}>Speed alert — FLT-004</span>
      </div>
    </>
  );
}

/* Card 3 — AI Vision
   Full-bleed dark camera overlay — fills edge to edge, cinematic */
function AIWidget() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Subtle grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {[1,2,3,4].map(i => <line key={`h${i}`} x1="0" y1={`${i*25}%`} x2="100%" y2={`${i*25}%`} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>)}
        {[1,2,3,4,5].map(i => <line key={`v${i}`} x1={`${i*20}%`} y1="0" x2={`${i*20}%`} y2="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>)}
      </svg>

      {/* Large detection box — rack — bleeds left + top */}
      <div style={{ position: "absolute", top: -2, left: -2, width: "52%", height: "78%", border: "1.5px dashed rgba(255,106,0,0.7)", borderRadius: 4 }}>
        <div style={{ position: "absolute", top: 8, left: 8, background: "var(--color-signal-orange)", borderRadius: 4, padding: "3px 10px" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "white" }}>RACK DAMAGE · 96%</span>
        </div>
        <div style={{ position: "absolute", top: -1, left: -1, width: 14, height: 14, borderTop: "2.5px solid #FF6A00", borderLeft: "2.5px solid #FF6A00", borderRadius: "2px 0 0 0" }} />
        <div style={{ position: "absolute", top: -1, right: -1, width: 14, height: 14, borderTop: "2.5px solid #FF6A00", borderRight: "2.5px solid #FF6A00", borderRadius: "0 2px 0 0" }} />
        <div style={{ position: "absolute", bottom: -1, left: -1, width: 14, height: 14, borderBottom: "2.5px solid #FF6A00", borderLeft: "2.5px solid #FF6A00", borderRadius: "0 0 0 2px" }} />
        <div style={{ position: "absolute", bottom: -1, right: -1, width: 14, height: 14, borderBottom: "2.5px solid #FF6A00", borderRight: "2.5px solid #FF6A00", borderRadius: "0 0 2px 0" }} />
      </div>

      {/* Operator detection box — exits right */}
      <div style={{ position: "absolute", top: "18%", right: -2, width: "32%", height: "68%", border: "1.5px dashed rgba(59,130,246,0.75)", borderRadius: 4 }}>
        <div style={{ position: "absolute", top: 8, left: 8, background: "#3B82F6", borderRadius: 4, padding: "3px 10px" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "white" }}>PERSON · 99%</span>
        </div>
      </div>

      {/* Scan line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "45%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,128,0.4),transparent)" }} />

      {/* Live + cam labels */}
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "3px 10px" }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>LIVE</span>
      </div>
      <span style={{ position: "absolute", bottom: 10, left: 12, fontSize: 9, color: "rgba(255,255,255,0.2)" }}>CAM 07 — AISLE 3</span>
    </div>
  );
}

/* Card 4 — Inventory
   Table card: 120% wide, tilted +5°, exits bottom-right */
function InventoryWidget() {
  const rows = [
    { id: "PAL-0041", exp: "A-04-L2", act: "A-04-L2", ok: true },
    { id: "PAL-0189", exp: "B-07-L1", act: "C-02-L3", ok: false },
    { id: "PAL-0312", exp: "A-11-L2", act: "A-11-L2", ok: true },
    { id: "PAL-0456", exp: "D-03-L4", act: "D-03-L4", ok: true },
    { id: "PAL-0521", exp: "B-02-L2", act: "E-05-L1", ok: false },
  ];
  return (
    <div style={{
      position: "absolute",
      bottom: -28,
      left: 10,
      width: "120%",
      transform: "rotate(5deg)",
      transformOrigin: "bottom left",
      background: "white",
      borderRadius: 14,
      boxShadow: "0 24px 48px rgba(0,0,0,0.14)",
      border: "1px solid #EDEDED",
      overflow: "hidden",
    }}>
      <div style={{ padding: "10px 14px", background: "#FAFAFA", borderBottom: "1px solid #F0F0F0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto" }}>
        {["Pallet ID","Expected","Actual",""].map((h, i) => (
          <span key={i} style={{ fontSize: 8, fontWeight: 600, color: "#B0B0B8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
        ))}
      </div>
      {rows.map((r) => (
        <div key={r.id} style={{ padding: "8px 14px", borderBottom: "1px solid #F7F7F7", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 600, fontFamily: "monospace", color: "var(--color-carbon)" }}>{r.id}</span>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: "var(--color-graphite-alt)" }}>{r.exp}</span>
          <span style={{ fontSize: 10, fontFamily: "monospace", color: r.ok ? "#6E6E73" : "#FF6A00", fontWeight: r.ok ? 400 : 600 }}>{r.act}</span>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.ok ? "#22C55E" : "#FF6A00", boxShadow: r.ok ? "0 0 6px rgba(34,197,94,0.5)" : "0 0 6px rgba(255,106,0,0.5)" }} />
        </div>
      ))}
    </div>
  );
}

/* Card 5 — Digital Twin
   Massive isometric SVG: 160% scale from bottom-left, bleeds top + right */
function TwinWidget() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <svg
        viewBox="0 0 280 200"
        style={{
          position: "absolute",
          bottom: -40,
          left: -30,
          width: "160%",
          height: "auto",
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
        }}
      >
        {/* Dot grid */}
        {Array.from({length:7}).map((_,r) => Array.from({length:11}).map((_,c) => (
          <circle key={`${r}-${c}`} cx={c*26+13} cy={r*26+13} r={1.2} fill="rgba(34,197,94,0.2)" />
        )))}

        {/* Floor plane */}
        <path d="M 50 140 L 140 90 L 230 140 L 140 190 Z" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.3)" strokeWidth="1"/>

        {/* Building — left wall */}
        <path d="M 50 140 L 50 80 L 140 30 L 140 90 Z" fill="rgba(34,197,94,0.14)" stroke="rgba(34,197,94,0.35)" strokeWidth="1"/>
        {/* Building — right wall */}
        <path d="M 140 30 L 140 90 L 230 140 L 230 80 Z" fill="rgba(34,197,94,0.09)" stroke="rgba(34,197,94,0.25)" strokeWidth="1"/>
        {/* Building — roof */}
        <path d="M 50 80 L 140 30 L 230 80 L 140 130 Z" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.4)" strokeWidth="1"/>

        {/* Inner rack rows on floor */}
        {[0,1,2].map(i => (
          <g key={i} transform={`translate(${i*28},${i*14})`}>
            <path d="M 80 148 L 110 132 L 110 156 L 80 172 Z" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.2)" strokeWidth="0.8"/>
          </g>
        ))}

        {/* Glow nodes at corners */}
        {[[50,140],[140,90],[230,140],[140,30]].map(([x,y],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={4} fill="#22C55E" opacity={0.9}/>
            <circle cx={x} cy={y} r={8} fill="rgba(34,197,94,0.2)"/>
          </g>
        ))}

        {/* Live sync line to badge */}
        <line x1="140" y1="30" x2="200" y2="14" stroke="rgba(34,197,94,0.4)" strokeWidth="1" strokeDasharray="3 2"/>
        <rect x="204" y="6" width="60" height="18" rx="5" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.35)" strokeWidth="1"/>
        <circle cx="213" cy="15" r="3" fill="#22C55E"/>
        <text x="238" y="19" textAnchor="middle" fontSize="7" fill="#16A34A" fontWeight="700">LIVE SYNC</text>
      </svg>
    </div>
  );
}

/* Card 6 — AIMS Dashboard
   Browser mockup: 130% wide from left, right edge intentionally cropped */
function AIMSWidget() {
  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 20,
      width: "88%",
      top: 16,
      background: "white",
      borderRadius: "14px 14px 0 0",
      boxShadow: "0 -8px 48px rgba(0,0,0,0.14)",
      border: "1px solid #E5E7EB",
      borderBottom: "none",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Browser bar */}
      <div style={{ background: "#F9F9FB", borderBottom: "1px solid #EFEFEF", padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F57" }}/>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FEBC2E" }}/>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C840" }}/>
        <div style={{ flex: 1, background: "#EFEFEF", borderRadius: 4, height: 18, marginLeft: 8, display: "flex", alignItems: "center", paddingLeft: 10 }}>
          <span style={{ fontSize: 9, color: "#9CA3AF" }}>aims.ramstech.io/dashboard</span>
        </div>
      </div>
      {/* App content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 130, background: "var(--color-carbon)", flexShrink: 0, padding: "16px 0" }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: "var(--color-signal-orange)", padding: "0 14px", letterSpacing: "0.1em", marginBottom: 14 }}>AIMS</p>
          {["Overview","Racks","MHEs","Inventory","Reports","Settings"].map((item, i) => (
            <div key={item} style={{ padding: "7px 14px", background: i === 0 ? "rgba(255,106,0,0.12)" : "transparent", borderLeft: i === 0 ? "2px solid #FF6A00" : "2px solid transparent" }}>
              <span style={{ fontSize: 10, color: i === 0 ? "white" : "rgba(255,255,255,0.3)", fontWeight: i === 0 ? 600 : 400 }}>{item}</span>
            </div>
          ))}
        </div>
        {/* Main */}
        <div style={{ flex: 1, padding: 16, background: "#FAFAFA", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
            {[
              { l: "Safety Score", v: "98.4%", c: "#22C55E" },
              { l: "Fleet Active", v: "24 / 26", c: "#3B82F6" },
              { l: "Stock Acc.", v: "99.7%", c: "#8B5CF6" },
              { l: "Open Actions", v: "3", c: "#FF6A00" },
            ].map(k => (
              <div key={k.l} style={{ background: "white", borderRadius: 8, padding: "10px 12px", border: "1px solid #EFEFEF" }}>
                <p style={{ fontSize: 8, color: "#9CA3AF", margin: "0 0 4px" }}>{k.l}</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: k.c, margin: 0, letterSpacing: "-0.02em" }}>{k.v}</p>
              </div>
            ))}
          </div>
          {/* Table */}
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #EFEFEF", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", padding: "8px 12px", background: "#F9F9FB", borderBottom: "1px solid #EFEFEF" }}>
              {["Location","Asset","Status","Score"].map(h => (
                <span key={h} style={{ fontSize: 8, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
              ))}
            </div>
            {[
              { loc:"Aisle 3-B", asset:"Rack #47", s:"Alert",    score:"72", c:"#FF6A00" },
              { loc:"Aisle 1-A", asset:"FLT-004",  s:"Active",   score:"98", c:"#22C55E" },
              { loc:"Bay 7C",    asset:"PAL-0189", s:"Mismatch", score:"—",  c:"#EF4444" },
              { loc:"Zone D",    asset:"Rack #12", s:"Good",     score:"96", c:"#22C55E" },
              { loc:"Aisle 5-C", asset:"FLT-011",  s:"Idle",     score:"88", c:"#6E6E73" },
            ].map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", padding: "7px 12px", borderBottom: "1px solid #FAFAFA", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: "var(--color-graphite-alt)" }}>{r.loc}</span>
                <span style={{ fontSize: 9, fontWeight: 500, color: "var(--color-carbon)" }}>{r.asset}</span>
                <div style={{ display: "inline-flex" }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: r.c, background: `${r.c}15`, borderRadius: 3, padding: "1px 6px" }}>{r.s}</span>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: r.c }}>{r.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Card shell ───────────────────────────────────────── */
function Card({
  headline, href, gradientBg, visualHeight = 260, children,
}: {
  headline: string; href: string; gradientBg: string;
  visualHeight?: number; children: React.ReactNode;
}) {
  return (
    <a href={href} className="group flex flex-col no-underline"
      style={{
        background: "white", border: "1px solid #E5E7EB",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 250ms ease-out, transform 250ms ease-out",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
      }}
    >
      {/* Text area */}
      <div style={{ padding: "20px 20px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#0F0F10", lineHeight: 1.35, letterSpacing: "-0.01em", margin: 0 }}>
          {headline}
        </p>
        <Arrow />
      </div>
      {/* Visual area — gradient, edge-to-edge, clips overflow */}
      <div style={{ background: gradientBg, height: visualHeight, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {children}
      </div>
    </a>
  );
}

/* ── Section ─────────────────────────────────────────── */
export function ChallengeProblemGrid() {
  return (
    <section style={{ background: "#F7F7F9", padding: "72px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>

        <p style={{ fontSize: 15, color: "var(--color-graphite-alt)", lineHeight: 1.65, marginBottom: 32, maxWidth: 540 }}>
          <strong style={{ color: "var(--color-carbon)" }}>Six challenges across every warehouse operation. </strong>
          RAMS addresses each one with purpose-built intelligence — designed to work individually or together.
        </p>

        {/* Row 1 — 2 equal large */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Card headline="Identify rack damage before it becomes a liability."
            href="/solutions/rack-safety"
            gradientBg="linear-gradient(145deg,#FF7A30 0%,#E8460A 40%,#9B1FBE 100%)"
            visualHeight={300}>
            <RackWidget />
          </Card>
          <Card headline="Track every MHE movement across every shift."
            href="/solutions/mhe-intelligence"
            gradientBg="linear-gradient(145deg,#6D5FFA 0%,#4F46E5 45%,#312E81 100%)"
            visualHeight={300}>
            <MHEWidget />
          </Card>
        </div>

        {/* Row 2 — 3 equal smaller */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Card headline="Monitor every aisle and movement, 24/7."
            href="/platform/ai-vision"
            gradientBg="#09090A"
            visualHeight={260}>
            <AIWidget />
          </Card>
          <Card headline="Reconcile inventory against your WMS in real time."
            href="/solutions/inventory-intelligence"
            gradientBg="linear-gradient(145deg,#FEF9EF 0%,#FDE8C4 100%)"
            visualHeight={260}>
            <InventoryWidget />
          </Card>
          <Card headline="Your warehouse, live and always current."
            href="/platform/digital-twin"
            gradientBg="linear-gradient(145deg,#F0FDF6 0%,#BBFBD8 100%)"
            visualHeight={260}>
            <TwinWidget />
          </Card>
        </div>

        {/* Row 3 — full width */}
        <Card headline="One view across every site, every operation."
          href="/solutions/aims"
          gradientBg="linear-gradient(145deg,#F5F3FF 0%,#DDD6FE 100%)"
          visualHeight={300}>
          <AIMSWidget />
        </Card>

      </div>
    </section>
  );
}
