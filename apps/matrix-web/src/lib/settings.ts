export interface BusinessSettings {
  identity: {
    trade_name: string;
    legal_name: string;
    logo_url: string;
  };
  web: {
    url: string;
    language: string;
  };
  fiscal: {
    tax_id: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
  };
  contact: {
    phone: string;
    public_email: string;
  };
}

export const EMPTY_SETTINGS: BusinessSettings = {
  identity: { trade_name: '', legal_name: '', logo_url: '' },
  web: { url: '', language: 'es' },
  fiscal: { tax_id: '', address: '', city: '', postal_code: '', country: 'ES' },
  contact: { phone: '', public_email: '' },
};
