import { PAKISTAN_BOUNDS, } from "./map-constants";

export interface ValidationErrors {
  [key: string]: string;
}

export function validateChargerForm(data: {
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
  is_available_24hrs: boolean;
  weekday_open?: string;
  weekday_close?: string;
  weekday_closed?: boolean;
  friday_open?: string;
  friday_close?: string;
  friday_closed?: boolean;
  weekend_open?: string;
  weekend_close?: string;
  weekend_closed?: boolean;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  const lat = parseFloat(data.latitude);
  if (isNaN(lat) || lat < PAKISTAN_BOUNDS[0][0] || lat > PAKISTAN_BOUNDS[1][0]) {
    errors.latitude = "Latitude must be within Pakistan (23.5 - 37.5)";
  }

  const lng = parseFloat(data.longitude);
  if (isNaN(lng) || lng < PAKISTAN_BOUNDS[0][1] || lng > PAKISTAN_BOUNDS[1][1]) {
    errors.longitude = "Longitude must be within Pakistan (60.5 - 77.5)";
  }

  if (!data.address.trim()) {
    errors.address = "Address is required";
  } else if (data.address.length > 500) {
    errors.address = "Address must be under 500 characters";
  }

  if (!data.city.trim()) {
    errors.city = "City is required";
  }

  if (!data.province_territory) {
    errors.province_territory = "Province is required";
  }

  if (!data.location_type) {
    errors.location_type = "Location type is required";
  }

  if (!data.charger_type) {
    errors.charger_type = "Charger type is required";
  }

  const power = parseFloat(data.power_kw);
  if (isNaN(power) || power <= 0) {
    errors.power_kw = "Power must be a positive number";
  }

  const cost = parseFloat(data.cost_per_kw);
  if (isNaN(cost) || cost < 0) {
    errors.cost_per_kw = "Cost must be a non-negative number";
  }

  if (data.phone_number && !/^(\+92|0)?3\d{2}-?\d{7}$/.test(data.phone_number.replace(/\s/g, ""))) {
    errors.phone_number = "Invalid Pakistani phone format (e.g., 03XX-XXXXXXX)";
  }

  if (data.cost_per_kwh_peak !== undefined && data.cost_per_kwh_peak !== "") {
    const peak = parseFloat(data.cost_per_kwh_peak);
    if (isNaN(peak) || peak < 0) {
      errors.cost_per_kwh_peak = "Peak cost must be a non-negative number";
    }
  }

  if (!data.is_available_24hrs) {
    const rows = [
      { prefix: "weekday", label: "Weekdays" },
      { prefix: "friday", label: "Friday" },
      { prefix: "weekend", label: "Weekend" },
    ] as const;
    for (const { prefix, label } of rows) {
      if (!data[`${prefix}_closed`]) {
        if (!data[`${prefix}_open`]) {
          errors[`${prefix}_open`] = `${label} open time is required`;
        }
        if (!data[`${prefix}_close`]) {
          errors[`${prefix}_close`] = `${label} close time is required`;
        }
      }
    }
  }

  return errors;
}
