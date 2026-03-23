"use client";

import { useState } from "react";
import type { Charger, ChargerInsertPayload } from "@/lib/types";
import { PROVINCES, LOCATION_TYPES, CHARGER_TYPES } from "@/lib/types";
import { validateChargerForm, type ValidationErrors } from "@/lib/validate";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LocationPicker } from "@/components/add-charger/location-picker";
import { useAuth } from "@/components/auth-provider";

interface ChargerFormProps {
  initialLat?: string;
  initialLng?: string;
  initialAddress?: string;
  initialData?: Charger;
  onSubmit: (payload: Omit<ChargerInsertPayload, "event_type">) => Promise<void>;
  onCancel: () => void;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? "bg-brand" : "bg-border"}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

type DayPrefix = "weekday" | "friday" | "weekend";

interface HoursRowProps {
  label: string;
  prefix: DayPrefix;
  open: string;
  close: string;
  closed: boolean;
  openError?: string;
  closeError?: string;
  onChange: (field: string, value: string | boolean) => void;
}

function HoursRow({ label, prefix, open, close, closed, openError, closeError, onChange }: HoursRowProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-primary w-24 shrink-0">{label}</span>
        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-text-secondary select-none">
          <input
            type="checkbox"
            checked={closed}
            onChange={(e) => onChange(`${prefix}_closed`, e.target.checked)}
            className="accent-brand"
          />
          Closed
        </label>
        {!closed && (
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="time"
              value={open}
              onChange={(e) => onChange(`${prefix}_open`, e.target.value)}
              className={`px-2 py-1 rounded-lg bg-surface border text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${openError ? "border-danger" : "border-border"}`}
            />
            <span className="text-text-secondary text-xs">–</span>
            <input
              type="time"
              value={close}
              onChange={(e) => onChange(`${prefix}_close`, e.target.value)}
              className={`px-2 py-1 rounded-lg bg-surface border text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${closeError ? "border-danger" : "border-border"}`}
            />
          </div>
        )}
        {closed && <div className="flex-1 ml-2 text-xs text-text-secondary italic">All day closed</div>}
      </div>
      {!closed && (openError || closeError) && (
        <p className="text-xs text-danger ml-24">{openError || closeError}</p>
      )}
    </div>
  );
}

