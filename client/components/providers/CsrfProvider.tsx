"use client";

import { useEffect, useRef } from "react";
import { Fetch } from "@/config/axios.config";

export default function CsrfProvider({ children }: { children: React.ReactNode }) {
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const hasCsrfToken = document.cookie.includes("csrf-token=") || document.cookie.includes("x-csrf-token=");

    if (!hasCsrfToken) {
      Fetch.get("/api/auth/get/csrf-token").catch((err) => {
        console.error("Failed to fetch CSRF token:", err);
      });
    }
  }, []);

  return <>{children}</>;
}
