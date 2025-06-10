"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type CoinRates = Record<string, number>;

export const DEFAULT_CURRENCIES = [
  { code: "UZS", name: "So'm" },
  { code: "USD", name: "Dollar" },
  { code: "RUB", name: "Rubl" },
  { code: "EUR", name: "Yevro" },
  { code: "KZT", name: "Tenge" },
  { code: "TRY", name: "Turk lira" },
  { code: "AED", name: "Dirham" },
  { code: "CNY", name: "Yuan" },
];

const MOCK_COIN_RATES: CoinRates = {
  UZS: 1200,
  USD: 0.1,
  RUB: 9,
  EUR: 0.09,
  KZT: 45,
  TRY: 3.2,
  AED: 0.36,
  CNY: 0.7,
};

interface CoinCalculatorProps {
  currencies?: typeof DEFAULT_CURRENCIES;
  defaultCurrency?: string;
  className?: string;
}

export function CoinCalculator({
  currencies = DEFAULT_CURRENCIES,
  defaultCurrency = "UZS",
  className = "",
}: CoinCalculatorProps) {
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>(defaultCurrency);
  const [converted, setConverted] = useState<number | null>(null);
  const [coinRates, setCoinRates] = useState<CoinRates>(MOCK_COIN_RATES);
  const [loading, setLoading] = useState(false);

  // Kurslarni backenddan olish
  useEffect(() => {
    setLoading(true);
    fetch("https://mlm-backend.pixl.uz/coin")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        // API'dan kelgan data obyekt emas, massiv bo'lishi mumkin yoki noto'g'ri formatda bo'lishi mumkin.
        // To'g'ri formatga keltirish:
        if (Array.isArray(data)) {
          // Masalan: [{currency: "UZS", rate: 1200}, ...]
          const rates: CoinRates = {};
          data.forEach((item) => {
            if (item.currency && item.rate) {
              rates[item.currency] = item.rate;
            }
          });
          setCoinRates(rates);
        } else if (typeof data === "object" && data !== null) {
          setCoinRates(data);
        } else {
          setCoinRates(MOCK_COIN_RATES);
        }
      })
      .catch(() => {
        setCoinRates(MOCK_COIN_RATES); // fallback
      })
      .finally(() => setLoading(false));
  }, []);

  console.log(coinRates);

  useEffect(() => {
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setConverted(null);
      return;
    }
    const rate = coinRates[currency] || 1;
    setConverted(amountNum * rate);
  }, [amount, currency, coinRates]);

  return (
    <div
      className={`max-w-md mx-auto p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm ${className}`}
    >
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-gray-700 dark:text-gray-300">
            Coin miqdorini kiriting
          </Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1}
            placeholder="Coin miqdori"
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:outline-none transition"
          />
        </div>

        <div>
          <Label className="text-sm text-gray-700 dark:text-gray-300">
            Valyuta
          </Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:outline-none transition px-3 py-2">
              <SelectValue placeholder="Valyutani tanlang" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              {currencies.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Kurslar yuklanmoqda...
          </div>
        )}

        {converted !== null && !loading && (
          <div className="text-base font-medium text-gray-800 dark:text-gray-100">
            <span className="text-gray-600 dark:text-gray-400">
              {amount} coin ≈
            </span>{" "}
            <span className="font-semibold text-pink-600 dark:text-pink-400">
              {converted.toLocaleString()} {currency}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
