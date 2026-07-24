"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Theme Definitions ────────────────────────────────────────────────────────

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  /** Swatch color shown in the picker (primary-500 equivalent) */
  swatch: string;
  /** Gradient preview for the swatch card */
  gradient: string;
  /** CSS variable overrides that replace --color-cayenne-red-* */
  vars: Record<string, string>;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "cayenne-red",
    name: "Cayenne Red",
    description: "The bold, fiery default",
    swatch: "#fb6304",
    gradient: "linear-gradient(135deg, #fb6304 0%, #fda168 100%)",
    vars: {
      "--color-cayenne-red-50": "#ffefe6",
      "--color-cayenne-red-100": "#fee0cd",
      "--color-cayenne-red-200": "#fdc09b",
      "--color-cayenne-red-300": "#fda168",
      "--color-cayenne-red-400": "#fc8236",
      "--color-cayenne-red-500": "#fb6304",
      "--color-cayenne-red-600": "#c94f03",
      "--color-cayenne-red-700": "#973b02",
      "--color-cayenne-red-800": "#642702",
      "--color-cayenne-red-900": "#321401",
      "--color-cayenne-red-950": "#230e01",
    },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Cool, trustworthy, crisp",
    swatch: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #67e8f9 100%)",
    vars: {
      "--color-cayenne-red-50": "#e0f6ff",
      "--color-cayenne-red-100": "#b9ecff",
      "--color-cayenne-red-200": "#7ddcff",
      "--color-cayenne-red-300": "#3dcbff",
      "--color-cayenne-red-400": "#18b8f5",
      "--color-cayenne-red-500": "#0ea5e9",
      "--color-cayenne-red-600": "#0284c7",
      "--color-cayenne-red-700": "#0369a1",
      "--color-cayenne-red-800": "#075985",
      "--color-cayenne-red-900": "#0c4a6e",
      "--color-cayenne-red-950": "#082f49",
    },
  },
  {
    id: "forest-green",
    name: "Forest Green",
    description: "Fresh, natural, vibrant",
    swatch: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e 0%, #86efac 100%)",
    vars: {
      "--color-cayenne-red-50": "#f0fdf4",
      "--color-cayenne-red-100": "#dcfce7",
      "--color-cayenne-red-200": "#bbf7d0",
      "--color-cayenne-red-300": "#86efac",
      "--color-cayenne-red-400": "#4ade80",
      "--color-cayenne-red-500": "#22c55e",
      "--color-cayenne-red-600": "#16a34a",
      "--color-cayenne-red-700": "#15803d",
      "--color-cayenne-red-800": "#166534",
      "--color-cayenne-red-900": "#14532d",
      "--color-cayenne-red-950": "#052e16",
    },
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    description: "Elegant, premium, luxurious",
    swatch: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 100%)",
    vars: {
      "--color-cayenne-red-50": "#f5f3ff",
      "--color-cayenne-red-100": "#ede9fe",
      "--color-cayenne-red-200": "#ddd6fe",
      "--color-cayenne-red-300": "#c4b5fd",
      "--color-cayenne-red-400": "#a78bfa",
      "--color-cayenne-red-500": "#8b5cf6",
      "--color-cayenne-red-600": "#7c3aed",
      "--color-cayenne-red-700": "#6d28d9",
      "--color-cayenne-red-800": "#5b21b6",
      "--color-cayenne-red-900": "#4c1d95",
      "--color-cayenne-red-950": "#2e1065",
    },
  },
  {
    id: "rose-pink",
    name: "Rose Pink",
    description: "Playful, lively, welcoming",
    swatch: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #fda4af 100%)",
    vars: {
      "--color-cayenne-red-50": "#fff1f2",
      "--color-cayenne-red-100": "#ffe4e6",
      "--color-cayenne-red-200": "#fecdd3",
      "--color-cayenne-red-300": "#fda4af",
      "--color-cayenne-red-400": "#fb7185",
      "--color-cayenne-red-500": "#f43f5e",
      "--color-cayenne-red-600": "#e11d48",
      "--color-cayenne-red-700": "#be123c",
      "--color-cayenne-red-800": "#9f1239",
      "--color-cayenne-red-900": "#881337",
      "--color-cayenne-red-950": "#4c0519",
    },
  },
  {
    id: "teal",
    name: "Teal",
    description: "Sophisticated, modern, calm",
    swatch: "#14b8a6",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #5eead4 100%)",
    vars: {
      "--color-cayenne-red-50": "#f0fdfa",
      "--color-cayenne-red-100": "#ccfbf1",
      "--color-cayenne-red-200": "#99f6e4",
      "--color-cayenne-red-300": "#5eead4",
      "--color-cayenne-red-400": "#2dd4bf",
      "--color-cayenne-red-500": "#14b8a6",
      "--color-cayenne-red-600": "#0d9488",
      "--color-cayenne-red-700": "#0f766e",
      "--color-cayenne-red-800": "#115e59",
      "--color-cayenne-red-900": "#134e4a",
      "--color-cayenne-red-950": "#042f2e",
    },
  },
  {
    id: "slate",
    name: "Midnight Slate",
    description: "Minimal, refined, professional",
    swatch: "#475569",
    gradient: "linear-gradient(135deg, #475569 0%, #94a3b8 100%)",
    vars: {
      "--color-cayenne-red-50": "#f8fafc",
      "--color-cayenne-red-100": "#f1f5f9",
      "--color-cayenne-red-200": "#e2e8f0",
      "--color-cayenne-red-300": "#cbd5e1",
      "--color-cayenne-red-400": "#94a3b8",
      "--color-cayenne-red-500": "#475569",
      "--color-cayenne-red-600": "#334155",
      "--color-cayenne-red-700": "#1e293b",
      "--color-cayenne-red-800": "#0f172a",
      "--color-cayenne-red-900": "#020617",
      "--color-cayenne-red-950": "#000000",
    },
  },
  {
    id: "wine-red",
    name: "Wine Red",
    description: "Fine dining, deep, rich",
    swatch: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626 0%, #fca5a5 100%)",
    vars: {
      "--color-cayenne-red-50": "#fef2f2",
      "--color-cayenne-red-100": "#fee2e2",
      "--color-cayenne-red-200": "#fecaca",
      "--color-cayenne-red-300": "#fca5a5",
      "--color-cayenne-red-400": "#f87171",
      "--color-cayenne-red-500": "#ef4444",
      "--color-cayenne-red-600": "#dc2626",
      "--color-cayenne-red-700": "#b91c1c",
      "--color-cayenne-red-800": "#991b1b",
      "--color-cayenne-red-900": "#7f1d1d",
      "--color-cayenne-red-950": "#450a0a",
    },
  },
  {
    id: "coffee-brown",
    name: "Coffee Brown",
    description: "Cozy, cafe, bakery",
    swatch: "#a26b4e",
    gradient: "linear-gradient(135deg, #a26b4e 0%, #dcc4b6 100%)",
    vars: {
      "--color-cayenne-red-50": "#faf7f5",
      "--color-cayenne-red-100": "#f5ece5",
      "--color-cayenne-red-200": "#eaddd3",
      "--color-cayenne-red-300": "#dcc4b6",
      "--color-cayenne-red-400": "#c9a792",
      "--color-cayenne-red-500": "#b5866b",
      "--color-cayenne-red-600": "#a26b4e",
      "--color-cayenne-red-700": "#87543c",
      "--color-cayenne-red-800": "#714634",
      "--color-cayenne-red-900": "#5c3b2d",
      "--color-cayenne-red-950": "#331f16",
    },
  },
];

export const DEFAULT_THEME_ID = "cayenne-red";
const LS_KEY = "site_color_theme";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyTheme(id: string) {
  // "cayenne-red" is the CSS default; remove the attribute to restore it
  if (id === DEFAULT_THEME_ID) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", id);
  }
}

function getThemeById(id: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useColorTheme
 *
 * Manages the site-wide color theme preference.
 * - Reads from localStorage on first render
 * - Applies CSS variable overrides to document.documentElement
 * - Exposes setTheme() to change + persist the selection
 */
export function useColorTheme() {
  const [themeId, setThemeIdState] = useState<string>(DEFAULT_THEME_ID);

  // Bootstrap from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      const id = saved ?? DEFAULT_THEME_ID;
      setThemeIdState(id);
      applyTheme(id);
    } catch {
      applyTheme(DEFAULT_THEME_ID);
    }
  }, []);

  const setTheme = useCallback((id: string) => {
    setThemeIdState(id);
    applyTheme(id);
    try {
      localStorage.setItem(LS_KEY, id);
    } catch {}
  }, []);

  const currentTheme = getThemeById(themeId);

  return { themeId, currentTheme, setTheme, themes: COLOR_THEMES };
}
