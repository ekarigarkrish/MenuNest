"use client";

import { useState, useEffect } from "react";
import { Fetch } from "@/config/axios.config";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RestaurantBranding {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

interface CachedBranding {
  data: RestaurantBranding;
  cachedAt: number; // unix ms
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_KEY = "restaurant_branding";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readCache(): RestaurantBranding | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;

    const cached: CachedBranding = JSON.parse(raw);
    const isExpired = Date.now() - cached.cachedAt > CACHE_TTL_MS;
    if (isExpired) {
      localStorage.removeItem(LS_KEY);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function writeCache(data: RestaurantBranding): void {
  try {
    const payload: CachedBranding = { data, cachedAt: Date.now() };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch {
    // Storage quota exceeded — silently skip caching
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useRestaurantBranding
 *
 * Fetches restaurant name + logo for public display (Navbar, landing page, etc.)
 *
 * Strategy:
 *  1. Immediately hydrate from localStorage (avoids layout shift)
 *  2. If cache is stale / missing, call GET /api/restaurant
 *  3. Persist fresh data back to localStorage for 1 hour
 */
export function useRestaurantBranding() {
  const [branding, setBranding] = useState<RestaurantBranding | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const cached = readCache();

    if (cached) {
      // Instant paint from cache
      setBranding(cached);
      setIsLoading(false);
      // Optionally still refresh in background if you want fresher data —
      // uncomment the block below. By default we trust the 1-hour cache.
      return;
    }

    // Cache miss — fetch from API
    (async () => {
      try {
        const res = await Fetch.get<{ success: boolean; restaurant: RestaurantBranding }>(
          "/api/restaurant"
        );
        if (!cancelled && res.data?.restaurant) {
          writeCache(res.data.restaurant);
          setBranding(res.data.restaurant);
        }
      } catch {
        // Network error — fail silently; branding will be null (fallback UI)
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { branding, isLoading };
}
