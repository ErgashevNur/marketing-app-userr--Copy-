import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchReferrals, getReferralLink } from "@/lib/api"

export function useReferrals() {
  const queryClient = useQueryClient()

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["referrals"],
    queryFn: fetchReferrals,
    staleTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  })

  return {
    referrals: data,
    isLoading,
    error,
    refetch,
  }
}

export function useReferralLink() {
  return useQuery({
    queryKey: ["referral-link"],
    queryFn: getReferralLink,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
