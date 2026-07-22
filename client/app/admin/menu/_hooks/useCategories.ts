import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";
import { toast } from "sonner";
import { CategoryData } from "../page";

export function useCategories(deferredSearch: string) {
    const queryClient = useQueryClient();

    const { 
        data: categoryPages, 
        isLoading: isCategoriesLoading, 
        isFetchingNextPage, 
        fetchNextPage, 
        hasNextPage 
    } = useInfiniteQuery({
        queryKey: ["categories", deferredSearch],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({ page: String(pageParam), limit: String(10) });
            if (deferredSearch) params.set("search", deferredSearch);

            const res = await Fetch.get(`/api/category/all?${params.toString()}`, { 
                withCredentials: true, 
                withXSRFToken: true 
            });
            return res.data;
        },
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
    });

    const categories: CategoryData[] = categoryPages?.pages.flatMap((p) => p.categories) ?? [];

    const createCategoryMutation = useMutation({
        mutationFn: async (data: { name: string; slug: string; desc?: string; image?: File | null; isVisible: boolean }) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("slug", data.slug);
            if (data.desc) formData.append("desc", data.desc);
            formData.append("isVisible", String(data.isVisible));
            if (data.image instanceof File) formData.append("image", data.image);

            const res = await Fetch.post("/api/category", formData, { withCredentials: true, withXSRFToken: true });
            return res.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success(data.message || "Category created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create category");
        },
    });

    const updateCategoryMutation = useMutation({
        mutationFn: async (data: { id: string; name: string; slug: string; desc?: string; image?: File | null; isVisible: boolean; removeImage?: boolean }) => {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("slug", data.slug);
            if (data.desc !== undefined) formData.append("desc", data.desc);
            formData.append("isVisible", String(data.isVisible));
            if (data.removeImage) formData.append("removeImage", "true");
            if (data.image instanceof File) formData.append("image", data.image);

            const res = await Fetch.put(`/api/category/${data.id}`, formData, { withCredentials: true, withXSRFToken: true });
            return res.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success(data.message || "Category updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update category");
        },
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await Fetch.delete(`/api/category/${id}`, { withCredentials: true, withXSRFToken: true });
            return res.data;
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success(data.message || "Category deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete category");
        },
    });

    return {
        categories,
        isCategoriesLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        createCategoryMutation,
        updateCategoryMutation,
        deleteCategoryMutation,
    };
}
