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

/**
 * Coarse relative time for "last added" style labels:
 * "today", "yesterday", "N days ago", "N week(s) ago", "N month(s) ago",
 * "N year(s) ago". Returns "" for invalid input.
 */
export function relativeTimeAgo(dateStr: string): string {
  const t = new Date(dateStr).getTime();
  if (isNaN(t)) return "";
  const days = Math.floor((Date.now() - t) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 35) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

/**
 * Fine-grained relative time for comment timestamps: "just now", "5m ago",
 * "3h ago", "2d ago", then a locale date. Returns "" for invalid input.
 */
export function shortTimeAgo(dateStr: string): string {
  const t = new Date(dateStr).getTime();
  if (isNaN(t)) return "";
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
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

function dayPrefix(date: Date): DayPrefix {
  const day = date.getDay(); // 0=Sun,1=Mon,...,6=Sat
  if (day === 5) return "friday";
  if (day === 0 || day === 6) return "weekend";
  return "weekday";
}

// Returns NaN for malformed "HH:MM" so callers can detect and skip bad data
// rather than computing with NaN.
function parseMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
  return h * 60 + m;
}

export function isChargerOpenNow(charger: Charger): boolean {
  if (!charger.is_active) return false;
  if (charger.is_available_24hrs) return true;

  const now = new Date();
  const hours = charger.opening_hours?.[dayPrefix(now)];
  if (!hours) return true; // hours not set — assume open
  if (hours.closed) return false;
  if (!hours.open || !hours.close) return true;

  const openMins = parseMins(hours.open);
  const closeMins = parseMins(hours.close);
  if (Number.isNaN(openMins) || Number.isNaN(closeMins)) return true; // malformed — assume open

  const nowMins = now.getHours() * 60 + now.getMinutes();
  return nowMins >= openMins && nowMins < closeMins;
}

export function formatTime(t: string | undefined): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return "";
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
  const hours = charger.opening_hours?.[dayPrefix(new Date())];
  if (!hours) return "";
  if (hours.closed) return "Closed today";
  if (!hours.open || !hours.close) return "";
  return `${formatTime(hours.open)} – ${formatTime(hours.close)}`;
}
