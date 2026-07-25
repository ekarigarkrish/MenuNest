"use client";

import { useEffect } from "react";
import { useRestaurantBranding } from "@/hooks/useRestaurantBranding";

export default function GlobalFavicon() {
  const { branding } = useRestaurantBranding();

  useEffect(() => {
    if (!branding) return;

    // Update page title
    document.title = branding.name;

    // Update favicon
    let link = document.querySelector<HTMLLinkElement>(
      "link[rel='icon']"
    );

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    // Prevent browser favicon cache
    link.href = `${branding.logo}?v=${Date.now()}`;
  }, [branding]);

  return null;
}