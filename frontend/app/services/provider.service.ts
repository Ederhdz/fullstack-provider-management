import { api } from "../api/axios";
import type { Provider, ProviderPayload, ProviderStatus } from "../types/provider";

export async function getProviders(): Promise<Provider[]> {
  const response = await api.get<Provider[]>("/providers");

  return response.data;
}

export async function createProvider(payload: ProviderPayload): Promise<Provider> {
  const response = await api.post<Provider>("/providers", payload);

  return response.data;
}

export async function updateProvider(
  id: number,
  payload: Partial<ProviderPayload>,
): Promise<Provider> {
  const response = await api.put<Provider>(`/providers/${id}`, payload);

  return response.data;
}

export async function deleteProvider(id: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/providers/${id}`);

  return response.data;
}

export async function changeProviderStatus(
  id: number,
  status: ProviderStatus,
): Promise<Provider> {
  const response = await api.patch<Provider>(`/providers/${id}/status`, { status });

  return response.data;
}
