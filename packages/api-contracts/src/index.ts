export interface MatrixContext {
  organization_id: number;
  business_id: number;
  module_slug?: string;
  settings?: Record<string, unknown>;
}

export interface LeadPayload {
  source?: string;
  status?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  department?: string;
  intent?: string;
  data?: Record<string, unknown>;
}

export interface TokenConsumePayload {
  amount: number;
  module: string;
  reference?: string;
}

export interface NotifyPayload {
  channel: string;
  title: string;
  body: string;
  severity?: 'info' | 'warning' | 'critical';
  meta?: Record<string, unknown>;
}

export interface ProviderConnectionResponse {
  provider: string;
  scope: string;
  credentials: Record<string, string>;
}
