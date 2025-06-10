"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Fingerprint,
  Users,
  Clock,
  DollarSign,
  Upload,
  Settings,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardManagement } from "@/components/profile/card-management";
import { ChangePassword } from "@/components/profile/change-password";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { EarningsChart } from "@/components/dashboard/earnings-chart";
import { ReferralShare } from "@/components/dashboard/referral-share";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { TariffCountdown } from "../../components/dashboard/TariffCountdown";
import { BalanceTab } from "../../components/dashboard/BalanceTab";
import SpinPage from "../spin/page";
import { ReferralList } from "@/components/dashboard/ReferralList";
// import { fetchReferrals } from "@/api/api";

// Mock data
const mockUserData = {
  name: "John Doe",
  id: "USR12345678",
  email: "example@gmail.com",
  cardNumber: "4242 4242 4242 4242",
  avatar: "https://picsum.photos/id/10/400/400",
  phone: "+1234567890",
  activeTariff: "Gold",
  daysRemaining: 25,
  dailyEarnings: 15,
  monthlyEarnings: 450,
  totalEarnings: 5400,
  totalReferrals: 12,
  activeTariffsCount: 3,
  referrals: [
    { id: 1, name: "Alice Smith", status: "paid", date: "2023-05-10" },
    { id: 2, name: "Bob Johnson", status: "pending", date: "2023-05-15" },
    { id: 3, name: "Charlie Brown", status: "paid", date: "2023-05-20" },
    { id: 4, name: "David Wilson", status: "paid", date: "2023-05-25" },
  ],
  tariffs: [
    {
      id: 1,
      name: "start",
      price: 250000,
      duration: 30,
      dailyProfit: 10,
      description:
        "Yangi boshlovchilar uchun asosiy tarif. Ushbu tarif minimal sarmoya bilan barqaror daromad olish imkonini beradi.",
      features: [
        "Minimal sarmoya",
        "30 kunlik daromad",
        "Kundalik 10 UZS foyda",
      ],
      images: [
        "https://picsum.photos/id/1/400/300",
        "https://picsum.photos/id/2/400/300",
        "https://picsum.photos/id/3/400/300",
      ],
      startDate: "2023-01-01T00:00:00Z",
      endDate: "2027-01-31T23:59:59Z",
    },
    {
      id: 2,
      name: "silver",
      price: 500000,
      duration: 60,
      dailyProfit: 20,
      description:
        "O‘rta darajadagi foydalanuchilar uchun mos tarif. Bu tarif o‘rtacha sarmoya bilan barqaror daromad olish imkonini beradi.",
      features: [
        "O‘rtacha sarmoya",
        "60 kunlik daromad",
        "Kundalik 20 UZS foyda",
      ],
      images: [
        "https://picsum.photos/id/4/400/300",
        "https://picsum.photos/id/5/400/300",
        "https://picsum.photos/id/6/400/300",
      ],
      startDate: "2023-02-01T00:00:00Z",
      endDate: "2023-03-02T23:59:59Z",
    },
    {
      id: 3,
      name: "gold",
      price: 1000000,
      duration: 90,
      dailyProfit: 40,
      description:
        "Professional foydalanuvchilar uchun premium tarif. Ushbu tarif yuqori daromad olish imkonini beradi.",
      features: [
        "Yuqori sarmoya",
        "90 kunlik daromad",
        "Kundalik 40 UZS foyda",
      ],
      images: [
        "https://picsum.photos/id/7/400/300",
        "https://picsum.photos/id/8/400/300",
        "https://picsum.photos/id/9/400/300",
      ],
      startDate: "2023-03-03T00:00:00Z",
      endDate: "2023-05-31T23:59:59Z",
    },
  ],
  faq: [
    {
      question: "Platformadan foydalanish qanday boshlanadi?",
      answer:
        "Ro‘yxatdan o‘tib, o‘zingizga mos tarifni tanlang va to‘lovni amalga oshiring.",
    },
    {
      question: "Daromadni qanday olish mumkin?",
      answer:
        "Daromadingiz har kuni hisobingizga qo‘shiladi va uni istalgan vaqtda yechib olishingiz mumkin.",
    },
    {
      question: "Referal tizimi qanday ishlaydi?",
      answer:
        "Do‘stlaringizni taklif qiling va ularning har bir to‘lovidan foiz oling.",
    },
  ],
};

