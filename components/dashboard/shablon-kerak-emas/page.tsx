"use client";

import type React from "react";

import { useState } from "react";
import { User, Mail, Phone, CreditCard, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { CardManagement } from "@/components/profile/card-management";
import { ChangePassword } from "@/components/profile/change-password";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { EarningsChart } from "@/components/dashboard/earnings-chart";
import { ReferralShare } from "@/components/dashboard/referral-share";
import { formatCurrency } from "@/lib/utils";

// Mock user data
const mockUserData = {
  id: "USR12345678",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  cardNumber: "4242 4242 4242 4242",
  avatar: "/placeholder.svg?height=100&width=100",
};

export default function ProfilePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState(mockUserData.name);
  const [email, setEmail] = useState(mockUserData.email);
  const [phone, setPhone] = useState(mockUserData.phone);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated",
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" data-aos="fade-up">
          {t("dashboard")}
        </h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <TabsTrigger
              value="profile"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {t("profile")}
            </TabsTrigger>
            <TabsTrigger
              value="earnings"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {t("earnings")}
            </TabsTrigger>
            <TabsTrigger
              value="referrals"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {t("referrals")}
            </TabsTrigger>
            <TabsTrigger
              value="withdrawal"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              {t("withdrawal")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="space-y-8">
                  <div data-aos="fade-up">
                    <AvatarUpload initialAvatar={mockUserData.avatar} />
                  </div>
                  <Card data-aos="fade-up" data-aos-delay="100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Fingerprint className="h-5 w-5" />
                        {t("userId")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-mono text-center">
                        {mockUserData.id}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="md:col-span-2 space-y-8">
                <Card data-aos="fade-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {t("profile")} {t("information")}
                    </CardTitle>
                    <CardDescription>
                      {isEditing
                        ? t("editPersonalInfo")
                        : t("yourPersonalInfo")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("name")}</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t("phone")}</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("name")}
                            </p>
                            <p className="font-medium">{name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Email
                            </p>
                            <p className="font-medium">{email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {t("phone")}
                            </p>
                            <p className="font-medium">{phone}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {isEditing ? (
                      <div className="flex gap-2 w-full">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1"
                        >
                          {t("cancel")}
                        </Button>
                        <Button onClick={handleSaveProfile} className="flex-1">
                          {t("saveProfile")}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="w-full"
                      >
                        {t("editProfile")}
                      </Button>
                    )}
                  </CardFooter>
                </Card>

                <div data-aos="fade-up" data-aos-delay="100">
                  <CardManagement initialCardNumber={mockUserData.cardNumber} />
                </div>

                <div data-aos="fade-up" data-aos-delay="200">
                  <ChangePassword />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-8">
            <EarningsChart />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-8">
            <Card data-aos="fade-up">
              <CardHeader>
                <CardTitle>{t("referrals")}</CardTitle>
                <CardDescription>{t("invitedFriends")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("totalReferrals")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">24</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("activeReferrals")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">18</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {t("referralEarnings")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">$1,240</p>
                    </CardContent>
                  </Card>
                </div>

                <ReferralShare />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawal" className="space-y-8">
            <WithdrawalTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function WithdrawalTab() {
  const { t, currency } = useLanguage();
  const { toast } = useToast();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);

  // Mock data
  const mockWithdrawalData = {
    balance: 1500,
    minimumAmount: 200,
    cards: [
      { id: "1", number: "4242 4242 4242 4242", type: "Visa" },
      { id: "2", number: "5555 5555 5555 4444", type: "Mastercard" },
    ],
    history: [
      {
        id: 1,
        amount: 500,
        status: "processed",
        date: "2023-05-01T14:30:45Z",
        card: "**** 4242",
      },
      {
        id: 2,
        amount: 300,
        status: "pending",
        date: "2023-05-15T09:15:22Z",
        card: "**** 4444",
      },
      {
        id: 3,
        amount: 700,
        status: "processed",
        date: "2023-04-20T16:45:10Z",
        card: "**** 4242",
      },
    ],
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCard || !amount) {
      toast({
        title: "Error",
        description: "Please select a card and enter an amount",
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
        title: "Withdrawal Request Submitted",
        description: t("withdrawalPendingApproval"),
      });
      setAmount("");
    }, 1500);
  };

  const getMaskedCardNumber = (cardNumber: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
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
                <Label>{t("selectCard")}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockWithdrawalData.cards.map((card) => (
                    <div
                      key={card.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedCard === card.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedCard(card.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{card.type}</p>
                          <p className="font-mono text-sm">
                            {getMaskedCardNumber(card.number)}
                          </p>
                        </div>
                        <CreditCard
                          className={`h-5 w-5 ${
                            selectedCard === card.id
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                  <div
                    className="border border-dashed rounded-lg p-4 cursor-pointer hover:border-primary/50 flex items-center justify-center"
                    onClick={() => setSelectedCard("new")}
                  >
                    <p className="text-muted-foreground">{t("addNewCard")}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">{t("amount")}</Label>
                <div className="relative">
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
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    {currency}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("availableBalance")}:{" "}
                  <span className="font-medium">
                    {formatCurrency(mockWithdrawalData.balance, currency)}
                  </span>
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                {isLoading ? t("processing") : t("requestWithdrawal")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card data-aos="fade-up" data-aos-delay="100">
          <CardHeader>
            <CardTitle>{t("withdrawalHistory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWithdrawalData.history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {formatCurrency(item.amount, currency)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(item.date)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.card}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        item.status === "processed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {t(item.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
