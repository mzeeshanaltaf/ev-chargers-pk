"use client";

import { useState, useEffect } from "react";

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: [number, number] | null;
  onChange: (value: [number, number] | null) => void;
  unit?: string;
}

export function RangeSlider({ label, min, max, value, onChange, unit = "" }: RangeSliderProps) {
  const currentMin = value ? value[0] : min;
  const currentMax = value ? value[1] : max;
  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);

  useEffect(() => {
    setLocalMin(value ? value[0] : min);
    setLocalMax(value ? value[1] : max);
  }, [value, min, max]);

  const handleMinChange = (val: number) => {
    const clamped = Math.min(val, localMax);
    setLocalMin(clamped);
    if (clamped === min && localMax === max) {
      onChange(null);
    } else {
      onChange([clamped, localMax]);
    }
  };

  const handleMaxChange = (val: number) => {
    const clamped = Math.max(val, localMin);
    setLocalMax(clamped);
    if (localMin === min && clamped === max) {
      onChange(null);
    } else {
      onChange([localMin, clamped]);
    }
  };

  if (min === max) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <span className="text-xs tabular-nums text-text-secondary min-w-[3rem]" style={{ fontFamily: "var(--font-heading)" }}>
          {localMin}{unit}
        </span>
        <div className="relative flex-1 h-6 flex items-center">
          <div className="absolute inset-x-0 h-1 rounded-full bg-border" />
          <div
            className="absolute h-1 rounded-full bg-brand"
            style={{
              left: `${((localMin - min) / (max - min)) * 100}%`,
              right: `${100 - ((localMax - min) / (max - min)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={localMin}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={localMax}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
        <span className="text-xs tabular-nums text-text-secondary min-w-[3rem] text-right" style={{ fontFamily: "var(--font-heading)" }}>
          {localMax}{unit}
        </span>
      </div>
    </div>
  );
}
