"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { MheFleetAssessmentModal } from "./MheFleetAssessmentModal";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MheHero() {
  const [assessOpen, setAssessOpen] = useState(false);

  return (
    <section className="mhe-hero-section relative overflow-hidden pt-44 pb-24 sm:pt-48 sm:pb-32 lg:pt-[220px] lg:pb-[140px]">
      <style>{`
        .mhe-hero-section{
          background:
            radial-gradient(circle at 80% 30%,rgba(255,106,0,.18),transparent 24%),
            radial-gradient(circle at 72% 64%,rgba(70,167,255,.10),transparent 22%),
            linear-gradient(180deg,#001216 0%,#000E11 76%);
        }
        .mhe-hero-section:before{
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
        <div className="grid grid-cols-1 lg:grid-cols-[1.04fr_.96fr] gap-x-6 lg:gap-x-[44px] gap-y-10 items-center">
          {/* Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span
                className="w-[7px] h-[7px] rounded-full"
                style={{ background: "#FF6A00", boxShadow: "0 0 14px #FF6A00" }}
              />
              <span className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#ffb27c]">
                MHE Safety & Productivity
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
              className="text-white font-bold leading-[1.02] tracking-[-0.025em] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Make every movement
              <br />
              safer and more productive.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.28 }}
              className="mt-8 text-lg text-white/60 max-w-[560px] leading-[1.7]"
            >
              RAMS helps you monitor MHE activity, improve utilisation, reduce
              unsafe behaviour, track operator performance and turn movement
              data into actionable warehouse intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.38 }}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <button
                type="button"
                onClick={() => setAssessOpen(true)}
                className="group inline-flex items-center gap-2 bg-signal-orange hover:bg-signal-orange-hover px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-px"
              >
                Assess My Fleet
                <ArrowRight
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </button>
              <Link
                href="/platform"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200"
              >
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                Explore Capabilities
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-2"
            >
              {[
                "Fleet visibility",
                "Operator-linked safety",
                "Movement intelligence",
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

          {/* Visual — warehouse floor */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="w-full"
          >
            <WarehouseVisual />
          </motion.div>
        </div>
      </div>

      <MheFleetAssessmentModal
        open={assessOpen}
        onClose={() => setAssessOpen(false)}
      />
    </section>
  );
}

function WarehouseVisual() {
  return (
    <>
      <style>{`
        .mhe-hero-visual{
          min-height:560px;position:relative;border:1px solid rgba(255,255,255,.13);
          border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.018));
          overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.38)
        }
        .mhe-warehouse-floor{
          position:absolute;inset:26px;background:#06171B;border-radius:24px;overflow:hidden
        }
        .mhe-warehouse-floor:before{
          content:"";position:absolute;inset:0;opacity:.45;
          background-image:
            linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.04) 1px, transparent 1px);
          background-size:40px 40px;
        }
        .mhe-zone{
          position:absolute;border:1px dashed rgba(255,255,255,.14);border-radius:14px;
          background:rgba(255,255,255,.02)
        }
        .mhe-z1{left:26px;top:32px;width:46%;height:30%}
        .mhe-z2{right:26px;top:32px;width:38%;height:30%}
        .mhe-z3{left:26px;bottom:36px;width:58%;height:36%}
        .mhe-z4{right:26px;bottom:36px;width:26%;height:36%}
        .mhe-aisle{
          position:absolute;background:rgba(255,255,255,.03);border-radius:10px
        }
        .mhe-a1{left:58px;top:68px;width:38%;height:26px}
        .mhe-a2{left:58px;top:112px;width:38%;height:26px}
        .mhe-a3{left:58px;top:156px;width:38%;height:26px}
        .mhe-a4{left:58px;bottom:118px;width:49%;height:30px}
        .mhe-a5{left:58px;bottom:72px;width:49%;height:30px}
        .mhe-dock{
          position:absolute;right:48px;bottom:58px;width:19%;height:70px;
          border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04)
        }

        .mhe-vehicle{
          position:absolute;width:66px;height:40px;border-radius:10px;
          background:linear-gradient(145deg,#FF7B1F,#FF6A00);box-shadow:0 12px 20px rgba(255,106,0,.26)
        }
        .mhe-vehicle:before{
          content:"";position:absolute;left:8px;right:12px;top:8px;height:10px;border-radius:6px;
          background:rgba(0,0,0,.26)
        }
        .mhe-vehicle:after{
          content:"";position:absolute;left:10px;bottom:-6px;width:12px;height:12px;border-radius:50%;
          background:#1F2A2F;box-shadow:34px 0 0 #1F2A2F
        }
        .mhe-v1{left:94px;top:102px;animation:mhe-drift1 6s ease-in-out infinite}
        .mhe-v2{left:192px;top:146px;animation:mhe-drift2 7s ease-in-out infinite}
        .mhe-v3{left:330px;bottom:104px;animation:mhe-drift3 8s ease-in-out infinite}
        .mhe-v4{right:84px;top:118px;animation:mhe-drift4 6.5s ease-in-out infinite}
        .mhe-v5{right:90px;bottom:80px;animation:mhe-drift5 7.5s ease-in-out infinite}
        @keyframes mhe-drift1{0%,100%{transform:translateX(0)}50%{transform:translateX(24px)}}
        @keyframes mhe-drift2{0%,100%{transform:translateX(0)}50%{transform:translateX(-20px)}}
        @keyframes mhe-drift3{0%,100%{transform:translateX(0)}50%{transform:translateX(28px)}}
        @keyframes mhe-drift4{0%,100%{transform:translateX(0)}50%{transform:translateX(-18px)}}
        @keyframes mhe-drift5{0%,100%{transform:translateX(0)}50%{transform:translateX(-22px)}}

        .mhe-path{
          position:absolute;border-top:2px dashed rgba(70,167,255,.6);transform-origin:left center
        }
        .mhe-p1{left:126px;top:123px;width:150px;transform:rotate(10deg)}
        .mhe-p2{left:224px;top:164px;width:160px;transform:rotate(22deg)}
        .mhe-p3{left:365px;bottom:118px;width:136px;transform:rotate(-8deg)}
        .mhe-p4{right:148px;top:138px;width:72px;transform:rotate(-28deg)}

        .mhe-alert{
          position:absolute;background:rgba(2,19,23,.96);border:1px solid rgba(255,255,255,.13);
          border-radius:14px;backdrop-filter:blur(12px);box-shadow:0 16px 50px rgba(0,0,0,.32)
        }
        .mhe-alert-top{right:18px;top:18px;width:210px;padding:16px}
        .mhe-alert-bottom{left:18px;bottom:18px;width:264px;padding:16px}
        .mhe-hud-title{font-size:11px;color:#8E9A9F;text-transform:uppercase;letter-spacing:.12em;margin-bottom:10px}
        .mhe-score{font-size:40px;font-weight:850;letter-spacing:-.06em;color:#fff}
        .mhe-score small{font-size:14px;color:#98A3A8;letter-spacing:0;font-weight:400}
        .mhe-status-row{display:flex;justify-content:space-between;align-items:center;margin:8px 0;font-size:13px;color:#B8C2C6}
        .mhe-pill{font-size:10px;font-weight:800;padding:4px 8px;border-radius:999px}
        .mhe-pill-green{background:rgba(43,203,116,.13);color:#54DE91}
        .mhe-pill-amber{background:rgba(255,176,32,.13);color:#FFBE47}
        .mhe-pill-red{background:rgba(255,77,77,.13);color:#FF7777}
        .mhe-pill-blue{background:rgba(70,167,255,.13);color:#77BDFF}
      `}</style>

      <div className="mhe-hero-visual">
        <div className="mhe-warehouse-floor">
          <div className="mhe-zone mhe-z1"></div>
          <div className="mhe-zone mhe-z2"></div>
          <div className="mhe-zone mhe-z3"></div>
          <div className="mhe-zone mhe-z4"></div>

          <div className="mhe-aisle mhe-a1"></div>
          <div className="mhe-aisle mhe-a2"></div>
          <div className="mhe-aisle mhe-a3"></div>
          <div className="mhe-aisle mhe-a4"></div>
          <div className="mhe-aisle mhe-a5"></div>
          <div className="mhe-dock"></div>

          <div className="mhe-path mhe-p1"></div>
          <div className="mhe-path mhe-p2"></div>
          <div className="mhe-path mhe-p3"></div>
          <div className="mhe-path mhe-p4"></div>

          <div className="mhe-vehicle mhe-v1"></div>
          <div className="mhe-vehicle mhe-v2"></div>
          <div className="mhe-vehicle mhe-v3"></div>
          <div className="mhe-vehicle mhe-v4"></div>
          <div className="mhe-vehicle mhe-v5"></div>
        </div>

        <div className="mhe-alert mhe-alert-top">
          <div className="mhe-hud-title">Fleet Status</div>
          <div className="mhe-score">
            18<small> active MHEs</small>
          </div>
          <div className="mhe-status-row">
            <span>Utilisation</span>
            <b>76%</b>
          </div>
          <div className="mhe-status-row">
            <span>Safety alerts</span>
            <b style={{ color: "#FF7777" }}>3</b>
          </div>
        </div>

        <div className="mhe-alert mhe-alert-bottom">
          <div className="mhe-hud-title">Live Event • MHE-07</div>
          <div className="mhe-status-row">
            <span>Zone</span>
            <span className="mhe-pill mhe-pill-blue">Dispatch</span>
          </div>
          <div className="mhe-status-row">
            <span>Speed threshold</span>
            <span className="mhe-pill mhe-pill-amber">Warning</span>
          </div>
          <div className="mhe-status-row">
            <span>Operator logged in</span>
            <span className="mhe-pill mhe-pill-green">Verified</span>
          </div>
        </div>
      </div>
    </>
  );
}
