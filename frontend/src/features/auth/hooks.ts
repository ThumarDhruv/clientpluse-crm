import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "./api";
import { LoginPayload } from "./types";
import { setStoredToken, setStoredUser, clearAuth, getStoredToken } from "@/lib/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const token = getStoredToken();

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    enabled: !!token,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setStoredToken(data.access_token);
      setStoredUser(data.user);
      queryClient.setQueryData(["auth", "me"], data.user);
      router.push("/dashboard/customers");
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
    router.push("/login");
  };

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!token,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  };
}
