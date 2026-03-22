"use client";

interface ToggleFilterProps {
  label: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

export function ToggleFilter({ label, value, onChange }: ToggleFilterProps) {
  const handleClick = () => {
    if (value === null) onChange(true);
    else if (value === true) onChange(false);
    else onChange(null);
  };

  return (
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
        {label}
      </label>
      <button
        onClick={handleClick}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          value === true
            ? "bg-brand"
            : value === false
            ? "bg-danger"
            : "bg-border"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            value === true
              ? "translate-x-5"
              : value === false
              ? "translate-x-0"
              : "translate-x-2.5"
          }`}
        />
      </button>
    </div>
  );
}
