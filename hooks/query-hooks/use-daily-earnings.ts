import { useMutation } from "@tanstack/react-query";
import { fetchDailyEarnings } from "@/lib/api";

export function useDailyEarnings() {
  return useMutation({
    mutationFn: fetchDailyEarnings,
  });
}