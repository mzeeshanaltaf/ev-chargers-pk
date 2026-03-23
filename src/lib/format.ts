export function formatPower(kw: number | string): string {
  const num = typeof kw === "number" ? kw : parseFloat(kw);
  if (isNaN(num)) return String(kw);
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
}

export function formatCost(cost: number | string | null | undefined): string {
  if (cost === null || cost === undefined) return "";
  const num = typeof cost === "number" ? cost : parseFloat(cost);
  if (isNaN(num)) return String(cost);
  return `PKR ${num % 1 === 0 ? num.toString() : num.toFixed(2)}`;
}

export function formatPhone(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return phone;
}

export function truncateAddress(addr: string, max: number = 60): string {
  if (addr.length <= max) return addr;
  return addr.slice(0, max).trimEnd() + "...";
}

import type { Charger } from "@/lib/types";

type DayPrefix = "weekday" | "friday" | "weekend";

function parseMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function isChargerOpenNow(charger: Charger): boolean {
  if (!charger.is_active) return false;
  if (charger.is_available_24hrs) return true;

  const now = new Date();
  const day = now.getDay(); // 0=Sun,1=Mon,...,6=Sat
  let prefix: DayPrefix;
  if (day === 5) prefix = "friday";
  else if (day === 0 || day === 6) prefix = "weekend";
  else prefix = "weekday";

  const hours = charger.opening_hours?.[prefix];
  if (!hours) return true; // hours not set — assume open
  if (hours.closed) return false;
  if (!hours.open || !hours.close) return true;

  const nowMins = now.getHours() * 60 + now.getMinutes();
  return nowMins >= parseMins(hours.open) && nowMins < parseMins(hours.close);
}

export function formatTime(t: string | undefined): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDayHours(hours: { open: string; close: string; closed: boolean } | undefined): string {
  if (!hours) return "";
  if (hours.closed) return "Closed";
  if (!hours.open || !hours.close) return "";
  return `${formatTime(hours.open)} – ${formatTime(hours.close)}`;
}

export function getTodayHours(charger: Charger): string {
  if (charger.is_available_24hrs) return "24 Hours";
  const day = new Date().getDay();
  let prefix: DayPrefix;
  if (day === 5) prefix = "friday";
  else if (day === 0 || day === 6) prefix = "weekend";
  else prefix = "weekday";

  const hours = charger.opening_hours?.[prefix];
  if (!hours) return "";
  if (hours.closed) return "Closed today";
  if (!hours.open || !hours.close) return "";
  return `${formatTime(hours.open)} – ${formatTime(hours.close)}`;
}
