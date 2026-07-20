"use client";

import React, { useState } from "react";
import { Clock, ChefHat, BellRing } from "lucide-react";
import OrderColumn from "./_components/OrderColumn";
import { Order, OrderStatus } from "./_components/OrderCard";
import Section from "@/components/ui/Section";

// Mock Data
const MOCK_ORDERS: Order[] = [
  {
    id: "ord-001",
    tableId: "t-1",
    tableName: "Table 4",
    status: "pending",
    items: [
      { id: "i-1", name: "Butter Chicken", quantity: 1, price: 350 },
      { id: "i-2", name: "Garlic Naan", quantity: 3, price: 45 },
    ],
    totalAmount: 485,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
  },
  {
    id: "ord-002",
    tableId: "t-2",
    tableName: "Table 2",
    status: "accepted",
    items: [
      { id: "i-3", name: "Paneer Tikka", quantity: 2, price: 280 },
    ],
    totalAmount: 560,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "ord-003",
    tableId: "t-3",
    tableName: "Table 7",
    status: "preparing",
    items: [
      { id: "i-4", name: "Veg Biryani", quantity: 1, price: 220 },
      { id: "i-5", name: "Raita", quantity: 1, price: 50 },
    ],
    totalAmount: 270,
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: "ord-004",
    tableId: "t-4",
    tableName: "Table 1",
    status: "ready",
    items: [
      { id: "i-6", name: "Masala Dosa", quantity: 2, price: 120 },
      { id: "i-7", name: "Filter Coffee", quantity: 2, price: 40 },
    ],
    totalAmount: 320,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  }
];

export default function AdminOrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <Section className="h-[calc(100vh-2rem)] flex flex-col pt-6 px-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Live Order Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage and track restaurant orders in real-time</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-amber-800 font-medium uppercase tracking-wider">Pending</p>
              <p className="text-xl font-bold text-amber-900 leading-none mt-1">
                {orders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-md">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-indigo-800 font-medium uppercase tracking-wider">Preparing</p>
              <p className="text-xl font-bold text-indigo-900 leading-none mt-1">
                {orders.filter(o => ['accepted', 'preparing'].includes(o.status)).length}
              </p>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-800 font-medium uppercase tracking-wider">Ready</p>
              <p className="text-xl font-bold text-emerald-900 leading-none mt-1">
                {orders.filter(o => o.status === 'ready').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0 pb-6">
        <OrderColumn
          title="New Orders"
          status={['pending']}
          orders={orders}
          onStatusChange={handleStatusChange}
          icon={<Clock className="w-5 h-5" />}
          colorClass="text-amber-600 bg-amber-100/50 p-1.5 rounded-md"
        />
        <OrderColumn
          title="In Kitchen"
          status={['accepted', 'preparing']}
          orders={orders}
          onStatusChange={handleStatusChange}
          icon={<ChefHat className="w-5 h-5" />}
          colorClass="text-indigo-600 bg-indigo-100/50 p-1.5 rounded-md"
        />
        <OrderColumn
          title="Ready to Serve"
          status={['ready']}
          orders={orders}
          onStatusChange={handleStatusChange}
          icon={<BellRing className="w-5 h-5" />}
          colorClass="text-emerald-600 bg-emerald-100/50 p-1.5 rounded-md"
        />
      </div>
    </Section>
  );
}