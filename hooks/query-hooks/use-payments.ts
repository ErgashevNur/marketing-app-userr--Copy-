import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchPayments,
  processWithdrawal,
  processWithdrawalWithAdmin,
  rejectWithdrawal,
  windrawalResponse,
} from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function usePayments() {
  const queryClient = useQueryClient()

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Auto refetch every 30 seconds
  })

  const processMutation = useMutation({
    mutationFn: processWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] })
      toast({
        title: "Payment Processed",
        description: "Payment has been processed successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process payment.",
        variant: "destructive",
      })
    },
  })

  const processWithAdminMutation = useMutation({
    mutationFn: ({ id, adminId, comment }: { id: string; adminId: string; comment: string }) =>
      processWithdrawalWithAdmin(id, adminId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] })
      toast({
        title: "Payment Processed",
        description: "Payment has been processed with admin approval.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process payment.",
        variant: "destructive",
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectWithdrawal(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] })
      toast({
        title: "Payment Rejected",
        description: "Payment has been rejected.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject payment.",
        variant: "destructive",
      })
    },
  })

  const responseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => windrawalResponse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] })
      toast({
        title: "Response Sent",
        description: "Withdrawal response has been sent successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send response.",
        variant: "destructive",
      })
    },
  })

  return {
    payments: data,
    isLoading,
    error,
    refetch,
    processPayment: (id: string) => processMutation.mutate(id),
    processWithAdmin: (id: string, adminId: string, comment: string) =>
      processWithAdminMutation.mutate({ id, adminId, comment }),
    rejectPayment: (id: string, reason: string) => rejectMutation.mutate({ id, reason }),
    sendResponse: (id: string, data: any) => responseMutation.mutate({ id, data }),
    isProcessing: processMutation.isPending || processWithAdminMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isSendingResponse: responseMutation.isPending,
  }
}
