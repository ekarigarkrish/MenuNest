import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";
import { toast } from "sonner";

export function useMenuItems(activeCategoryId: string, deferredFoodSearch: string) {
    const queryClient = useQueryClient();

    const { 
        data: menuItemsPages, 
        isLoading: isMenuItemsLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ["menu-items", activeCategoryId, deferredFoodSearch],
        queryFn: async ({ pageParam = 1 }) => {
            if (!activeCategoryId) return { menuItems: [], hasMore: false, page: 1 };
            const params = new URLSearchParams({ page: String(pageParam), limit: "10" });
            params.set("category", activeCategoryId);
            if (deferredFoodSearch) params.set("search", deferredFoodSearch);

            const res = await Fetch.get(`/api/menu/all?${params.toString()}`, {
                withCredentials: true,
                withXSRFToken: true
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        enabled: !!activeCategoryId,
    });
    

    const activeCategoryFoods = menuItemsPages?.pages.flatMap((p: any) => p.menuItems) ?? [];

    const deleteFoodMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await Fetch.delete(`/api/menu/${id}`, { withCredentials: true, withXSRFToken: true });
            return res.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["menu-items"] });
            toast.success(data.message || "Menu item deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete menu item");
        },
    });

    return {
        activeCategoryFoods,
        isMenuItemsLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        deleteFoodMutation,
    };
}
