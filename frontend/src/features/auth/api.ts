import { apiClient } from "@/lib/api-client";
import { LoginPayload, LoginResponse, User } from "./types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
    return data;
  },
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>("/auth/me");
    return data;
  },
};
