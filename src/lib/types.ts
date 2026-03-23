export interface Charger {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  province_territory: string;
  location_type: string;
  charger_type: string;
  power_kw: number;
  cost_per_kwh: number;
  cost_per_kwh_peak?: number | null;
  phone_number: string;
  notes: string;
  is_available_24hrs: boolean;
  is_active: boolean;
  is_open: boolean;
  created_at: string;
  updated_at: string;
  // Operating hours (present when is_available_24hrs = false)
  opening_hours?: {
    weekday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    weekend?: { open: string; close: string; closed: boolean };
  };
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
  charger_type: string;
  power_kw: string;
  cost_per_kw: string;
  cost_per_kwh_peak?: string;
  phone_number: string;
  notes: string;
  is_available_24hrs: boolean;
  user_id?: string;
  // Operating hours (only when is_available_24hrs = false)
  weekday_open?: string;
  weekday_close?: string;
  weekday_closed?: boolean;
  friday_open?: string;
  friday_close?: string;
  friday_closed?: boolean;
  weekend_open?: string;
  weekend_close?: string;
  weekend_closed?: boolean;
}

export interface FilterState {
  province: string | null;
  city: string | null;
  costRange: [number, number] | null;
  minPower: number | null;
  is24hrs: boolean | null;
  locationType: string | null;
  chargerType: string | null;
  isOpen: boolean | null;
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

export const CHARGER_TYPES = ["AC", "DC"] as const;

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
