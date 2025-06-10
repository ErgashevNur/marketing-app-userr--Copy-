"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginUser, registerUser, logoutUser, getCurrentUser } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginUser(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(["current-user"], data.user)
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
      router.push("/dashboard")
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials.",
        variant: "destructive",
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      })
      router.push("/login")
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account.",
        variant: "destructive",
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear()
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      })
      router.push("/login")
    },
  })

  return {
    login: (email: string, password: string) => loginMutation.mutate({ email, password }),
    register: (userData: any) => registerMutation.mutate(userData),
    logout: () => logoutMutation.mutate(),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    currentUser: getCurrentUser(),
  }
}
