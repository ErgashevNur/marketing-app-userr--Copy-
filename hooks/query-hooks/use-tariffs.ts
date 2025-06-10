import { fetchTariffs, fetchTariffById, purchaseTariff } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Barcha tariflar uchun hook
export function useTariffs() {
  return useQuery({
    queryKey: ["tariffs"],
    queryFn: fetchTariffs,
  });
}

// Bitta tarif uchun hook
export function useTariffById(id: number | string) {
  return useQuery({
    queryKey: ["tariff", id],
    queryFn: () => fetchTariffById(id),
    enabled: !!id,
  });
}

// Tarif sotib olish uchun hook
export function usePurchaseTariff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tariffId, userId }: { tariffId: number | string; userId: number | string }) =>
      purchaseTariff(tariffId, userId),
    onSuccess: () => {
      // Sotib olgandan so‘ng tariflar ro‘yxatini yangilash
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
    },
  });
}