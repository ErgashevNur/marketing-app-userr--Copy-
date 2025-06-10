"use client";
import { useEffect, useState } from "react";

interface CoinPriceProps {
  price: number;
  currency: string;
  fetchRates?: () => Promise<Record<string, number>>;
}

const MOCK_COIN_RATES: Record<string, number> = {
  UZS: 1200,
  USD: 0.1,
  RUB: 9,
  EUR: 0.09,
  KZT: 45,
  TRY: 3.2,
  AED: 0.36,
  CNY: 0.7,
};

export function CoinPrice({ price, currency, fetchRates }: CoinPriceProps) {
  const [coinRates, setCoinRates] =
    useState<Record<string, number>>(MOCK_COIN_RATES);
  const [coin, setCoin] = useState<number | null>(null);

  useEffect(() => {
    if (fetchRates) {
      fetchRates().then((data) => setCoinRates(data));
    }
  }, [fetchRates]);

  useEffect(() => {
    const rate = coinRates[currency] || 1;
    if (rate > 0) setCoin(Number((price / rate).toFixed(2)));
    else setCoin(null);
  }, [price, currency, coinRates]);

  if (coin === null) return null;

  return (
    <span>
      {coin} coin
      <span className="text-xs text-muted-foreground ml-2">
        ({price} {currency})
      </span>
    </span>
  );
}
