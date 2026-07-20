import React from "react";
import { motion } from "framer-motion";
import { Clock, Utensils, IndianRupee, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled' | 'completed';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  customerName?: string;
}

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const timeAgo = (dateString: string) => {
    const minutes = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
    if (minutes < 1) return "Just now";
    return `${minutes}m ago`;
  };

  const renderActions = () => {
    switch (order.status) {
      case "pending":
        return (
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => onStatusChange(order.id, "cancelled")}
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="w-full bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-500"
              onClick={() => onStatusChange(order.id, "accepted")}
            >
              Accept
            </Button>
          </div>
        );
      case "accepted":
      case "preparing":
        return (
          <div className="flex gap-2 mt-4">
            <Button
              variant="primary"
              size="sm"
              className="w-full bg-indigo-500 hover:bg-indigo-600 focus-visible:ring-indigo-500"
              onClick={() => onStatusChange(order.id, "ready")}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Mark Ready
            </Button>
          </div>
        );
      case "ready":
        return (
          <div className="flex gap-2 mt-4">
            <Button
              variant="primary"
              size="sm"
              className="w-full bg-emerald-500 hover:bg-emerald-600 focus-visible:ring-emerald-500"
              onClick={() => onStatusChange(order.id, "served")}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Serve Order
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
    >
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900">{order.tableName}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium">#{order.id.split('-')[0]}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {timeAgo(order.createdAt)}
          </div>
        </div>

        <div className="space-y-2 mt-4 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-sm">
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700">{item.quantity}x</span>
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="text-gray-500">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 font-medium">Total Amount</span>
          <span className="font-bold text-gray-900 flex items-center">
            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
            {order.totalAmount}
          </span>
        </div>
        {renderActions()}
      </div>
    </motion.div>
  );
}
