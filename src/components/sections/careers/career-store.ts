"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * What the careers page remembers, on this device only.
 *
 * Saved jobs and the last application's details live in `localStorage` — no
 * account and nothing on a server. Every read and write is wrapped, because
 * storage can be unavailable (private windows, blocked site data) and the page
 * must still work without it: saving simply does not persist then.
 *
 * The resume file is never stored. "Use my last application" refills the
 * text fields; the candidate attaches the file again.
 */

const SAVED_KEY = "rams.careers.saved";
const LAST_KEY = "rams.careers.lastApplication";

export type ApplicantDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  note: string;
};

export const EMPTY_DETAILS: ApplicantDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  portfolio: "",
  note: "",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the page works without it */
  }
}

/* Saved jobs are read with `useSyncExternalStore`, the way
   `search-version` reads its setting: the server snapshot is "nothing saved",
   the client's is what the browser holds, and writes notify this tab too
   (`storage` only fires in other tabs). The snapshot is the raw string so it
   stays referentially stable between reads. */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function savedSnapshot(): string {
  try {
    return window.localStorage.getItem(SAVED_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function useSavedJobs() {
  const raw = useSyncExternalStore(subscribe, savedSnapshot, () => "[]");
  const saved = useMemo<string[]>(() => {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }, [raw]);

  const toggle = useCallback(
    (id: string) => {
      const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
      write(SAVED_KEY, next);
      listeners.forEach((l) => l());
    },
    [saved],
  );

  return { saved, toggle, isSaved: (id: string) => saved.includes(id) };
}

export function readLastApplication(): ApplicantDetails | null {
  if (typeof window === "undefined") return null;
  const last = read<ApplicantDetails | null>(LAST_KEY, null);
  return last && last.email ? { ...EMPTY_DETAILS, ...last } : null;
}

export function saveLastApplication(details: ApplicantDetails) {
  write(LAST_KEY, details);
}
