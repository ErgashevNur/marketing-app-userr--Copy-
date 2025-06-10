import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchUserProfile, updateUserProfile, uploadAvatar, changeUserPassword } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function useProfile() {
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
  })

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile"], data)
      queryClient.invalidateQueries({ queryKey: ["current-user"] })
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      })
    },
  })

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar.",
        variant: "destructive",
      })
    },
  })

  const passwordMutation = useMutation({
    mutationFn: ({ userId, oldPassword, newPassword }: { userId: string; oldPassword: string; newPassword: string }) =>
      changeUserPassword(userId, oldPassword, newPassword),
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      })
    },
  })

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: (data: any) => updateMutation.mutate(data),
    uploadAvatar: (file: File) => avatarMutation.mutate(file),
    changePassword: (userId: string, oldPassword: string, newPassword: string) =>
      passwordMutation.mutate({ userId, oldPassword, newPassword }),
    isUpdating: updateMutation.isPending,
    isUploadingAvatar: avatarMutation.isPending,
    isChangingPassword: passwordMutation.isPending,
  }
}
