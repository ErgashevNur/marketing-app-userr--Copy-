import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { fetchSpin } from "@/lib/api";

// Spin uchun custom hook
export function useSpin(userId: string | number) {
  const queryClient = useQueryClient();

  // Spin ma'lumotlarini olish (allowed, secondsLeft, spinCount, prizes)
  const {
    data: spinData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["spin", userId],
    queryFn: () => fetchSpin(userId),
    refetchOnWindowFocus: false,
  });

  const refreshSpin = async () => {
    const res = await refetch();
    if (res.error) {
      toast({
        title: "Error",
        description: res.error.message || "Spin ma'lumotlarini olishda xatolik.",
        variant: "destructive",
      });
    }
    return res.data;
  };

  return {
    spinData,
    isLoading,
    isFetching,
    error,
    refreshSpin,
    refetch, // xohlasangiz to'g'ridan-to'g'ri ham ishlatishingiz mumkin
  };
}