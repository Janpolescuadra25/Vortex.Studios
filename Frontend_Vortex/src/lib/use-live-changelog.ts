"use client";

import { useEffect, useState } from "react";
import { CHANGELOG, type ChangelogKind } from "./vortex-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type DbEntry = {
  id: string;
  type: string;
  date: string;
  title: string;
  body: string;
  published: boolean;
};

type LiveEntry = {
  id: string;
  kind: ChangelogKind;
  title: string;
  date: string;
  body: string;
  version?: string;
};

const TYPE_MAP: Record<string, ChangelogKind> = {
  LAUNCH: "launch",
  UPDATE: "update",
  ANNOUNCEMENT: "announcement",
  MILESTONE: "milestone",
};

function normalizeEntry(row: DbEntry): LiveEntry {
  const staticDefaults = CHANGELOG.find((c) => c.title === row.title);
  return {
    id: row.id,
    kind: TYPE_MAP[row.type] ?? "update",
    title: row.title,
    date: row.date,
    body: row.body,
    version: staticDefaults?.version,
  };
}

/**
 * Live changelog for the public What's New view. Fetches from the
 * Backend API, normalizes uppercase backend types to the frontend's
 * lowercase kinds, reverses the API's newest-first order to the
 * timeline's oldest-first contract, and merges static `version`
 * labels by title. Falls back to the built-in static CHANGELOG when
 * the API is unreachable — the timeline is never empty.
 */
export function useLiveChangelog() {
  const [entries, setEntries] = useState<LiveEntry[]>(CHANGELOG);
  const [source, setSource] = useState<"defaults" | "live">("defaults");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/changelog`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error(String(res.status)))
      )
      .then((data: { entries: DbEntry[] }) => {
        if (cancelled || !Array.isArray(data.entries) || data.entries.length === 0)
          return;
        const normalized = data.entries.map(normalizeEntry);
        normalized.reverse(); // API is newest-first; timeline is oldest-first
        setEntries(normalized);
        setSource("live");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return { entries, source };
}
