import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { fetchProducts } from "@/lib/api"

// Mock API functions for now
const createProduct = async (data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { id: Date.now().toString(), ...data }
}

const updateProduct = async (id: string, data: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { id, ...data }
}

const deleteProduct = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { id }
}

export function useProducts() {
  const queryClient = useQueryClient()

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  })

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Product Created",
        description: "New product has been created successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product.",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product.",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      })
    },
  })

  return {
    products,
    isLoading,
    error,
    createProduct: (data: any) => createMutation.mutate(data),
    updateProduct: (id: string, data: any) => updateMutation.mutate({ id, data }),
    deleteProduct: (id: string) => deleteMutation.mutate(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
