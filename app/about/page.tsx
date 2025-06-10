"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl font-bold mb-4">{t("aboutUs")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("aboutUsDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div data-aos="fade-right">
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="https://picsum.photos/id/20/800/600"
                alt="About MLM Platform"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center" data-aos="fade-left">
            <h2 className="text-2xl font-bold mb-4">{t("ourMission")}</h2>
            <p className="mb-4">{t("ourMissionDesc")}</p>
            <p>{t("ourMissionDesc2")}</p>
          </div>
        </div>

        <div className="mb-12" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {t("howItWorks")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card data-aos="fade-up" data-aos-delay="100">
              <CardHeader>
                <CardTitle>1. {t("joinUs")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("joinUsDesc")}</p>
              </CardContent>
            </Card>
            <Card data-aos="fade-up" data-aos-delay="200">
              <CardHeader>
                <CardTitle>2. {t("chooseTariff")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("chooseTariffDesc")}</p>
              </CardContent>
            </Card>
            <Card data-aos="fade-up" data-aos-delay="300">
              <CardHeader>
                <CardTitle>3. {t("earnMoney")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("earnMoneyDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-6">{t("readyToStart")}</h2>
          <p className="mb-6 max-w-2xl mx-auto">{t("readyToStartDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" data-aos="zoom-in" data-aos-delay="100">
              <Link href="/register">{t("getStarted")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <Link href="/tariffs">{t("viewTariffs")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
