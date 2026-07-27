"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
    label: string;
    value: string;
    subLabel?: string;
    subValue?: string;
    icon: React.ReactNode;
    iconBg: string;
    trend?: "up" | "down" | "neutral";
    trendLabel?: string;
    delay?: number;
}

export default function KpiCard({
    label,
    value,
    subLabel,
    subValue,
    icon,
    iconBg,
    trend,
    trendLabel,
    delay = 0,
}: KpiCardProps) {
    const TrendIcon =
        trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

    const trendColor =
        trend === "up"
            ? "text-emerald-600 bg-emerald-50"
            : trend === "down"
            ? "text-red-500 bg-red-50"
            : "text-gray-500 bg-gray-100";

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200 group"
        >
            {/* Top row: icon + trend badge */}
            <div className="flex items-start justify-between">
                <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
                >
                    {icon}
                </div>
                {trend && trendLabel && (
                    <span
                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendColor}`}
                    >
                        <TrendIcon className="w-3 h-3" />
                        {trendLabel}
                    </span>
                )}
            </div>

            {/* Value + Label */}
            <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-gray-900 font-heading tracking-tight leading-none">
                    {value}
                </span>
                <span className="text-sm font-medium text-gray-500">{label}</span>
            </div>

            {/* Sub value (e.g. "today") */}
            {subLabel && subValue && (
                <div className="flex items-center gap-1.5 pt-1 border-t border-gray-50">
                    <span className="text-xs text-gray-400">{subLabel}:</span>
                    <span className="text-xs font-semibold text-gray-600">
                        {subValue}
                    </span>
                </div>
            )}
        </motion.div>
    );
}