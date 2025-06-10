"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { Gift, Loader2, Smile } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/utils";

// Mock API response structure (replace with actual API response structure)
interface Bonus {
  id: number;
  reward: string;
  date: string;
  status: string;
}

// Mock data for initial testing
const mockBonuses: Bonus[] = [
  // {
  //   id: 1,
  //   reward: "10 Coins",
  //   date: "2025-06-04T10:00:00Z",
  //   status: "claimed",
  // },
  // { id: 2, reward: "5 USD", date: "2025-06-03T15:30:00Z", status: "claimed" },
  // {
  //   id: 3,
  //   reward: "Free Spin",
  //   date: "2025-06-02T12:15:00Z",
  //   status: "claimed",
  // },
];

export default function DailyBonus() {
  const { t, currency } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [currentBonus, setCurrentBonus] = useState<Bonus | null>(null);
  const [bonusHistory, setBonusHistory] = useState<Bonus[]>(mockBonuses);
  const [error, setError] = useState<string | null>(null);

  // State for manual bonus addition
  const [newBonus, setNewBonus] = useState<Bonus>({
    id: Date.now(),
    reward: "",
    date: new Date().toISOString(),
    status: "claimed",
  });

  // Fetch daily bonus from API
  const fetchDailyBonus = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentBonus(null);

    try {
      const response = await fetch("https://mlm-backend.pixl.uz/spin/value", {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("mlm_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch daily bonus");
      }

      const data = await response.json();
      console.log("API response data:", data);

      // Handle different possible response shapes
      let bonus: Bonus | null = null;
      if (Array.isArray(data) && data.length > 0) {
        bonus = data[0];
      } else if (data && typeof data === "object") {
        if ("bonus" in data) {
          bonus = data.bonus;
        } else if ("data" in data) {
          bonus = data.data;
        } else if ("reward" in data && "date" in data) {
          bonus = data as Bonus;
        }
      }

      if (!bonus) {
        setError("No bonus found.");
        toast.error("No bonus found.");
        setIsLoading(false);
        return;
      }

      // Prevent duplicate bonus for the same id or date
      setCurrentBonus(bonus);
      setBonusHistory((prev) => {
        const exists = prev.some(
          (b) => b.id === bonus!.id || b.date === bonus!.date
        );
        if (exists) return prev;
        return [bonus!, ...prev].slice(0, 30); // 30 ta tarixgacha saqlash
      });
      toast.success(`Bonus Claimed: ${bonus.reward}`);
    } catch (err) {
      setError("Failed to claim daily bonus. Please try again.");
      toast.error("Error claiming bonus");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(bonusHistory);
  console.log(currentBonus);

  // Format date for display with validation and locale support
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return t("invalidDate");
      }
      return new Intl.DateTimeFormat(t("locale") || "default", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // Use UTC to avoid timezone issues
      }).format(date);
    } catch {
      return t("invalidDate");
    }
  };

  // Handle input changes for manual bonus
  const handleNewBonusChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBonus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle manual bonus submit
  const handleAddBonus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBonus.reward || !newBonus.date || !newBonus.status) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const response = await fetch("https://mlm-backend.pixl.uz/bonus/daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("mlm_token")}`,
        },
        body: JSON.stringify({
          reward: newBonus.reward,
          date: newBonus.date,
          status: newBonus.status,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to add bonus");
        return;
      }

      const data = await response.json();
      // Optionally, use the response data as the new bonus
      setBonusHistory((prev) => [{ ...data, id: Date.now() }, ...prev]);
      toast.success(`Bonus added: ${data.reward || newBonus.reward}`);
      setNewBonus({
        id: Date.now(),
        reward: "",
        date: new Date().toISOString(),
        status: "claimed",
      });
    } catch (err) {
      toast.error("Error adding bonus");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Add Bonus Manually Section */}
        {/* <Card className="bg-white dark:bg-[#22223b] shadow-lg border border-[#00FF99]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Qo'shimcha Bonus Qo'shish
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col md:flex-row gap-4 items-center"
              onSubmit={handleAddBonus}
            >
              <input
                type="text"
                name="reward"
                placeholder="Bonus nomi (masalan: 10 Coins)"
                value={newBonus.reward}
                onChange={handleNewBonusChange}
                className="border rounded px-3 py-2 w-full md:w-1/3"
              />
              <input
                type="datetime-local"
                name="date"
                value={newBonus.date.slice(0, 16)}
                onChange={handleNewBonusChange}
                className="border rounded px-3 py-2 w-full md:w-1/3"
              />
              <select
                name="status"
                value={newBonus.status}
                onChange={handleNewBonusChange}
                className="border rounded px-3 py-2 w-full md:w-1/6"
              >
                <option value="claimed">Claimed</option>
                <option value="pending">Pending</option>
              </select>
              <Button
                type="submit"
                className="bg-[#00FF99] text-white px-6 py-2 rounded-full"
              >
                Qo'shish
              </Button>
            </form>
          </CardContent>
        </Card> */}

        {/* Bonus Claim Section */}
        <Card className="bg-white dark:bg-[#111827] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
              <Gift className="h-6 w-6" />
              {/* {t("dailyBonus")} */}
              Daily Bonus
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="relative flex justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center transition-all duration-500">
                <div className="w-56 h-56 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : currentBonus ? (
                    <div>
                      <p className="text-2xl font-bold text-black dark:text-white">
                        {currentBonus.reward}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(currentBonus.date)}
                      </p>
                    </div>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {t("claimYourBonus")}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={fetchDailyBonus}
              disabled={isLoading}
              className="bg-[#00FF99] text-white hover:bg-[#00FF99]/90 px-8 py-3 text-lg rounded-full shadow-lg transform transition-transform hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Gift className="mr-2 h-5 w-5" />
              )}
              {
                isLoading
                  ? // t("claiming")
                    "Climing"
                  : "Claim Bonus"
                // t("claimBonus")
              }
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-3 justify-center">
              {/* {t("dailyBonusDescription")} */}
              Click this button and get your daily bonu <Smile />
            </p>
          </CardContent>
        </Card>

        {/* Bonus History Section */}
        <Card className="bg-white dark:bg-[#111827] shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-black dark:text-white">
              {/* {t("bonusHistory")} */}
              Bonus History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bonusHistory.length > 0 ? (
              <div className="space-y-4 w-96">
                {bonusHistory.map((bonus, idx) => (
                  <div
                    key={`${bonus.id}-${bonus.date}-${idx}`}
                    className="flex justify-between items-center border-b pb-2 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-black dark:text-white">
                        {bonus.reward}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(bonus.date)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {t("status")}: {t(bonus.status)}
                      </p>
                    </div>
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mx-auto max-w-96 w-full text-center py-8 dark:text-gray-300">
                No Bonus History
                {/* {t("noBonusHistory")} */}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
