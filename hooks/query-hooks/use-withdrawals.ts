import { useQuery } from "@tanstack/react-query"
import { fetchWithdrawals } from "@/lib/api"

export function useWithdrawals() {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["withdrawals"],
    queryFn: fetchWithdrawals,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Auto refetch every 30 seconds
  })

  return {
    withdrawals: data,
    isLoading,
    error,
    refetch,
  }
}
