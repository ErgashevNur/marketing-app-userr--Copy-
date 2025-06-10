import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchStatistics, createStatistics, updateStatistics, deleteStatistics } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function useStatistics() {
  const queryClient = useQueryClient()

  const {
    data = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["statistics"],
    queryFn: fetchStatistics,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto refetch every minute
  })

  const createMutation = useMutation({
    mutationFn: createStatistics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics"] })
      toast({
        title: "Statistics Created",
        description: "Statistics entry has been created successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create statistics.",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateStatistics(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics"] })
      toast({
        title: "Statistics Updated",
        description: "Statistics have been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update statistics.",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStatistics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statistics"] })
      toast({
        title: "Statistics Deleted",
        description: "Statistics entry has been deleted successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete statistics.",
        variant: "destructive",
      })
    },
  })

  return {
    statistics: data,
    isLoading,
    error,
    refetch,
    createStatistics: (data: any) => createMutation.mutate(data),
    updateStatistics: (id: string, data: any) => updateMutation.mutate({ id, data }),
    deleteStatistics: (id: string) => deleteMutation.mutate(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
