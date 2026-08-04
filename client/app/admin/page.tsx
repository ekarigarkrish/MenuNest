"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ShoppingBag,
    IndianRupee,
    Users,
    TrendingUp,
    RefreshCw,
    AlertCircle,
    Loader2,
    PlusCircle,
    FileText,
    Settings,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { useAnalytics } from "@/hooks/useAnalytics";
import KpiCard from "./_components/dashboard/KpiCard";
import Button from "@/components/ui/Button";
import { storage } from "@/lib/storage";

const quickLinks = [
    {
        title: "Manage Menu",
        desc: "Update items & pricing",
        href: "/admin/menu",
        icon: <FileText className="w-5 h-5 text-white drop-shadow-sm" />,
        iconWrapper: "bg-linear-to-br from-indigo-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 border border-white/20"
    },
    {
        title: "Manage Live Orders",
        desc: "Order management",
        href: "/admin/order-management",
        icon: <PlusCircle className="w-5 h-5 text-white drop-shadow-sm" />,
        iconWrapper: "bg-linear-to-br from-orange-500 via-amber-500 to-yellow-500 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 border border-white/20"
    },
    {
        title: "System Settings",
        desc: "App configuration",
        href: "/admin/settings/general",
        icon: <Settings className="w-5 h-5 text-white drop-shadow-sm" />,
        iconWrapper: "bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 border border-white/20"
    }
]

/** Format number as Indian Rupee shorthand */
function formatINR(n: number) {
    if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}k`;
    return `₹${n.toFixed(0)}`;
}

export default function AdminDashboardPage() {
    const { data, isLoading, isError, error, refetch, isFetching } = useAnalytics();

    // ── Skeleton loader ─────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <Container>
                <Section className="py-8 md:py-12">
                    <div className="flex flex-col gap-6">
                        {/* Header skeleton */}
                        <div className="flex flex-col gap-1.5">
                            <div className="h-8 w-56 bg-gray-100 rounded-xl animate-pulse" />
                            <div className="h-4 w-72 bg-gray-100 rounded-lg animate-pulse" />
                        </div>

                        {/* KPI cards skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-100 rounded-2xl h-36 animate-pulse"
                                />
                            ))}
                        </div>

                        {/* Chart + status skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 bg-gray-100 rounded-2xl h-52 animate-pulse" />
                            <div className="bg-gray-100 rounded-2xl h-52 animate-pulse" />
                        </div>

                        {/* Tables skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 bg-gray-100 rounded-2xl h-64 animate-pulse" />
                            <div className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
                        </div>
                    </div>
                </Section>
            </Container>
        );
    }

    // ── Error state ──────────────────────────────────────────────────────────
    if (isError) {
        return (
            <Container>
                <Section className="py-8 md:py-12">
                    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertCircle className="w-7 h-7 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Failed to load analytics
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {(error as Error)?.message || "Unknown error occurred."}
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={() => refetch()}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-cayenne-red-500 text-white rounded-xl hover:bg-cayenne-red-600 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </Button>
                    </div>
                </Section>
            </Container>
        );
    }

    const { allTime, today, customers } = data!;
    const user = storage.localStorage.get('user')

    return (
        <Container>
            <Section className="py-8 md:py-10">
                <div className="flex flex-col gap-6">

                    {/* ── Welcome Banner ────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-xl flex items-center"
                    >
                        {/* Background Image with Overlay */}
                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-1000 hover:scale-105"
                            style={{ backgroundImage: "url('/images/bg-burger.avif')" }}
                        />
                        <div className="absolute inset-0 z-10 bg-linear-to-r from-gray-900/90 via-gray-900/60 to-transparent" />

                        {/* Content */}
                        <div className="relative z-20 p-6 md:p-10 lg:p-12 max-w-2xl">
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-white mb-3 tracking-tight"
                            >
                                Welcome back, {user.name || 'Admin'}! <span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="text-gray-200 text-sm md:text-base lg:text-lg font-medium leading-relaxed"
                            >
                                Ready for another busy day? Track your revenue, manage orders, and watch your restaurant grow in real-time.
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* ── Page Header ───────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="flex items-start justify-between gap-4 mt-2"
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 tracking-tight">
                                Dashboard Overview
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm">
                                Real-time analytics for your restaurant.
                            </p>
                        </div>

                        {/* Refresh indicator */}
                        <Button
                            variant="primary"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            title="Refresh data"
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition-colors disabled:opacity-50 mt-1 shrink-0"
                        >
                            <RefreshCw
                                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </Button>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* ── KPI Cards ─────────────────────────────────────────── */}
                        <div className="grid col-span-2 grid-cols-2 gap-4">
                            <KpiCard
                                delay={0}
                                label="Total Orders"
                                value={allTime.totalOrders.toLocaleString("en-IN")}
                                subLabel="Today"
                                subValue={today.totalOrders.toString()}
                                icon={<ShoppingBag className="w-5 h-5 text-cayenne-red-600" />}
                                iconBg="bg-cayenne-red-50"
                                trend={today.totalOrders > 0 ? "up" : "neutral"}
                                trendLabel={today.totalOrders > 0 ? `+${today.totalOrders} today` : "0 today"}
                            />

                            <KpiCard
                                delay={0.08}
                                label="Total Revenue"
                                value={formatINR(allTime.totalRevenue)}
                                subLabel="Today"
                                subValue={formatINR(today.totalRevenue)}
                                icon={<IndianRupee className="w-5 h-5 text-emerald-600" />}
                                iconBg="bg-emerald-50"
                                trend={today.totalRevenue > 0 ? "up" : "neutral"}
                                trendLabel={today.totalRevenue > 0 ? `+${formatINR(today.totalRevenue)}` : "₹0 today"}
                            />

                            <KpiCard
                                delay={0.16}
                                label="Total Customers"
                                value={customers.total.toLocaleString("en-IN")}
                                subLabel="New today"
                                subValue={customers.newToday.toString()}
                                icon={<Users className="w-5 h-5 text-indigo-600" />}
                                iconBg="bg-indigo-50"
                                trend={customers.newToday > 0 ? "up" : "neutral"}
                                trendLabel={customers.newToday > 0 ? `+${customers.newToday} new` : "No new"}
                            />

                            <KpiCard
                                delay={0.24}
                                label="Avg Order Value"
                                value={formatINR(allTime.avgOrderValue)}
                                subLabel="Total orders"
                                subValue={allTime.totalOrders.toString()}
                                icon={<TrendingUp className="w-5 h-5 text-violet-600" />}
                                iconBg="bg-violet-50"
                                trend="neutral"
                            />
                        </div>

                        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold text-gray-900 font-heading">
                                    Quick Links
                                </h3>
                            </div>

                            <div className="flex flex-col gap-3 flex-1 justify-center">
                                {quickLinks.map((link: any, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={link.href}
                                        className="group flex items-center p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-300 border border-transparent hover:border-gray-100 hover:shadow-xs"
                                    >
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-3 ${link.iconWrapper}`}>
                                            {link.icon}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-cayenne-red-600 transition-colors">
                                                {link.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {link.desc}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </Container>
    );
}