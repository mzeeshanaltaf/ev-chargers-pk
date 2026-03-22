export function formatPower(kw: string): string {
  const num = parseFloat(kw);
  if (isNaN(num)) return kw;
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
}

export function formatCost(cost: string): string {
  const num = parseFloat(cost);
  if (isNaN(num)) return cost;
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
