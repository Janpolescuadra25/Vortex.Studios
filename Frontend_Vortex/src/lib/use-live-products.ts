"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import {
  PRODUCTS,
  type Category,
  type Product,
  type ProductStatus,
} from "./vortex-data";

interface ProductWithLink extends Product {
  link?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const STATUS_MAP: Record<string, ProductStatus> = {
  LIVE: "live",
  IN_DEVELOPMENT: "development",
  PLANNED: "planned",
  CONCEPT: "concept",
};

const LANE_MAP: Record<string, Category> = {
  ACCOUNTING: "Accounting",
  AUTOMATION: "Automation",
  SOCIAL: "Social",
  ECOMMERCE: "E-Commerce",
  GAMES: "Games",
};

type DbProduct = {
  id: string;
  name: string;
  lane: string;
  status: string;
  date: string | null;
  description: string;
  link: string | null;
  sortOrder: number;
};

function mergeProduct(row: DbProduct): ProductWithLink {
  const defaults = PRODUCTS.find((p) => p.name === row.name);
  return {
    id: row.id,
    name: row.name,
    tagline: defaults?.tagline ?? "",
    description: row.description,
    category: LANE_MAP[row.lane] ?? "Automation",
    status: STATUS_MAP[row.status] ?? "planned",
    releasedAt: row.date ?? defaults?.releasedAt ?? new Date().toISOString(),
    eta: row.date ? undefined : defaults?.eta,
    icon: defaults?.icon ?? Zap,
    hue: defaults?.hue ?? ["#0d9488", "#10b981"],
    tags: defaults?.tags ?? [],
    link: row.link ?? undefined,
  };
}

/**
 * Live products for the public views. Fetches from the Backend API
 * and merges each row with the static presentation defaults (tagline,
 * icon, hue, tags, eta) keyed by product name. Falls back to the
 * built-in static lineup when the API is unreachable or returns
 * nothing — the stage is never empty.
 */
export function useLiveProducts() {
  const [products, setProducts] = useState<ProductWithLink[]>(PRODUCTS as ProductWithLink[]);
  const [source, setSource] = useState<"defaults" | "live">("defaults");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/products`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error(String(res.status)))
      )
      .then((data: { products: DbProduct[] }) => {
        if (cancelled || !Array.isArray(data.products) || data.products.length === 0)
          return;
        setProducts(data.products.map(mergeProduct));
        setSource("live");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, source };
}
