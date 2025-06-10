"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchUsers, fetchUserById, updateUser, deleteUser, blockUser, unblockUser } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function useUsers() {
  const queryClient = useQueryClient()

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 3 * 60 * 1000, // 3 minutes
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "User Updated",
        description: "User information has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user.",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      })
    },
  })

  const blockMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "User Blocked",
        description: "User has been blocked successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to block user.",
        variant: "destructive",
      })
    },
  })

  const unblockMutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "User Unblocked",
        description: "User has been unblocked successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unblock user.",
        variant: "destructive",
      })
    },
  })

  return {
    users: data,
    isLoading,
    error,
    refetch,
    updateUser: (id: string, data: any) => updateMutation.mutate({ id, data }),
    deleteUser: (id: string) => deleteMutation.mutate(id),
    blockUser: (id: string) => blockMutation.mutate(id),
    unblockUser: (id: string) => unblockMutation.mutate(id),
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBlocking: blockMutation.isPending,
    isUnblocking: unblockMutation.isPending,
  }
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  })
}
