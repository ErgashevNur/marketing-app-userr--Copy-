"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/utils";
import { useTariffs, usePurchaseTariff } from "@/hooks/query-hooks/use-tariffs";
import { toast } from "sonner";
import { CoinPrice } from "@/components/products/CoinPrice";
export default function TariffsPage() {
  const { t, currency, language: lang } = useLanguage();
  const [selectedTariff, setSelectedTariff] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: number | null }>({ id: null });
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Faqat clientda userni localStorage dan o‘qish
  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("mlm_user");
      setUser(u ? JSON.parse(u) : { id: null });
    }
  }, []);

  // tariff hook
  const { data: tariffs = [], isLoading } = useTariffs();

  //buy hook
  const purchaseMutation = usePurchaseTariff();

  const getTranslation = (tariff: any) =>
    Array.isArray(tariff.translations) && tariff.translations.length
      ? tariff.translations.find((tr: any) => tr.language === lang) ||
        tariff.translations[0]
      : {
          name: t("noTitle") || "Nomi yo'q",
          description: t("noDescription") || "Tavsifi yo'q",
          longDescription: "",
          features: "",
          usage: "",
        };

  const getPrice = (tariff: any) =>
    Array.isArray(tariff.prices) && tariff.prices.length
      ? tariff.prices.find((p: any) => p.currency === currency) ||
        tariff.prices[0]
      : { value: 0, currency: currency };

  // confirm buy
  const handlePurchase = async () => {
    if (!selectedTariff) return;
    if (!user.id) {
      toast.error(t("userNotFound") || "Foydalanuvchi aniqlanmadi!");
      return;
    }
    purchaseMutation.mutate(
      { tariffId: selectedTariff.id, userId: user.id },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          toast.success(
            t("purchaseSuccess") || "Tarif muvaffaqiyatli sotib olindi!"
          );
        },
        onError: () => {
          toast.error(t("purchaseError") || "Xatolik yuz berdi!");
        },
      }
    );
  };

  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("mlm_token");

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!tariffs.length) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">
          {t("noTariffs") || "Tariflar topilmadi"}
        </h2>
        <p className="text-muted-foreground">
          {t("noTariffsDesc") || "Hozircha tariflar mavjud emas."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-3xl font-bold mb-4">{t("tariffs")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("chooseTariffDesc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tariffs.map((tariff: any, index: number) => {
          const translation = getTranslation(tariff);

          const features =
            typeof translation.features === "string"
              ? translation.features
                  .split(/[\n,;]/)
                  .map((f: string) => f.trim())
                  .filter(Boolean)
              : Array.isArray(translation.features)
              ? translation.features
              : [];
          const usage =
            typeof translation.usage === "string"
              ? translation.usage
                  .split(/[\n,;]/)
                  .map((f: string) => f.trim())
                  .filter(Boolean)
              : Array.isArray(translation.usage)
              ? translation.usage
              : [];

          return (
            <Card
              key={tariff.id}
              className="overflow-hidden shadow-lg flex flex-col justify-between hover:cursor-pointer hover:scale-105 transition-all hover:shadow-2xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-56">
                <Image
                  src={tariff.photo_url || "/placeholder.svg"}
                  alt={translation?.name || "Tariff image"}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{translation?.name}</CardTitle>
                <CardDescription>{translation?.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("productPrice")}:
                    </p>
                    <p className="font-medium">
                      {tariff?.coin ? tariff.coin : " - "} 🟡{" "}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("incomeDuration")}:
                    </p>
                    <p className="font-medium">
                      {tariff.term
                        ? `${tariff.term} ${t("days")}`
                        : t("noDuration") || "Muddat yo'q"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("referralBonus")}:
                    </p>
                    <p className="font-medium">
                      {tariff.referral_bonus !== undefined
                        ? `${tariff.referral_bonus}%`
                        : t("noReferralBonus") || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("dailyIncome")}:
                    </p>
                    <p className="font-medium">
                      {tariff.dailyProfit !== undefined
                        ? `${tariff.dailyProfit} coin`
                        : "-"}
                    </p>
                  </div>
                </div>
                {translation.longDescription && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("longDescription")}:
                    </p>
                    <p className="font-medium">{translation.longDescription}</p>
                  </div>
                )}
                {features.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("features")}:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {features.map((f: string, i: number) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {usage.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("usage")}:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      {usage.map((u: string, i: number) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  data-aos="zoom-in"
                  aria-label={t("buyTariff")}
                  title={!tariff.coin ? t("coinUnavailable") : ""}
                  disabled={!tariff.coin}
                  onClick={() => {
                    if (!tariff.coin) return;
                    if (!isLoggedIn) {
                      setLoginModalOpen(true);
                      return;
                    }
                    setSelectedTariff(tariff);
                    setConfirmOpen(true);
                  }}
                >
                  {!tariff.coin ? t("coinUnavailable") : t("purchase")}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Sotib olishni tasdiqlash MODAL */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("purchaseConfirmTitle") || "Tarif sotib olish"}
            </DialogTitle>
            <DialogDescription>
              {selectedTariff && (
                <>
                  <b>{getTranslation(selectedTariff).name}</b> —{" "}
                  {selectedTariff.coin}
                  <br />
                  {t("purchaseConfirmDesc") ||
                    "Ushbu tarifni sotib olmoqchimisiz?"}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={purchaseMutation.isPending}
            >
              {t("cancel")}
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={handlePurchase}
              disabled={purchaseMutation.isPending}
            >
              {purchaseMutation.isPending
                ? t("processing") || "Yuklanmoqda..."
                : t("confirm") || "Tasdiqlash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* login Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("loginRequired") || "Login talab qilinadi"}
            </DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            {t("loginForBuyTariff") ||
              "Tarif sotib olish uchun avval tizimga kiring."}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoginModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={() => {
                setLoginModalOpen(false);
                window.location.href = "/login";
              }}
            >
              {t("login") || "Login"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
