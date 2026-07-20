import React from "react";
import OrderCard, { Order, OrderStatus } from "./OrderCard";
// import { ScrollArea } from "@/components/ui/scroll-area"; // assuming you might have a scroll-area component or we'll use regular overflow

interface OrderColumnProps {
  title: string;
  status: OrderStatus[];
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  icon?: React.ReactNode;
  colorClass?: string;
}

export default function OrderColumn({ 
  title, 
  status, 
  orders, 
  onStatusChange, 
  icon,
  colorClass = "bg-gray-100 text-gray-800"
}: OrderColumnProps) {
  
  const columnOrders = orders.filter(order => status.includes(order.status));

  return (
    <div className="flex flex-col bg-gray-50/50 rounded-2xl border border-gray-100/50 h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100/80 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <div className={colorClass}>{icon}</div>}
            <h2 className="font-semibold text-gray-800 text-lg">{title}</h2>
          </div>
          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {columnOrders.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex flex-col gap-4">
          {columnOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
              <div className="w-16 h-16 mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="opacity-50">{icon}</span>
              </div>
              <p>No {title.toLowerCase()} orders</p>
            </div>
          ) : (
            columnOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={onStatusChange} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
