export type ProviderType = "PHYSICAL_PERSON" | "LEGAL_ENTITY";
export type ProviderStatus = "ACTIVE" | "INACTIVE";

export type Provider = {
  id: number;
  type: ProviderType;
  businessName: string;
  rfc: string;
  email: string;
  phone: string;
  status: ProviderStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProviderPayload = {
  type: ProviderType;
  businessName: string;
  rfc: string;
  email: string;
  phone: string;
};
