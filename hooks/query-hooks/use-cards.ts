import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchCards, addCard, updateCard, deleteCard, fetchCardsByType, fetchCardsByCountry } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function useCards() {
  const queryClient = useQueryClient()

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: fetchCards,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const addMutation = useMutation({
    mutationFn: addCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] })
      toast({
        title: "Card Added",
        description: "New card has been added successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add card.",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] })
      toast({
        title: "Card Updated",
        description: "Card has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update card.",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] })
      toast({
        title: "Card Deleted",
        description: "Card has been deleted successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete card.",
        variant: "destructive",
      })
    },
  })

  return {
    cards: data,
    isLoading,
    error,
    refetch,
    addCard: (data: any) => addMutation.mutate(data),
    updateCard: (id: string, data: any) => updateMutation.mutate({ id, data }),
    deleteCard: (id: string) => deleteMutation.mutate(id),
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

export function useCardsByType(type: string) {
  return useQuery({
    queryKey: ["cards", "type", type],
    queryFn: () => fetchCardsByType(type),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCardsByCountry(country: string) {
  return useQuery({
    queryKey: ["cards", "country", country],
    queryFn: () => fetchCardsByCountry(country),
    enabled: !!country,
    staleTime: 5 * 60 * 1000,
  })
}
