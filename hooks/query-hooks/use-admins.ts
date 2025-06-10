import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAdmins, addAdmin } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function useAdmins() {
  const queryClient = useQueryClient()

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const addMutation = useMutation({
    mutationFn: addAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] })
      toast({
        title: "Admin Added",
        description: "New admin has been added successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add admin.",
        variant: "destructive",
      })
    },
  })

  return {
    admins: data,
    isLoading,
    error,
    refetch,
    addAdmin: (data: any) => addMutation.mutate(data),
    isAdding: addMutation.isPending,
  }
}
