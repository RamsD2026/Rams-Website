"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Which search design is live.
 *
 * Same idea as `useNavVersion`, with its own key, so the two can be compared
 * independently — someone trying search designs should not have to change the
 * navigation to do it. Stored per browser; each panel carries the control
 * that flips it.
 *
 * `v1` — the white panel that drops from under the header.
 * `v2` — the full-screen dark takeover.
 *
 * ── Why `useSyncExternalStore` and not an effect ────────────────────
 * localStorage is state React does not own, and the server cannot read it.
 * Reading it in an effect and calling `setState` costs a second render on
 * every mount and is what the `set-state-in-effect` rule exists to stop.
 * This subscribes instead: the server snapshot is always `v1`, the client
 * snapshot is whatever the browser has stored, and React reconciles the two
 * without a hydration mismatch.
 *
 * `storage` only fires in *other* tabs, so writes also notify this one
 * through `listeners`.
 */

export type SearchVersion = "v1" | "v2";

const STORAGE_KEY = "rams-search-version";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): SearchVersion {
  try {
    return localStorage.getItem(STORAGE_KEY) === "v2" ? "v2" : "v1";
  } catch {
    return "v1";
  }
}

/** No storage on the server, and the shipped design is the one it renders. */
const getServerSnapshot = (): SearchVersion => "v1";

export function useSearchVersion(): [SearchVersion, (v: SearchVersion) => void] {
  const version = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setVersion = useCallback((v: SearchVersion) => {
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      // Private browsing: the choice holds for this render pass only.
    }
    listeners.forEach((l) => l());
  }, []);

  return [version, setVersion];
}
