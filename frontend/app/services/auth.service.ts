import { api } from "../api/axios";
import type { LoginCredentials, LoginResponse } from "../types/auth";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", credentials);

  return response.data;
}
