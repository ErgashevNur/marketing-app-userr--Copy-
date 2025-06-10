import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchNotifications, sendNotification } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function useNotifications() {
  const queryClient = useQueryClient()

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const sendMutation = useMutation({
    mutationFn: sendNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      toast({
        title: "Notification Sent",
        description: "Notification has been sent successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send notification.",
        variant: "destructive",
      })
    },
  })

  return {
    notifications: data,
    isLoading,
    error,
    refetch,
    sendNotification: (data: any) => sendMutation.mutate(data),
    isSending: sendMutation.isPending,
  }
}
