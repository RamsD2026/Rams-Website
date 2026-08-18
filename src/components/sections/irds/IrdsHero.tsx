"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function IrdsHero() {
  return (
    <section
      className="irds-hero-section relative overflow-hidden pt-44 pb-24 sm:pt-48 sm:pb-32 lg:pt-[220px] lg:pb-[140px]"
    >
      <style>{`
        .irds-hero-section{
          background:
            radial-gradient(circle at 74% 40%,rgba(255,106,0,.18),transparent 28%),
            linear-gradient(180deg,#001216 0%,#000E11 75%);
        }
        .irds-hero-section:before{
          content:"";position:absolute;inset:0;opacity:.2;pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.05) 1px, transparent 1px);
          background-size:54px 54px;
          mask-image:linear-gradient(to bottom,black,transparent 85%);
          -webkit-mask-image:linear-gradient(to bottom,black,transparent 85%);
        }
      `}</style>

      <div className="relative rams-container">
        {/* 12-col: content (6) + visual (6) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.04fr_.96fr] gap-x-6 lg:gap-x-[44px] gap-y-10 items-center">
          {/* Copy */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
              className="text-white font-bold leading-[1.02] tracking-[-0.025em] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Know the health
              <br />
              of <span className="text-signal-orange">every rack.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.28 }}
              className="mt-8 text-lg text-white/60 max-w-[560px] leading-[1.7]"
            >
              Move beyond periodic inspection. RAMS combines expert rack
              inspection, digital twin intelligence, risk classification,
              issue closure and continuous visibility into one connected
              rack-safety system.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.38 }}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/book-a-demo"
                className="group inline-flex items-center gap-2 bg-signal-orange hover:bg-signal-orange-hover px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-px"
              >
                Book a Rack Safety Review
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/platform"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200"
              >
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                See the Platform
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-2"
            >
              {[
                "Digital rack identity",
                "Risk-led inspection",
                "Actionable intelligence",
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white/90"
                >
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Visual — pallet-rack scene copied verbatim from preview-3.html */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="w-full"
          >
            <RackVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Rack visual — verbatim port of preview-3.html
   ───────────────────────────────────────────── */
function RackVisual() {
  return (
    <>
      <style>{`
        .irds-hero-visual{
          min-height:540px;position:relative;border:1px solid rgba(255,255,255,.13);
          border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.015));
          overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.38)
        }
        .irds-rack-scene{position:absolute;inset:60px 30px 80px;perspective:900px}
        .irds-rack-row{height:84%;display:flex;gap:16px;align-items:flex-end;transform:rotateY(-7deg) rotateX(2deg)}
        .irds-bay{
          flex:1;height:100%;position:relative;border-left:5px solid #5D686E;border-right:5px solid #5D686E;
          background:linear-gradient(to bottom,transparent 0 12%,rgba(255,255,255,.018) 12% 13%,transparent 13% 34%,
            rgba(255,255,255,.018) 34% 35%,transparent 35% 56%,rgba(255,255,255,.018) 56% 57%,transparent 57% 78%,
            rgba(255,255,255,.018) 78% 79%,transparent 79%)
        }
        .irds-bay:before{
          content:"";position:absolute;inset:11% -7px auto;height:5px;background:#657077;
          box-shadow:0 95px 0 #657077,0 190px 0 #657077,0 285px 0 #657077
        }
        .irds-pallet{
          position:absolute;height:48px;left:12%;right:12%;background:#15272C;border:1px solid #34464C;
          box-shadow:inset 0 -7px 0 #0D1B1F;border-radius:3px
        }
        .irds-p1{top:18%}.irds-p2{top:40%}.irds-p3{top:62%}
        .irds-bay.irds-risk{border-left-color:#FF6A00}
        .irds-scan{
          position:absolute;left:10%;right:8%;top:38%;height:2px;background:linear-gradient(90deg,transparent,#FF6A00,transparent);
          box-shadow:0 0 18px #FF6A00;animation:irds-scan 3.4s linear infinite
        }
        @keyframes irds-scan{0%{top:18%;opacity:.15}50%{opacity:1}100%{top:78%;opacity:.15}}
        .irds-hud{
          position:absolute;background:rgba(2,19,23,.92);border:1px solid rgba(255,255,255,.13);border-radius:14px;
          backdrop-filter:blur(12px);box-shadow:0 16px 50px rgba(0,0,0,.32)
        }
        .irds-hud-health{right:18px;top:24px;width:194px;padding:16px}
        .irds-hud-status{left:20px;bottom:22px;width:250px;padding:16px}
        .irds-hud-title{font-size:11px;color:#8E9A9F;text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px}
        .irds-score{font-size:42px;font-weight:850;letter-spacing:-.06em;color:#FFFFFF}
        .irds-score small{font-size:14px;color:#98A3A8;letter-spacing:0}
        .irds-status-row{display:flex;justify-content:space-between;align-items:center;margin:8px 0;font-size:13px;color:#B7C0C4}
        .irds-pill{font-size:10px;font-weight:800;padding:4px 8px;border-radius:999px}
        .irds-pill.irds-green{background:rgba(43,203,116,.13);color:#54DE91}
        .irds-pill.irds-amber{background:rgba(255,176,32,.13);color:#FFBE47}
        .irds-pill.irds-red{background:rgba(255,77,77,.13);color:#FF6C6C}
      `}</style>

      <div className="irds-hero-visual">
        <div className="irds-rack-scene">
          <div className="irds-rack-row">
            <div className="irds-bay">
              <div className="irds-pallet irds-p1"></div>
              <div className="irds-pallet irds-p2"></div>
              <div className="irds-pallet irds-p3"></div>
            </div>
            <div className="irds-bay irds-risk">
              <div className="irds-pallet irds-p1"></div>
              <div className="irds-pallet irds-p2"></div>
              <div className="irds-pallet irds-p3"></div>
            </div>
            <div className="irds-bay">
              <div className="irds-pallet irds-p1"></div>
              <div className="irds-pallet irds-p2"></div>
              <div className="irds-pallet irds-p3"></div>
            </div>
            <div className="irds-bay">
              <div className="irds-pallet irds-p1"></div>
              <div className="irds-pallet irds-p2"></div>
              <div className="irds-pallet irds-p3"></div>
            </div>
          </div>
          <div className="irds-scan"></div>
        </div>

        <div className="irds-hud irds-hud-health">
          <div className="irds-hud-title">Rack Health Index</div>
          <div className="irds-score">91<small>/100</small></div>
          <div className="irds-status-row"><span>Open findings</span><b>14</b></div>
          <div className="irds-status-row"><span>Critical</span><b style={{ color: "#FF6C6C" }}>2</b></div>
        </div>

        <div className="irds-hud irds-hud-status">
          <div className="irds-hud-title">Row B / Upright B-18</div>
          <div className="irds-status-row"><span>Upright deformation</span><span className="irds-pill irds-amber">AMBER</span></div>
          <div className="irds-status-row"><span>Baseplate</span><span className="irds-pill irds-green">GREEN</span></div>
          <div className="irds-status-row"><span>Beam lock</span><span className="irds-pill irds-red">ACTION</span></div>
        </div>
      </div>
    </>
  );
}
