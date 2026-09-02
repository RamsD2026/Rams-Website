"use client";

import {
  ChevronRight,
  CircleCheck,
  Eye,
  Radar,
  ShieldCheck,
  UserCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Action & verification.
 *
 * The argument is that a safety dashboard ending in a number changes nothing,
 * so the section is the route from a detection to a verified closure. The
 * first three steps are done and the last three are not, which is what "RTSS
 * shows what is still open" means in practice.
 */

const LINE = "#E8E8ED";

/* ── detection through to closure ────────────────────────── */

const PIPE: {
  n: string;
  t: string;
  sub: string;
  done: boolean;
  Icon: LucideIcon;
}[] = [
  {
    n: "01",
    t: "Detected",
    sub: "Recorded with its machine, operator and location.",
    done: true,
    Icon: Radar,
  },
  {
    n: "02",
    t: "Reviewed",
    sub: "Read against the movement record and evidence.",
    done: true,
    Icon: Eye,
  },
  {
    n: "03",
    t: "Action assigned",
    sub: "Given an owner and a specific next step.",
    done: true,
    Icon: UserCheck,
  },
  {
    n: "04",
    t: "Intervention",
    sub: "The training, repair or change happens.",
    done: false,
    Icon: Wrench,
  },
  {
    n: "05",
    t: "Verified",
    sub: "The same indicators measured again after it.",
    done: false,
    Icon: ShieldCheck,
  },
  {
    n: "06",
    t: "Closed",
    sub: "Resolved on the record, not just acknowledged.",
    done: false,
    Icon: CircleCheck,
  },
];

export function RtssAction() {
  return (
    <Section surface="white" id="action">
      <SectionHeader
        eyebrow="Action & verification"
        top="Do not just count events."
        bottom="Close the risk behind them."
        body="A safety dashboard that ends in a number changes nothing. Each event carries through to a completed, verified outcome — and RTSS shows what is still open."
        size="compact"
        width="wide"
        bodyWidth="wide"
      />

      {/* ── detection to closure ───────────────────────── */}
      <div className="max-w-[1080px] mx-auto overflow-x-auto">
        <ol className="flex flex-nowrap items-start min-w-[1020px]">
          {PIPE.map((st, i) => (
            <li key={st.n} className="contents">
              {i > 0 && (
                <span
                  aria-hidden
                  className="flex items-center shrink-0 pt-[19px] px-1"
                >
                  <span
                    className="h-px w-5"
                    style={{
                      background: st.done ? "rgba(255,106,0,0.45)" : LINE,
                    }}
                  />
                  <ChevronRight
                    className="w-3 h-3 -ml-[3px]"
                    strokeWidth={2}
                    style={{
                      color: st.done ? "rgba(255,106,0,0.75)" : "#D6D6DC",
                    }}
                  />
                </span>
              )}

              <span
                className="flex flex-col items-center text-center px-3"
                style={{ flex: "1 1 168px", minWidth: 0 }}
              >
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                  style={{
                    background: st.done
                      ? "rgba(255,106,0,0.09)"
                      : "rgba(8,8,10,0.035)",
                    border: `1px solid ${
                      st.done ? "rgba(255,106,0,0.28)" : LINE
                    }`,
                  }}
                >
                  <st.Icon
                    className={
                      "w-[17px] h-[17px] " +
                      (st.done ? "text-signal-orange" : "text-graphite/35")
                    }
                    strokeWidth={1.7}
                    aria-hidden
                  />
                </span>
                <span className="mt-3 text-[9.5px] font-mono tracking-[0.11em] uppercase text-graphite/40">
                  {st.n}
                </span>
                <span
                  className={
                    "mt-1.5 text-[13.5px] font-semibold tracking-[-0.01em] " +
                    (st.done ? "text-signal-orange" : "text-graphite/70")
                  }
                >
                  {st.t}
                </span>
                <span className="mt-2 text-[12px] text-graphite/55 leading-[1.55]">
                  {st.sub}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
