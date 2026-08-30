"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type SessionState = "loading" | "authenticated" | "anonymous";

export default function OwnerConsolePage() {
  const [state, setState] = useState<SessionState>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const probe = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/session`, { credentials: "include" });
      const data = await res.json();
      setState(data.authenticated ? "authenticated" : "anonymous");
    } catch {
      setState("anonymous");
    }
  }, []);

  useEffect(() => {
    probe();
  }, [probe]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setPassword("");
        setState("authenticated");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "login failed");
      }
    } catch {
      setError("backend unreachable");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
      setState("anonymous");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-[#fbfdfd] px-4">
      {state === "loading" && (
        <p className="font-mono text-sm text-[#1e3a5f]">checking session…</p>
      )}
      {state === "anonymous" && (
        <form onSubmit={login} className="w-full max-w-sm rounded-xl border border-[#1e3a5f]/10 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a5f]">Owner console</h1>
          <p className="mt-1 font-mono text-xs text-[#0d9488]">less friction · more momentum</p>
          <label className="mt-6 block text-sm text-[#1e3a5f]">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#1e3a5f]/15 px-3 py-2 text-sm outline-none focus:border-[#0d9488]" />
          <label className="mt-4 block text-sm text-[#1e3a5f]">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#1e3a5f]/15 px-3 py-2 text-sm outline-none focus:border-[#0d9488]" />
          {error && <p className="mt-3 font-mono text-xs text-red-600">{error}</p>}
          <button type="submit" disabled={busy}
            className="mt-6 w-full rounded-md bg-[#0d9488] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f766e] disabled:opacity-50">
            {busy ? "…" : "Enter"}
          </button>
        </form>
      )}
      {state === "authenticated" && (
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a5f]">Owner console</h1>
            <button onClick={logout} disabled={busy}
              className="rounded-md border border-[#1e3a5f]/15 px-3 py-1.5 text-sm text-[#1e3a5f] hover:border-[#0d9488]">
              Log out
            </button>
          </div>
          <p className="mt-1 font-mono text-xs text-[#0d9488]">authenticated · session active</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Products", "Changelog", "Site config", "Media"].map((m) => (
              <div key={m} className="rounded-xl border border-[#1e3a5f]/10 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-medium text-[#1e3a5f]">{m}</h2>
                <p className="mt-1 font-mono text-xs text-[#1e3a5f]/50">arrives in phase 5</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
