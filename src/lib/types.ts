export interface Charger {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  province_territory: string;
  location_type: string;
  power_kw: string;
  cost_per_kwh: string;
  phone_number: string;
  notes: string;
  is_available_24hrs: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// NOTE: The n8n API uses "cost_per_kw" for insert requests,
// but returns "cost_per_kwh" in the response. This is an API inconsistency.
export interface ChargerInsertPayload {
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  province_territory: string;
  location_type: string;
  power_kw: string;
  cost_per_kw: string;
  phone_number: string;
  notes: string;
  is_available_24hrs: boolean;
  is_active: boolean;
}

export interface FilterState {
  province: string | null;
  city: string | null;
  costRange: [number, number] | null;
  minPower: number | null;
  is24hrs: boolean | null;
  locationType: string | null;
  isActive: boolean | null;
}

export const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "ICT",
  "AJK",
  "GB",
] as const;

export const LOCATION_TYPES = [
  "City",
  "Motorway",
  "Highway",
  "Mall",
  "Hotel",
  "Residential",
  "Other",
] as const;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  authorized: boolean;
  user?: AuthUser;
  message?: string;
}
