import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function useProfile() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await Fetch.get("/api/profile", {
        withCredentials: true,
        withXSRFToken: true,
      });
      return res.data.user;
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const res = await Fetch.put("/api/profile", payload, {
        withCredentials: true,
        withXSRFToken: true,
      });
      return res.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data.message || "Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    },
  });

  return {
    profile: data ?? null,
    isLoading,
    isError,
    updateProfileMutation,
  };
}
