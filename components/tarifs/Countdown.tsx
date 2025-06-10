import { useEffect, useState } from "react";

export function TariffCountdown({
  createdAt,
  term,
}: {
  createdAt: string;
  term: number;
}) {
  // Tugash vaqtini hisoblash
  const endTime = new Date(createdAt).getTime() + term * 24 * 60 * 60 * 1000;
  const [remaining, setRemaining] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(endTime - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (remaining <= 0) {
    return (
      <span className="text-red-500 font-semibold">Tarif muddati tugadi</span>
    );
  }

  // Kun, soat, minut, sekundga ajratish
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <span className="text-xs text-muted-foreground">
      Tugashiga: {days} kun {hours} soat {minutes} min {seconds} sek
    </span>
  );
}
