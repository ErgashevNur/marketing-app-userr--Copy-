"use client";

import type React from "react";

import { useState } from "react";
import { Check, Clock, DollarSign, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/utils";

// Mock data
const mockWithdrawalData = {
  balance: 1500,
  minimumAmount: 200,
  history: [
    { id: 1, amount: 500, status: "processed", date: "2023-05-01" },
    { id: 2, amount: 300, status: "pending", date: "2023-05-15" },
    { id: 3, amount: 700, status: "processed", date: "2023-04-20" },
  ],
};

export default function WithdrawalPage() {
  const { t, currency } = useLanguage();
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const amountValue = Number.parseFloat(amount);
    if (isNaN(amountValue) || amountValue < mockWithdrawalData.minimumAmount) {
      toast({
        title: "Error",
        description: `Minimum withdrawal amount is ${formatCurrency(
          mockWithdrawalData.minimumAmount,
          currency
        )}`,
        variant: "destructive",
      });
      return;
    }

    if (amountValue > mockWithdrawalData.balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });
      setCardNumber("");
      setAmount("");
    }, 1500);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Format with spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");

    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const getMaskedCardNumber = () => {
    if (!cardNumber) return "";
    if (showCardNumber) return cardNumber;

    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 8) return cardNumber; // Don't mask if too short

    const firstFour = digits.substring(0, 4);
    const lastFour = digits.substring(digits.length - 4);
    const middleLength = digits.length - 8;
    const maskedMiddle = "*".repeat(middleLength);

    // Format with spaces
    return `${firstFour} ${maskedMiddle
      .replace(/(.{4})/g, "$1 ")
      .trim()} ${lastFour}`.trim();
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle>{t("withdrawal")}</CardTitle>
              <CardDescription>
                {t("minimumAmount")}:{" "}
                {formatCurrency(mockWithdrawalData.minimumAmount, currency)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdrawal} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="card-number">{t("cardNumber")}</Label>
                  <div className="relative">
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={getMaskedCardNumber()}
                      onChange={handleCardNumberChange}
                      className="bg-secondary/10 pr-10 font-mono"
                      data-aos="fade-up"
                      data-aos-delay="100"
                      maxLength={19} // 16 digits + 3 spaces
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowCardNumber(!showCardNumber)}
                    >
                      {showCardNumber ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 bg-secondary/10"
                      data-aos="fade-up"
                      data-aos-delay="200"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Available balance:{" "}
                    {formatCurrency(mockWithdrawalData.balance, currency)}
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  {isLoading ? "Processing..." : t("requestWithdrawal")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card data-aos="fade-up" data-aos-delay="100">
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWithdrawalData.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">
                        {formatCurrency(item.amount, currency)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        item.status === "processed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {item.status === "processed" ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {t(item.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
