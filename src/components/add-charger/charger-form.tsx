"use client";

import { useState } from "react";
import type { ChargerInsertPayload } from "@/lib/types";
import { PROVINCES, LOCATION_TYPES } from "@/lib/types";
import { validateChargerForm, type ValidationErrors } from "@/lib/validate";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LocationPicker } from "@/components/add-charger/location-picker";

interface ChargerFormProps {
  initialLat?: string;
  initialLng?: string;
  initialAddress?: string;
  onSubmit: (payload: Omit<ChargerInsertPayload, "event_type">) => Promise<void>;
  onCancel: () => void;
}

export function ChargerForm({ initialLat, initialLng, initialAddress, onSubmit, onCancel }: ChargerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState({
    latitude: initialLat || "",
    longitude: initialLng || "",
    address: initialAddress || "",
    city: "",
    province_territory: "",
    location_type: "",
    power_kw: "",
    cost_per_kw: "",
    phone_number: "",
    notes: "",
    is_available_24hrs: true,
    is_active: true,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateChargerForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address,
        city: formData.city,
        province_territory: formData.province_territory,
        location_type: formData.location_type,
        power_kw: formData.power_kw,
        cost_per_kw: formData.cost_per_kw,
        phone_number: formData.phone_number,
        notes: formData.notes,
        is_available_24hrs: formData.is_available_24hrs,
        is_active: formData.is_active,
      });
    } catch {
      setErrors({ _form: "Failed to add charger. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <LocationPicker
        latitude={formData.latitude}
        longitude={formData.longitude}
        onLocationChange={(lat, lng) => {
          updateField("latitude", lat);
          updateField("longitude", lng);
          // Attempt reverse geocoding
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then((r) => r.json())
            .then((data) => {
              if (data.display_name) updateField("address", data.display_name);
              if (data.address?.city) updateField("city", data.address.city);
              else if (data.address?.town) updateField("city", data.address.town);
              else if (data.address?.village) updateField("city", data.address.village);
            })
            .catch(() => {});
        }}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Latitude"
          value={formData.latitude}
          onChange={(e) => updateField("latitude", e.target.value)}
          error={errors.latitude}
          placeholder="30.3753"
        />
        <Input
          label="Longitude"
          value={formData.longitude}
          onChange={(e) => updateField("longitude", e.target.value)}
          error={errors.longitude}
          placeholder="69.3451"
        />
      </div>

      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => updateField("address", e.target.value)}
        error={errors.address}
        placeholder="Full address of the charging station"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="City"
          value={formData.city}
          onChange={(e) => updateField("city", e.target.value)}
          error={errors.city}
          placeholder="e.g. Islamabad"
        />
        <Select
          label="Province"
          value={formData.province_territory}
          onChange={(e) => updateField("province_territory", e.target.value)}
          error={errors.province_territory}
          options={PROVINCES.map((p) => ({ value: p, label: p }))}
          placeholder="Select..."
        />
      </div>

      <Select
        label="Location Type"
        value={formData.location_type}
        onChange={(e) => updateField("location_type", e.target.value)}
        error={errors.location_type}
        options={LOCATION_TYPES.map((t) => ({ value: t, label: t }))}
        placeholder="Select..."
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Power (kW)"
          type="number"
          value={formData.power_kw}
          onChange={(e) => updateField("power_kw", e.target.value)}
          error={errors.power_kw}
          placeholder="e.g. 150"
          min="1"
        />
        <Input
          label="Cost (PKR/kWh)"
          type="number"
          value={formData.cost_per_kw}
          onChange={(e) => updateField("cost_per_kw", e.target.value)}
          error={errors.cost_per_kw}
          placeholder="e.g. 100"
          min="0"
        />
      </div>

      <Input
        label="Phone Number (optional)"
        value={formData.phone_number}
        onChange={(e) => updateField("phone_number", e.target.value)}
        error={errors.phone_number}
        placeholder="03XX-XXXXXXX"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">Notes (optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm resize-none"
          placeholder="Any additional notes..."
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm text-text-primary">Available 24 Hours</label>
        <button
          type="button"
          onClick={() => updateField("is_available_24hrs", !formData.is_available_24hrs)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            formData.is_available_24hrs ? "bg-brand" : "bg-border"
          }`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            formData.is_available_24hrs ? "translate-x-5" : "translate-x-0"
          }`} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm text-text-primary">Active</label>
        <button
          type="button"
          onClick={() => updateField("is_active", !formData.is_active)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            formData.is_active ? "bg-brand" : "bg-border"
          }`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            formData.is_active ? "translate-x-5" : "translate-x-0"
          }`} />
        </button>
      </div>

      {errors._form && (
        <p className="text-sm text-danger text-center">{errors._form}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1">
          Add Charger
        </Button>
      </div>
    </form>
  );
}
