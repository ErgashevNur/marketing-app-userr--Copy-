import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchSettings, updateSettings } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function useSettings() {
  const queryClient = useQueryClient()

  const {
    data = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  const updateMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
      toast({
        title: "Settings Updated",
        description: "Settings have been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings.",
        variant: "destructive",
      })
    },
  })

  return {
    settings: data,
    isLoading,
    error,
    refetch,
    updateSettings: (data: any) => updateMutation.mutate(data),
    isUpdating: updateMutation.isPending,
  }
}