export default function ProfilePage() {
  const { t, currency } = useLanguage();
  // const { toast } = useToast();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("referrals");
  const [showPaymentTimer, setShowPaymentTimer] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showUploadTimer, setShowUploadTimer] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: number]: number;
  }>({});
  const [profileData, setProfileData] = useState({
    name: mockUserData.name,
    phone: mockUserData.phone,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [settingsEmail, setSettingsEmail] = useState(mockUserData.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [user, setUser] = useState<any>(null);

  // LocalStorage tekshirish va redirect
  useEffect(() => {
    function checkUser() {
      const user = localStorage.getItem("mlm_user");
      if (!user) {
        router.push("/");
      } else {
        try {
          setUser(JSON.parse(user));
        } catch {
          setUser(null);
        }
      }
    }

    checkUser();

    // Boshqa tablarda login/logout bo‘lsa ham tekshir
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, [router]);

  const handleSaveProfile = () => {
    toast("Your profile information has been updated");
    setIsEditing(false);
  };

  const handlePayClick = (tariff: any) => {
    setSelectedTariff(tariff);
    setShowPaymentTimer(true);
    setShowCardNumber(false);
    setShowUploadTimer(false);

    setTimeout(() => {
      setShowPaymentTimer(false);
      setShowCardNumber(true);

      setTimeout(() => {
        setShowCardNumber(false);
        setShowUploadTimer(true);
      }, 10000);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!uploadedFile) {
      toast("Iltimos, fayl tanlang");
      return;
    }

    toast("To‘lov cheki muvaffaqiyatli yuklandi");

    setUploadedFile(null);
    setShowUploadTimer(false);
    setSelectedTariff(null);
  };

  const handleCarouselChange = (
    tariffId: number,
    direction: "next" | "prev"
  ) => {
    const tariffImages =
      mockUserData.tariffs.find((t) => t.id === tariffId)?.images || [];
    const currentIndex = currentImageIndex[tariffId] || 0;
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= tariffImages.length) newIndex = 0;
    if (newIndex < 0) newIndex = tariffImages.length - 1;
    setCurrentImageIndex((prev) => ({ ...prev, [tariffId]: newIndex }));
  };

  const handleProfileUpdate = () => {
    toast("Profil ma’lumotlari yangilandi");
  };

  const handlePasswordChange = () => {
    toast("Parol muvaffaqiyatli o‘zgartirildi");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    setTimeout(() => {
      setIsChangingPassword(false);
      toast("Sizning parolingiz muvaffaqiyatli o‘zgartirildi");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1500);
  };

  return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-black dark:to-[#1A2A3A]">
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 " data-aos="fade-up">
            {t("dashboard")}
          </h1>

          <Tabs
            defaultValue="referrals"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2 md:h-12 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
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
                value="spinner"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                {t("daylyEarnings")}
              </TabsTrigger>

              <TabsTrigger
                value="balance"
                data-aos="fade-up"
                data-aos-delay="450"
              >
                Balans
              </TabsTrigger>

              <TabsTrigger
                value="profile"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {t("profile")}
              </TabsTrigger>

              <TabsTrigger
                value="support"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                Yordam
              </TabsTrigger>
            </TabsList>

            <TabsContent value="referrals" className="space-y-8">
              <ReferralList t={t} />
            </TabsContent>

            <TabsContent value="profile" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="space-y-8">
                    {/* <div data-aos="fade-up">
                      <AvatarUpload initialAvatar={mockUserData.avatar} />
                    </div> */}
                    <Card
                      data-aos="fade-up"
                      data-aos-delay="100"
                      className="shadow-lg"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 ">
                          <Fingerprint className="h-5 w-5" />
                          {t("userId")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-mono text-center ">
                          {user?.id || "Unknown User Id"}
                        </p>
                        {/* Joriy tarifga qancha vaqt qolganini ko‘rsatish */}
                        {mockUserData.tariffs.length > 0 && (
                          <div className="mt-2 flex justify-center">
                            <TariffCountdown
                              startDate={
                                mockUserData.tariffs[0].startDate || new Date()
                              }
                              endDate={mockUserData.tariffs[0].endDate}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-8">
                  <Card
                    data-aos="fade-up"
                    // className="bg-white dark:bg-[#111827] shadow-lg"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 ">
                        <User className="h-5 w-5" />
                        {t("profile")} {t("information")}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {isEditing
                          ? t("editPersonalInfo")
                          : t("yourPersonalInfo")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("name")}
                              </p>
                              <p className="font-medium text-black dark:text-white">
                                {user?.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Email
                              </p>
                              <p className="font-medium text-black dark:text-white">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                          {/* Telefon raqam olib tashlandi */}
                        </div>
                      }
                    </CardContent>

                    <div className="flex  items-center gap-4 p-4">
                      <div className="pl-10">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {t("firstSignDate")}
                        </p>
                        <p className="font-medium text-black dark:text-white">
                          {user?.createdAt}
                        </p>
                      </div>
                    </div>

                    {/* <CardFooter>
                      {isEditing ? (
                        <div className="flex gap-2 w-full">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 dark:bg-primary/10 dark:text-primary bg-red-400 dark:hover:bg-red-400 dark:hover:text-white  shadow-lg border-none  hover:bg-gray-300 text-white hover:text-black"
                          >
                            {t("cancel")}
                          </Button>
                          <Button
                            onClick={handleSaveProfile}
                            className="flex-1 "
                          >
                            {t("saveProfile")}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="destructive"
                          onClick={() => setIsEditing(true)}
                          className="w-full bg-accent-teal/10 text-accent-teal hover:bg-accent-teal/20 shadow-lg border-none"
                        >
                          {t("editProfile")}
                        </Button>
                      )}
                    </CardFooter> */}
                  </Card>

                  {/* <div data-aos="fade-up" data-aos-delay="100">
                    <CardManagement
                      initialCardNumber={mockUserData.cardNumber}
                    />
                  </div> */}

                  {/* <div data-aos="fade-up" data-aos-delay="200">
                    <ChangePassword />
                  </div> */}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-8">
              <EarningsChart />
            </TabsContent>

            <TabsContent value="spinner" className="space-y-8">
              <SpinPage />
            </TabsContent>

            {/* 
            <TabsContent value="withdrawal" className="space-y-8">
              <WithdrawalTab />
            </TabsContent> */}

            <TabsContent value="balance" className="space-y-8">
              <BalanceTab userId={mockUserData.id} coin={user?.coin} />
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <Card
                data-aos="fade-up"
                className="bg-white dark:bg-[#111827] shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-black dark:text-white">
                    Yordam
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Tez-tez so‘raladigan savollar va qo‘llab-quvvatlash bilan
                    bog‘lanish.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    {mockUserData.faq.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-black dark:text-white">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <div className="text-center">
                    <Button
                      asChild
                      className="bg-[#00FF99] text-white hover:bg-[#00FF99]/90"
                    >
                      <Link href="/support">
                        Qo‘llab-quvvatlash bilan bog‘lanish
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function WithdrawalTab() {
  const { t, currency } = useLanguage();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);

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
      toast.error("Please select a card and enter an amount");
      return;
    }

    const amountValue = Number.parseFloat(amount);
    if (isNaN(amountValue) || amountValue < mockWithdrawalData.minimumAmount) {
      toast.error(
        `Minimum withdrawal amount is ${formatCurrency(
          mockWithdrawalData.minimumAmount,
          currency
        )}`
      );
      return;
    }

    if (amountValue > mockWithdrawalData.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Withdrawal Request Submitted");
      setAmount("");
    }, 1500);
  };

  const getMaskedCardNumber = (cardNumber: string) => {
    if (!cardNumber) return "";
    if (showCardNumber) return cardNumber;

    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 8) return cardNumber;

    const firstFour = digits.substring(0, 4);
    const lastFour = digits.substring(digits.length - 4);
    const middleLength = digits.length - 8;
    const maskedMiddle = "*".repeat(middleLength);

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
        <Card
          data-aos="fade-up"
          className="bg-white dark:bg-[#111827] shadow-lg"
        >
          <CardHeader>
            <CardTitle className="text-black dark:text-white">
              {t("withdrawal")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {t("minimumAmount")}:{" "}
              {formatCurrency(mockWithdrawalData.minimumAmount, currency)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdrawal} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-black dark:text-white">
                  {t("selectCard")}
                </Label>
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
                          <p className="font-medium text-black dark:text-white">
                            {card.type}
                          </p>
                          <p className="font-mono text-sm text-black dark:text-white">
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
                <Label htmlFor="amount" className="text-black dark:text-white">
                  {t("amount")}
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 bg-secondary/10 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    {currency}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("availableBalance")}:{" "}
                  <span className="font-medium">
                    {formatCurrency(mockWithdrawalData.balance, currency)}
                  </span>
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#00FF99] text-white hover:bg-[#00FF99]/90"
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
        <Card
          data-aos="fade-up"
          data-aos-delay="100"
          className="bg-white dark:bg-[#111827] shadow-lg"
        >
          <CardHeader>
            <CardTitle className="text-black dark:text-white">
              {t("withdrawalHistory")}
            </CardTitle>
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
                      <p className="font-medium text-black dark:text-white">
                        {formatCurrency(item.amount, currency)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(item.date)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
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

interface CardManagementProps {
  initialCardNumber: string;
}

interface UserData {
  id: string | number;
  email: string;
  cardNumber: string | number;
  name: string;
  phone: string;
  activeTariff: string;
  daysRemaining: number;
  dailyEarnings: number;
  monthlyEarnings: number;
  totalEarnings: number;
  totalReferrals: number;
  activeTariffsCount: number;
  referrals: Array<{
    id: number;
    name: string;
    status: string;
    date: string;
  }>;
  tariffs: Array<{
    id: number;
    name: string;
    price: number;
    duration: number;
    dailyProfit: number;
    description: string;
    features: string[];
    images: string[];
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}
