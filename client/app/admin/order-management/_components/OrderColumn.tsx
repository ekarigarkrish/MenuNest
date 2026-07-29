import React, { useState } from "react";
import OrderCard, { Order, OrderStatus } from "./OrderCard";
interface OrderColumnProps {
  title: string;
  status: OrderStatus[];
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  icon?: React.ReactNode;
  colorClass?: string;
}

export default function OrderColumn({ title, status, orders, onStatusChange, icon, colorClass = "bg-gray-100 text-gray-800" }: OrderColumnProps) {
  const [dragCounter, setDragCounter] = useState(0);
  const columnOrders = orders.filter(order => status.includes(order.status));

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter((prev) => prev + 1);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter((prev) => prev - 1);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(0);
    
    const orderId = e.dataTransfer.getData("orderId");
    const sourceStatus = e.dataTransfer.getData("sourceStatus") as OrderStatus;
    
    // Check if order exists and isn't already in this column
    if (orderId && !status.includes(sourceStatus)) {
      // Use the primary (first) status defined for this column
      onStatusChange(orderId, status[0]);
    }
  };

  const isDragOver = dragCounter > 0;

  return (
    <div 
      className={`flex flex-col rounded-2xl border h-full overflow-hidden transition-all duration-200 ${
        isDragOver 
          ? "bg-gray-100/80 border-gray-300 ring-4 ring-gray-100/50" 
          : "bg-gray-50/50 border-gray-100/50"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`p-4 border-b border-gray-100/80 sticky top-0 z-10 transition-colors duration-200 ${
        isDragOver ? "bg-gray-100/80" : "bg-white/50 backdrop-blur-sm"
      }`}>
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