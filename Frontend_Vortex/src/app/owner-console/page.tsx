"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type SessionState = "loading" | "authenticated" | "anonymous";

type Product = {
  id: string;
  name: string;
  lane: string;
  status: string;
  date: string | null;
  description: string;
  link: string | null;
  sortOrder: number;
};

type ProductDraft = {
  description: string;
  link: string;
  sortOrder: number;
  status: string;
  lane: string;
};

const STATUSES = ["LIVE", "IN_DEVELOPMENT", "PLANNED", "CONCEPT"];
const LANES = ["ACCOUNTING", "AUTOMATION", "SOCIAL", "ECOMMERCE", "GAMES"];

export default function OwnerConsolePage() {
  const [state, setState] = useState<SessionState>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productErrors, setProductErrors] = useState<Record<string, string>>({});
  const [productDrafts, setProductDrafts] = useState<Record<string, ProductDraft>>({});
  const [productSaved, setProductSaved] = useState<Record<string, boolean>>({});
  const [pageMessage, setPageMessage] = useState<string | null>(null);

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

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setPageMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPageMessage(data.error ?? "failed to load products");
        setProducts([]);
        return;
      }
      const data = await res.json();
      const items: Product[] = data.products ?? [];
      setProducts(items);
      setProductDrafts(
        items.reduce((acc, product) => {
          acc[product.id] = {
            description: product.description,
            link: product.link ?? "",
            sortOrder: product.sortOrder,
            status: product.status,
            lane: product.lane,
          };
          return acc;
        }, {} as Record<string, ProductDraft>)
      );
    } catch {
      setPageMessage("backend unreachable");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (state === "authenticated") {
      loadProducts();
    }
  }, [state, loadProducts]);

  const handleFieldChange = (productId: string, field: keyof ProductDraft, value: string | number) => {
    setProductDrafts((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value,
      },
    }));
  };

  const saveProduct = async (productId: string) => {
    const draft = productDrafts[productId];
    if (!draft) return;
    setBusy(true);
    setProductErrors((current) => ({ ...current, [productId]: "" }));
    setProductSaved((current) => ({ ...current, [productId]: false }));

    try {
      const res = await fetch(`${API_URL}/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          description: draft.description,
          link: draft.link,
          sortOrder: draft.sortOrder,
          status: draft.status,
          lane: draft.lane,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setProductErrors((current) => ({
          ...current,
          [productId]: data.error ?? "failed to save",
        }));
        return;
      }
      const data = await res.json();
      setProducts((current) =>
        current?.map((product) =>
          product.id === productId ? { ...product, ...data.product } : product
        ) ?? null
      );
      setProductSaved((current) => ({ ...current, [productId]: true }));
    } catch {
      setProductErrors((current) => ({
        ...current,
        [productId]: "backend unreachable",
      }));
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
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1e3a5f]">Owner console</h1>
              <p className="mt-1 font-mono text-xs text-[#0d9488]">authenticated · session active</p>
            </div>
            <button onClick={logout} disabled={busy}
              className="rounded-md border border-[#1e3a5f]/15 px-3 py-1.5 text-sm text-[#1e3a5f] hover:border-[#0d9488]">
              Log out
            </button>
          </div>

          <section className="rounded-3xl border border-[#1e3a5f]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#1e3a5f]">Products editor</h2>
                <p className="mt-1 text-sm text-[#1e3a5f]/70">Edit descriptions, links, order, status, and lane for owner products.</p>
              </div>
              <div className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#166534]">
                phase 5A-2
              </div>
            </div>
            {pageMessage && (
              <p className="mt-4 rounded-xl bg-[#fee2e2] px-4 py-3 text-sm text-[#b91c1c]">{pageMessage}</p>
            )}
            {loadingProducts && (
              <p className="mt-4 font-mono text-sm text-[#1e3a5f]">loading products…</p>
            )}
            {!loadingProducts && products?.length === 0 && (
              <p className="mt-4 text-sm text-[#475569]">No products found. Seed the database or add products via Prisma.</p>
            )}
            <div className="mt-6 space-y-4">
              {products?.map((product) => {
                const draft = productDrafts[product.id];
                return (
                  <div key={product.id} className="rounded-2xl border border-[#1e3a5f]/10 bg-[#f8fafc] p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">{product.name}</p>
                        <p className="text-sm text-[#475569]">{product.lane} · {product.status}</p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#0d9488]">sort order {product.sortOrder}</p>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm text-[#0f172a]">
                        Description
                        <textarea
                          value={draft?.description ?? product.description}
                          onChange={(e) => handleFieldChange(product.id, "description", e.target.value)}
                          className="mt-2 h-24 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#0d9488]"
                        />
                      </label>
                      <label className="block text-sm text-[#0f172a]">
                        Link
                        <input
                          value={draft?.link ?? product.link ?? ""}
                          onChange={(e) => handleFieldChange(product.id, "link", e.target.value)}
                          className="mt-2 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#0d9488]"
                          placeholder="https://example.com"
                        />
                      </label>
                      <label className="block text-sm text-[#0f172a]">
                        Status
                        <select
                          value={draft?.status ?? product.status}
                          onChange={(e) => handleFieldChange(product.id, "status", e.target.value)}
                          className="mt-2 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#0d9488]"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm text-[#0f172a]">
                        Lane
                        <select
                          value={draft?.lane ?? product.lane}
                          onChange={(e) => handleFieldChange(product.id, "lane", e.target.value)}
                          className="mt-2 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#0d9488]"
                        >
                          {LANES.map((lane) => (
                            <option key={lane} value={lane}>{lane}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="block text-sm text-[#0f172a] sm:max-w-xs">
                        Sort order
                        <input
                          type="number"
                          value={draft?.sortOrder ?? product.sortOrder}
                          onChange={(e) => handleFieldChange(product.id, "sortOrder", Number(e.target.value))}
                          className="mt-2 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#0d9488]"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => saveProduct(product.id)}
                        disabled={busy}
                        className="rounded-xl bg-[#0d9488] px-4 py-2 text-sm font-medium text-white hover:bg-[#115e59] disabled:opacity-50"
                      >
                        {busy ? "Saving…" : "Save product"}
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      {productErrors[product.id] && (
                        <p className="rounded-xl bg-[#fee2e2] px-3 py-2 text-[#b91c1c]">{productErrors[product.id]}</p>
                      )}
                      {productSaved[product.id] && (
                        <p className="rounded-xl bg-[#dcfce7] px-3 py-2 text-[#166534]">Saved.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {["Changelog", "Site config", "Media"].map((m) => (
              <div key={m} className="rounded-xl border border-[#1e3a5f]/10 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-medium text-[#1e3a5f]">{m}</h2>
                <p className="mt-1 font-mono text-xs text-[#1e3a5f]/50">arrives in later phase 5 work</p>
              </div>
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
