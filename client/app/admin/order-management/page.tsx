"use client";

import React, { useState } from "react";
import { Clock, ChefHat, BellRing, CheckCircle2, XCircle, Search } from "lucide-react";
import OrderColumn from "./_components/OrderColumn";
import Section from "@/components/ui/Section";
import { useLiveOrders } from "./_hooks/useLiveOrders";

/**
 * Reusable Stat Card Component
 */
type StatVariant = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

const statStyles: Record<StatVariant, { card: string, icon: string, title: string, count: string }> = {
  pending: {
    card: "bg-amber-50 border-amber-100",
    icon: "bg-amber-100 text-amber-600",
    title: "text-amber-800",
    count: "text-amber-900"
  },
  preparing: {
    card: "bg-indigo-50 border-indigo-100",
    icon: "bg-indigo-100 text-indigo-600",
    title: "text-indigo-800",
    count: "text-indigo-900"
  },
  ready: {
    card: "bg-emerald-50 border-emerald-100",
    icon: "bg-emerald-100 text-emerald-600",
    title: "text-emerald-800",
    count: "text-emerald-900"
  },
  served: {
    card: "bg-blue-50 border-blue-100",
    icon: "bg-blue-100 text-blue-600",
    title: "text-blue-800",
    count: "text-blue-900"
  },
  cancelled: {
    card: "bg-red-50 border-red-100",
    icon: "bg-red-100 text-red-600",
    title: "text-red-800",
    count: "text-red-900"
  }
};

function StatCard({ icon, title, count, variant }: { icon: React.ReactNode, title: string, count: number, variant: StatVariant }) {
  const styles = statStyles[variant];
  return (
    <div className={`rounded-lg p-3 border flex items-center gap-3 ${styles.card}`}>
      <div className={`p-2 rounded-md flex-shrink-0 ${styles.icon}`}>{icon}</div>
      <div>
        <p className={`text-xs font-medium uppercase tracking-wider ${styles.title}`}>{title}</p>
        <p className={`text-xl font-bold leading-none mt-1 ${styles.count}`}>{count}</p>
      </div>
    </div>
  );
}

export default function AdminOrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, status, isFetchingNextPage, targetRef, updateOrderStatus } = useLiveOrders();

  const filteredOrders = orders.filter((o) =>
    o.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = filteredOrders.filter((o) => o.status === "pending").length;
  const preparingCount = filteredOrders.filter((o) => ["accepted", "preparing"].includes(o.status)).length;
  const readyCount = filteredOrders.filter((o) => o.status === "ready").length;
  const servedCount = filteredOrders.filter((o) => o.status === "served").length;
  const cancelledCount = filteredOrders.filter((o) => o.status === "cancelled").length;

  return (
    <Section className="h-[calc(100vh-2rem)] flex flex-col pt-6 px-6">
      {/* Header and Stats */}
      <div className="mb-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 xl:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Live Order Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage and track restaurant orders in real-time</p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full xl:w-auto">
          {/* Search Bar */}
          <div className="relative w-full lg:w-64 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by table name..."
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-shadow bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <StatCard
            title="Pending"
            count={pendingCount}
            icon={<Clock className="w-5 h-5" />}
            variant="pending"
          />

          <StatCard
            title="Preparing"
            count={preparingCount}
            icon={<ChefHat className="w-5 h-5" />}
            variant="preparing"
          />

          <StatCard
            title="Ready"
            count={readyCount}
            icon={<BellRing className="w-5 h-5" />}
            variant="ready"
          />

          <StatCard
            title="Served"
            count={servedCount}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="served"
          />

            <StatCard
              title="Cancelled"
              count={cancelledCount}
              icon={<XCircle className="w-5 h-5" />}
              variant="cancelled"
            />
          </div>
        </div>
      </div>

      {/* Main Kanban Content */}
      {status === "pending" ? (
        <div className="flex justify-center items-center h-full">Loading orders...</div>
      ) : status === "error" ? (
        <div className="flex justify-center items-center h-full text-red-500">Error loading orders</div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 flex-1">
            <OrderColumn
              title="New Orders"
              status={["pending"]}
              orders={filteredOrders}
              onStatusChange={updateOrderStatus}
              icon={<Clock className="w-5 h-5" />}
              colorClass="text-amber-600 bg-amber-100/50 p-1.5 rounded-md"
            />
            <OrderColumn
              title="In Kitchen"
              status={["accepted", "preparing"]}
              orders={filteredOrders}
              onStatusChange={updateOrderStatus}
              icon={<ChefHat className="w-5 h-5" />}
              colorClass="text-indigo-600 bg-indigo-100/50 p-1.5 rounded-md"
            />
            <OrderColumn
              title="Ready to Serve"
              status={["ready"]}
              orders={filteredOrders}
              onStatusChange={updateOrderStatus}
              icon={<BellRing className="w-5 h-5" />}
              colorClass="text-emerald-600 bg-emerald-100/50 p-1.5 rounded-md"
            />
            <OrderColumn
              title="Served"
              status={["served"]}
              orders={filteredOrders}
              onStatusChange={updateOrderStatus}
              icon={<CheckCircle2 className="w-5 h-5" />}
              colorClass="text-blue-600 bg-blue-100/50 p-1.5 rounded-md"
            />
            <OrderColumn
              title="Cancelled"
              status={["cancelled"]}
              orders={filteredOrders}
              onStatusChange={updateOrderStatus}
              icon={<XCircle className="w-5 h-5" />}
              colorClass="text-red-600 bg-red-100/50 p-1.5 rounded-md"
            />
          </div>

          {/* Intersection Observer target for infinite scroll */}
          <div ref={targetRef} className="h-10 w-full mt-4 flex justify-center items-center">
            {isFetchingNextPage && <span className="text-gray-500">Loading more...</span>}
          </div>
        </div>
      )}
    </Section>
  );
}
