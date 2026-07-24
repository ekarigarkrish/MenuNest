"use client";

import { useSocket } from "@/hooks/useSocket";

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  // Call the hook so the socket connection initializes when this provider mounts
  useSocket();

  return <>{children}</>;
}