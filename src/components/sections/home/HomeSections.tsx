import {
  ASSET_PILLS, COMPARE, EVOLUTION, MODEL_STEPS, NOW_NEXT, PILLARS, UNIVERSE,
} from "./home-data";

/**
 * The homepage's static sections, in one file.
 *
 * They belong together: every one is a list rendered from `home-data.ts` and
 * none carries behaviour, so splitting them eight ways would cost more in
 * imports than it buys. The one section that *does* carry behaviour — the
 * solution finder — is its own client component next door.
 *
 * None of these say `"use client"`. They are lists and markup, so they render
 * on the server; only `HomeFinder` and the hero's film need the browser.
 *
 * Class names are the design's own (`.wrap`, `.section`, `.eyebrow`, …), which
 * is why `homepage.css` scopes every one of them under `.home-page`.
 */

/** The eyebrow → heading → intro block the design puts above most sections. */
function Head({ label, h, p }: { label: string; h: React.ReactNode; p?: React.ReactNode }) {
  return (
    <div className="section-head reveal">
      <div className="eyebrow">{label}</div>
      <h2>{h}</h2>
      {p ? <p>{p}</p> : null}
    </div>
  );
}

/* ── 02 the RAMS idea ───────────────────────────────────────────── */

export function HomeStatement() {
  return (
    <section className="section statement" id="why">
      <div className="wrap statement-inner">
        <div className="eyebrow">The RAMS Idea</div>

        <h2>
          Make the <em>physical warehouse</em> intelligent — not just one machine inside it.
        </h2>

        <p>
          Most warehouse technologies see only a part of the operation. RAMS is designed around the
          warehouse as a connected physical system — bringing racks, MHEs, pallets, people,
          infrastructure and operational data into a common digital context.
        </p>

        <div className="universe">
          {UNIVERSE.map((u) => (
            <div className="universe-card" key={u.h}>
              <small>{u.n}</small>
              <h3>{u.h}</h3>
              <p>{u.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 03 what RAMS improves ──────────────────────────────────────── */

export function HomeOutcomes() {
  return (
    <section className="section tight outcomes-section" id="platform">
      <div className="wrap">
        <Head label="What RAMS Improves" h="Four outcomes across the warehouse." />

        <div className="pillar-grid">
          {PILLARS.map((p) => (
            <article className="pillar reveal" key={p.h}>
              <div className="icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {p.d.map((d) => (
                    <path d={d} key={d} />
                  ))}
                  {p.circle ? <circle cx={p.circle[0]} cy={p.circle[1]} r={p.circle[2]} /> : null}
                </svg>
              </div>
              <h3>{p.h}</h3>
              <p>{p.p}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 04 how RAMS works ──────────────────────────────────────────── */

export function HomeModel() {
  return (
    <section className="section model-section" id="how-it-works">
      <div className="wrap model-grid">
        <div className="reveal">
          <div className="eyebrow">How RAMS Works</div>
          <h2>From physical reality to a warehouse that learns and evolves.</h2>
          <p className="muted model-lead">
            RAMS creates a shared operating context for racks, MHEs, pallets and people—then
            connects live activity, learns from every event and helps the warehouse improve over
            time.
          </p>
        </div>

        <div className="model-cards">
          {MODEL_STEPS.map((m) => (
            <div className="model-card reveal" key={m.n}>
              <div className="num">{m.n}</div>
              <div>
                <b>{m.b}</b>
                <span>{m.s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 06 a different path ────────────────────────────────────────── */

export function HomeCompare() {
  return (
    <section className="section compare-section">
      <div className="wrap">
        <Head
          label="A Different Path to Warehouse Intelligence"
          h="Automation doesn’t have to begin with replacement."
          p="Fully robotic warehouses can deliver very high levels of automation. RAMS creates another path: improve the intelligence of the warehouse you already operate, then add automation progressively where it makes sense."
        />

        <div className="compare-grid">
          {COMPARE.map((c) => (
            <article className={"compare-card reveal" + (c.highlight ? " highlight" : "")} key={c.badge}>
              <span className="compare-badge">{c.badge}</span>
              <h3>{c.h}</h3>
              <p className="sub">{c.sub}</p>

              <div className="feature-list">
                {c.items.map((item) => (
                  <div className="feature" key={item}>
                    <span className="check">{c.check}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 07 any moving asset ────────────────────────────────────────── */

export function HomeAssets() {
  return (
    <section className="section oem-band">
      <div className="wrap oem-grid">
        <div className="reveal">
          <div className="eyebrow">Any Moving Asset. Any OEM.</div>
          <h2>Manual or autonomous — movement belongs in one operating context.</h2>
          <p className="muted model-lead">
            MHE intelligence is one important layer of RAMS, not the whole platform. RAMS is
            designed so forklifts, reach trucks, AGVs, AMRs and future autonomous machines can
            ultimately operate within the same warehouse intelligence architecture.
          </p>
        </div>

        <div className="asset-cloud reveal">
          {ASSET_PILLS.map((a) => (
            <div className="asset-pill" key={a}>
              {a}
            </div>
          ))}
          <div className="asset-pill core">One RAMS Physical Operating Layer</div>
        </div>
      </div>
    </section>
  );
}

/* ── 08 progressive transformation ──────────────────────────────── */

export function HomeEvolution() {
  return (
    <section className="section" id="evolution">
      <div className="wrap">
        <Head
          label="Progressive Transformation"
          h="From physical to intelligent. From manual to autonomous."
          p="RAMS is designed to remain relevant throughout the warehouse’s evolution — from conventional operations to connected, intelligent and increasingly autonomous systems."
        />

        <div className="evolution">
          {EVOLUTION.map((e) => (
            <div className={"phase reveal" + (e.active ? " active" : "")} key={e.n}>
              <small>{e.n}</small>
              <h3>{e.h}</h3>
              <p>{e.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 09 today and tomorrow ──────────────────────────────────────── */

export function HomeNowNext() {
  return (
    <section className="section tight">
      <div className="wrap">
        <Head
          label="Built for Today. Designed for Tomorrow."
          h="Connect racks, MHEs, pallets and people. Build one intelligent warehouse over time."
        />

        <div className="now-next">
          {NOW_NEXT.map((n) => (
            <article className={"now-card reveal" + (n.future ? " future" : "")} key={n.h}>
              <h3>{n.h}</h3>
              <p className="sub">{n.sub}</p>

              <div className="mini-list">
                {n.items.map((item) => (
                  <div className="mini-item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 10 the close ───────────────────────────────────────────────── */

export function HomeCTA() {
  return (
    <section className="section tight" id="contact">
      <div className="wrap">
        <div className="cta reveal">
          <div className="eyebrow">Clarity in Motion</div>
          <h2>Make the warehouse you already have intelligent.</h2>
          <p>
            Start with rack safety, a Digital Twin, connected MHE, intelligent hardware or another
            physical warehouse problem — and build progressively from there.
          </p>
          <a href="/contact" className="btn primary">
            Talk to RAMS →
          </a>
        </div>
      </div>
    </section>
  );
}
