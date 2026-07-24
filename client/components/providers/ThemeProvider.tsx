"use client";

import { useEffect } from "react";
import { DEFAULT_THEME_ID } from "@/hooks/useColorTheme";

/**
 * ThemeProvider
 *
 * Bootstraps the saved color theme from localStorage before first paint
 * to prevent a flash of un-themed colors. Should be placed high in the
 * component tree (root layout).
 *
 * Uses data-theme attribute on <html> — CSS selectors in globals.css
 * handle all the variable overrides, keeping this provider very lean.
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem("site_color_theme") ?? DEFAULT_THEME_ID;
      if (saved && saved !== DEFAULT_THEME_ID) {
        document.documentElement.setAttribute("data-theme", saved);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    } catch {}
  }, []);

  return <>{children}</>;
}