export function ChargerForm({ initialLat, initialLng, initialAddress, initialData, onSubmit, onCancel }: ChargerFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [peakPricingEnabled, setPeakPricingEnabled] = useState(
    initialData?.cost_per_kwh_peak != null
  );
  const [formData, setFormData] = useState({
    latitude: initialData ? String(initialData.latitude) : (initialLat || ""),
    longitude: initialData ? String(initialData.longitude) : (initialLng || ""),
    address: initialData?.address || initialAddress || "",
    city: initialData?.city || "",
    province_territory: initialData?.province_territory || "",
    location_type: initialData?.location_type || "",
    charger_type: initialData?.charger_type || "",
    power_kw: initialData ? String(initialData.power_kw) : "",
    cost_per_kw: initialData ? String(initialData.cost_per_kwh) : "",
    cost_per_kwh_peak: initialData?.cost_per_kwh_peak != null ? String(initialData.cost_per_kwh_peak) : "",
    phone_number: initialData?.phone_number || "",
    notes: initialData?.notes || "",
    is_available_24hrs: initialData ? initialData.is_available_24hrs : true,
    weekday_open: initialData?.opening_hours?.weekday?.open || "09:00",
    weekday_close: initialData?.opening_hours?.weekday?.close || "22:00",
    weekday_closed: initialData?.opening_hours?.weekday?.closed || false,
    friday_open: initialData?.opening_hours?.friday?.open || "14:00",
    friday_close: initialData?.opening_hours?.friday?.close || "22:00",
    friday_closed: initialData?.opening_hours?.friday?.closed || false,
    weekend_open: initialData?.opening_hours?.weekend?.open || "09:00",
    weekend_close: initialData?.opening_hours?.weekend?.close || "22:00",
    weekend_closed: initialData?.opening_hours?.weekend?.closed || false,
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
    const validationErrors = validateChargerForm({
      ...formData,
      cost_per_kwh_peak: peakPricingEnabled ? formData.cost_per_kwh_peak : undefined,
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: Omit<ChargerInsertPayload, "event_type"> = {
      latitude: formData.latitude,
      longitude: formData.longitude,
      address: formData.address,
      city: formData.city,
      province_territory: formData.province_territory,
      location_type: formData.location_type,
      charger_type: formData.charger_type,
      power_kw: formData.power_kw,
      cost_per_kw: formData.cost_per_kw,
      phone_number: formData.phone_number,
      notes: formData.notes,
      is_available_24hrs: formData.is_available_24hrs,
      user_id: user?.id,
    };

    if (peakPricingEnabled && formData.cost_per_kwh_peak) {
      payload.cost_per_kwh_peak = formData.cost_per_kwh_peak;
    }

    if (!formData.is_available_24hrs) {
      payload.weekday_open = formData.weekday_open;
      payload.weekday_close = formData.weekday_close;
      payload.weekday_closed = formData.weekday_closed;
      payload.friday_open = formData.friday_open;
      payload.friday_close = formData.friday_close;
      payload.friday_closed = formData.friday_closed;
      payload.weekend_open = formData.weekend_open;
      payload.weekend_close = formData.weekend_close;
      payload.weekend_closed = formData.weekend_closed;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
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
          label="Province/Territory"
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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">Charger Type</label>
        <div className="flex gap-4">
          {CHARGER_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="charger_type"
                value={t}
                checked={formData.charger_type === t}
                onChange={() => updateField("charger_type", t)}
                className="accent-brand w-4 h-4"
              />
              <span className="text-sm text-text-primary">{t}</span>
            </label>
          ))}
        </div>
        {errors.charger_type && <p className="text-xs text-danger">{errors.charger_type}</p>}
      </div>

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

      {/* Peak Pricing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-text-primary">Variable (Peak Hour) Pricing</label>
          <Toggle value={peakPricingEnabled} onChange={(v) => {
            setPeakPricingEnabled(v);
            if (!v) updateField("cost_per_kwh_peak", "");
          }} />
        </div>
        {peakPricingEnabled && (
          <Input
            label="Peak Cost (PKR/kWh)"
            type="number"
            value={formData.cost_per_kwh_peak}
            onChange={(e) => updateField("cost_per_kwh_peak", e.target.value)}
            error={errors.cost_per_kwh_peak}
            placeholder="e.g. 150"
            min="0"
          />
        )}
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

      {/* 24 Hours toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-text-primary">Available 24 Hours</label>
        <Toggle value={formData.is_available_24hrs} onChange={(v) => updateField("is_available_24hrs", v)} />
      </div>

      {/* Operating Hours — shown only when not 24hrs */}
      {!formData.is_available_24hrs && (
        <div className="rounded-lg border border-border p-4 space-y-3 bg-surface-raised">
          <p className="text-sm font-medium text-text-secondary">Operating Hours</p>
          <HoursRow
            label="Weekdays"
            prefix="weekday"
            open={formData.weekday_open}
            close={formData.weekday_close}
            closed={formData.weekday_closed}
            openError={errors.weekday_open}
            closeError={errors.weekday_close}
            onChange={updateField}
          />
          <HoursRow
            label="Friday"
            prefix="friday"
            open={formData.friday_open}
            close={formData.friday_close}
            closed={formData.friday_closed}
            openError={errors.friday_open}
            closeError={errors.friday_close}
            onChange={updateField}
          />
          <HoursRow
            label="Weekend"
            prefix="weekend"
            open={formData.weekend_open}
            close={formData.weekend_close}
            closed={formData.weekend_closed}
            openError={errors.weekend_open}
            closeError={errors.weekend_close}
            onChange={updateField}
          />
        </div>
      )}

      {errors._form && (
        <p className="text-sm text-danger text-center">{errors._form}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} className="flex-1">
          {initialData ? "Save Changes" : "Add Charger"}
        </Button>
      </div>
    </form>
  );
}
