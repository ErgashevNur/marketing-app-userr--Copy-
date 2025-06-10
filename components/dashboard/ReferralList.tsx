"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { ReferralShare } from "@/components/dashboard/referral-share";

interface Referral {
  id: number;
  name: string;
  status: "paid" | "pending" | string;
  date: string;
  earnings_coin?: number;
}

interface ReferralListProps {
  t: (key: string) => string;
}

export function ReferralList({ t }: ReferralListProps) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const userStr =
        typeof window !== "undefined" ? localStorage.getItem("mlm_user") : null;
      if (userStr) {
        const user = JSON.parse(userStr);
        setReferrals(user.referrals || []);
      } else {
        setReferrals([]);
      }
    } catch {
      setReferrals([]);
    }
    setLoading(false);
  }, []);

  const totalEarningsCoin = referrals.reduce(
    (sum, r) => sum + (r.earnings_coin || 0),
    0
  );

  return (
    <Card data-aos="fade-up" className="bg-white dark:bg-[#111827] shadow-lg">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">
          {t("referrals")}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {t("invitedFriends")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-white dark:bg-[#1a2635] shadow-md"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-black dark:text-white">
                {t("totalReferrals")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00FF99]">
                {loading ? "..." : referrals.length}
              </p>
            </CardContent>
          </Card>
          <Card
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-white dark:bg-[#1a2635] shadow-md"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-black dark:text-white">
                {t("activeReferrals")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00FF99]">
                {loading
                  ? "..."
                  : referrals.filter((r) => r.status === "paid").length}
              </p>
            </CardContent>
          </Card>
          <Card
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-white dark:bg-[#1a2635] shadow-md"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-black dark:text-white">
                {t("referralEarnings")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00FF99]">
                {loading ? "..." : `${totalEarningsCoin} coin`}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground">
              {t("loadingReferrals") || "Referallar yuklanmoqda..."}
            </div>
          ) : referrals.length === 0 ? (
            <Card className="text-center text-gray-500 py-8">
              <CardTitle className="mb-2">
                {t("noReferrals") || "Referallar topilmadi."}
              </CardTitle>
              <CardDescription>
                {t("inviteFriends") ||
                  "Do‘stlaringizni taklif qiling va bonus oling!"}
              </CardDescription>
            </Card>
          ) : (
            referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-[#00FF99]" />
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      {referral.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(referral.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    referral.status === "paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  }`}
                >
                  {t(referral.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <ReferralShare />
      </CardFooter>
    </Card>
  );
}
