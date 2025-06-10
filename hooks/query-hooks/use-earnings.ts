import { useQuery } from "@tanstack/react-query"
import { fetchEarnings, fetchWithdrawalHistory, requestWithdrawal } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast"

export function useEarnings(period = "monthly") {
  return useQuery({
    queryKey: ["earnings", period],
    queryFn: () => fetchEarnings(period),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  })
}

export function useWithdrawalHistory() {
  return useQuery({
    queryKey: ["withdrawal-history"],
    queryFn: fetchWithdrawalHistory,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  })
}

export function useRequestWithdrawal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ amount, cardId }: { amount: number; cardId: string }) => requestWithdrawal(amount, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawal-history"] })
      queryClient.invalidateQueries({ queryKey: ["earnings"] })
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to request withdrawal.",
        variant: "destructive",
      })
    },
  })
}
