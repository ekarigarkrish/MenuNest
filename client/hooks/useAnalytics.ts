"use client";

import { useQuery } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";

export interface AnalyticsSummary {
    allTime: {
        totalOrders: number;
        totalRevenue: number;
        avgOrderValue: number;
    };
    today: {
        totalOrders: number;
        totalRevenue: number;
    };
    customers: {
        total: number;
        newToday: number;
    };
}

export function useAnalytics() {
    return useQuery<AnalyticsSummary>({
        queryKey: ["analytics-summary"],
        queryFn: async () => {
            const res = await Fetch.get("/api/analytics/summary", {
                withCredentials: true,
                withXSRFToken: true,
            });
            if (res.data.success) return res.data.data;
            throw new Error(res.data.message || "Failed to fetch analytics");
        },
        staleTime: 60_000,   // 60s — data is fairly stable
        refetchInterval: 120_000, // Auto-refresh every 2 minutes
    });
}