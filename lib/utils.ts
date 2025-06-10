import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amountUZS: number, currency: string) {
  const currencyMap: Record<
    string,
    { symbol: string; rate: number; decimals: number; space?: boolean }
  > = {
    USD: { symbol: "$", rate: 12000, decimals: 2, space: true },
    RUB: { symbol: "₽", rate: 80, decimals: 0 },
    UZS: { symbol: "UZS", rate: 1, decimals: 0 },
    KZT: { symbol: "₸", rate: 4600, decimals: 0 },
    KGS: { symbol: "KGS", rate: 880, decimals: 0 },
    TJS: { symbol: "TJS", rate: 12, decimals: 0 },
    CNY: { symbol: "¥", rate: 70, decimals: 2, space: true },
  };

  const currencyInfo = currencyMap[currency];

  if (!currencyInfo) {
    toast.error(`Unsupported currency: ${currency}`);
  }

  const { symbol, rate, decimals, space = false } = currencyInfo;

  const converted = amountUZS / rate;

  const formatted = converted
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return ` ${formatted} ${symbol}`;
}
