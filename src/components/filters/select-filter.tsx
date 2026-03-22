"use client";

import { ChevronDownIcon } from "@/components/icons";

interface SelectFilterProps {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
  placeholder?: string;
}

export function SelectFilter({ label, value, options, onChange, placeholder = "All" }: SelectFilterProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full pl-3 pr-8 py-2 rounded-lg bg-surface-raised border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent appearance-none cursor-pointer transition-all"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
      </div>
    </div>
  );
}
