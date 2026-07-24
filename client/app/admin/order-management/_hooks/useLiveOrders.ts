import { useEffect } from "react";
import { toast } from "sonner";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useSocket } from "@/hooks/useSocket";
import { Order, OrderStatus } from "../_components/OrderCard";

export function useLiveOrders() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { targetRef, isIntersecting } = useIntersectionObserver();

  const fetchOrders = async ({ pageParam = 1 }) => {
    const res = await Fetch.get(`/api/order/get/data?page=${pageParam}&limit=10`, {
      withCredentials: true,
      withXSRFToken: true,
    });
    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const orders: Order[] = data ? data.pages.flatMap((page) => page.data || []) : [];

  // Handle infinite scroll trigger
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        createdAt: socketData.order.createdAt || new Date().toISOString(),
      };

      queryClient.setQueryData(["orders"], (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = [...oldData.pages];
        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            data: [newOrder, ...newPages[0].data],
          };
        }
        return { ...oldData, pages: newPages };
      });

      toast.success("New order received!");
    };

    socket.on("display_orders", handleOrders);
    return () => {
      socket.off("display_orders", handleOrders);
    };
  }, [socket, isConnected, queryClient]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const previousData = queryClient.getQueryData(["orders"]);

    queryClient.setQueryData(["orders"], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((order: Order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          ),
        })),
      };
    });

    try {
      await Fetch.patch(`/api/order/update/status/${orderId}`, { status: newStatus }, {
        withCredentials: true,
        withXSRFToken: true,
      });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error: any) {
      queryClient.setQueryData(["orders"], previousData);
      toast.error(error.response?.data?.message || "Failed to update order status");
    }
  };

  return {
    orders,
    status,
    isFetchingNextPage,
    targetRef,
    updateOrderStatus,
  };
}
