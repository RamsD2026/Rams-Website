"use client";

import { useCallback, useEffect, useState } from "react";
import { SstFilm } from "./SstFilm";
import { SstHero } from "./SstHero";
import { SstProblem } from "./SstProblem";
import { SstSensors } from "./SstSensors";
import { SstLidar } from "./SstLidar";
import { SstAccess } from "./SstAccess";
import { SstPallet } from "./SstPallet";
import { SstBattery } from "./SstBattery";
import { SstHardware } from "./SstHardware";
import { SstCompare, SstCTA, SstFAQ, SstWhere, SstWorks } from "./SstSections";
import { SstSheet } from "./SstSheet";
import { SHEETS, type LidarMode, type SheetKey } from "./sst-data";
import type { DevKey } from "./sst-3d";

/**
 * The page shell.
 *
 * Holds the three pieces of state the sections share, all of which exist because
 * this page cross-references itself constantly — a sensor card, a sheet and a
 * caption all want to say "see that one working" about something three sections
 * away:
 *
 *   · **which sheet is open**, mirrored into the URL as `#ss-access`,
 *     `#ss-lidar`, `#ss-pds`, `#ss-bms`, so a sheet is shareable and the Back
 *     gesture closes it rather than leaving the page. Same contract as the
 *     OmniBox and AI Vision sheets.
 *   · **which answer the LiDAR showcase is showing** — set by its own tabs, by
 *     "Watch it" on the Crash, Speed and Location cards, by the LiDAR sheet, and
 *     by the hardware viewer's captions.
 *   · **which device the hardware viewer is turning** — set by its own tabs, by
 *     "See it in 3D" in any sheet.
 *
 * Lifting all three here is what lets a button in one section drive a canvas in
 * another; nothing else on the page needs to know.
 *
 * ── Surfaces ────────────────────────────────────────────────────────
 * Reading down: film → page ground → white → **black** → white → ground →
 * **black** → ground → white → **black** → ground → white → ground. No two
 * adjacent sections share a background, per `AGENTS.md`, and the three dark acts
 * are the three that are pictures rather than prose: the LiDAR cloud, the
 * battery chip, and the floors it all runs on.
 *
 * ── `data-hero-tone` ────────────────────────────────────────────────
 * Set to `light`, as on `/hardware/omnibox`: the page ground is `#F5F5F7` and
 * the film's first chapter sits on it, so the navbar must keep its dark links
 * rather than going transparent-over-white. It goes dark only mid-film, under
 * the LiDAR chapter, which the navbar does not track. See `layout/Header.tsx`.
 */
export function SstPage() {
  const [openKey, setOpenKey] = useState<SheetKey | null>(null);
  const [pushed, setPushed] = useState(false);
  const [noFilm, setNoFilm] = useState(false);
  const [lidarMode, setLidarMode] = useState<LidarMode>("position");
  const [hwDevice, setHwDevice] = useState<DevKey>("access");

  const filmUnavailable = useCallback(() => setNoFilm(true), []);

  const sync = useCallback(() => {
    const m = /^#ss-([a-z]+)$/.exec(window.location.hash);
    const key = m && SHEETS.some((s) => s.key === m[1]) ? (m[1] as SheetKey) : null;
    setOpenKey(key);
    if (!key) setPushed(false);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("hashchange", sync);
    };
  }, [sync]);

  const open = useCallback((key: SheetKey) => {
    setPushed(true);
    window.location.hash = "ss-" + key;
  }, []);

  const close = useCallback(() => {
    if (pushed) {
      setPushed(false);
      window.history.back();
      return;
    }
    try {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch {
      window.location.hash = "";
    }
    setOpenKey(null);
  }, [pushed]);

  /** Scroll to a section, after the frame in which a sheet has closed. */
  const goto = useCallback((id: string) => {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const showLidar = useCallback(
    (m: LidarMode) => {
      setLidarMode(m);
      goto("lidar");
    },
    [goto],
  );

  const showHw = useCallback(
    (k: DevKey) => {
      setHwDevice(k);
      goto("hardware");
    },
    [goto],
  );

  return (
    // The page ground is #F5F5F7, so the site navbar must not go transparent
    // over it — see `layout/Header.tsx`.
    <div className={"hw-page sst-page" + (noFilm ? " no-film" : "")} data-hero-tone="light">
      <SstFilm onUnavailable={filmUnavailable} />
      <SstHero />

      <div className="hw-doc">
        <SstProblem />
        <SstSensors onOpen={open} onLidar={showLidar} />
        <SstLidar mode={lidarMode} onMode={setLidarMode} />
        <SstAccess />
        <SstPallet />
        <SstBattery />
        <SstHardware active={hwDevice} onActive={setHwDevice} onOpen={open} onLidar={showLidar} />
        <SstCompare />
        <SstWhere />
        <SstWorks />
        <SstFAQ />
        <SstCTA />
      </div>

      {SHEETS.map((s) => (
        <SstSheet
          key={s.key}
          sheet={s}
          open={openKey === s.key}
          onClose={close}
          onHw={showHw}
          onLidar={showLidar}
          onGoto={goto}
        />
      ))}
    </div>
  );
}
