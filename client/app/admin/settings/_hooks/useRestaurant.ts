import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";
import { toast } from "sonner";

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useRestaurant() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Restaurant>({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const res = await Fetch.get("/api/settings/restaurant", {
        withCredentials: true,
        withXSRFToken: true,
      });
      return res.data.restaurant;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateRestaurantMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await Fetch.put("/api/settings/restaurant", formData, {
        withCredentials: true,
        withXSRFToken: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
      // Bust the public branding localStorage cache so Navbar shows fresh data
      try { localStorage.removeItem("restaurant_branding"); } catch {}
      toast.success(data.message || "Restaurant settings updated!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update restaurant settings"
      );
    },
  });

  return {
    restaurant: data ?? null,
    isLoading,
    isError,
    updateRestaurantMutation,
  };
}