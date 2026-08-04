'use client'
import { Order } from "@/app/admin/order-management/_components/OrderCard";
import { useSocket } from "@/hooks/useSocket";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default React.memo(function OrderMessage() {
    const { socket, isConnected } = useSocket();

    // Handle live socket updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleOrders = (socketData: any) => {
      if (!socketData.success) {
        toast.error(socketData.message || "Failed to receive order");
        return;
      }

      const newOrder: Order = {
        id: socketData.order.id,
        tableId: socketData.table.id,
        tableName: socketData.table.name,
        status: socketData.order.status,
        items: socketData.order.items,
        totalAmount: socketData.total,
        createdAt: socketData.order.createdAt,
      };

    //   queryClient.setQueryData(["orders"], (oldData: any) => {
    //     if (!oldData) return oldData;
    //     const newPages = [...oldData.pages];
    //     if (newPages.length > 0) { newPages[0] = { ...newPages[0], data: [newOrder, ...newPages[0].data], }; }
    //     return { ...oldData, pages: newPages };
    //   });

      toast.message(`New order received at table ${newOrder.tableName}!`,{
        description:`New order received at table ${newOrder.tableName}!`,
      });
    }

    socket.on("display_orders", handleOrders);
    return () => {
      socket.off("display_orders", handleOrders);
    }
  }, [socket, isConnected]);

    return (
        <>
        </>
    )
})
