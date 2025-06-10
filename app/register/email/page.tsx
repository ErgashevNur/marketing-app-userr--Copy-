"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { registerUser } from "@/lib/api";
import { toast } from "sonner";

export default function EmailRegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  // const { toast } = useToast();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [referal, setReferal] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(180);
  const [isTimerExpired, setIsTimerExpired] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isVerifying && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsTimerExpired(true);
    }

    return () => clearInterval(interval);
  }, [isVerifying, timer]);

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !name) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Referalni localStorage'dan oling
      let referal = "";
      if (typeof window !== "undefined") {
        const ref = localStorage.getItem("mlm-referal");
        if (ref && ref.trim() !== "") {
          referal = ref;
        }
        localStorage.removeItem("mlm-referal");
      }

      const userData = {
        name,
        email,
        password,
        ...(referal ? { referal } : {}), // faqat referal bo'lsa qo'sh
      };

      const result = await registerUser(userData);

      toast.success(
        result?.description ||
          "Emailga kod yuborildi. 3 minut ichida tasdiqlang."
      );

      setIsVerifying(true);
      setTimer(180);
      setIsTimerExpired(false);
    } catch (error) {
      toast.error("Ro‘yxatdan o‘tishda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast("Ro‘yxatdan o‘tish muvaffaqiyatli");
      router.push("/dashboard");
    }, 1500);
  };

  const formattedTime = `${Math.floor(timer / 60)}:${(timer % 60)
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("register")}
          </CardTitle>
          <CardDescription className="text-center">
            {isVerifying
              ? `Tasdiqlash kodi yuborildi. Qolgan vaqt: ${formattedTime}`
              : t("register")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isVerifying ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm {t("password")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Yuborilmoqda..." : "Send Verification Message"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {/* <div> */}
              {/* <Label htmlFor="verificationCode">Tasdiqlash kodi</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div> */}
              {/* <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Tekshirilmoqda..." : "Ro‘yxatdan o‘tish"}
              </Button> */}

              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={() => {
                  setIsVerifying(false);
                  setTimer(180);
                  setIsTimerExpired(false);
                }}
              >
                Ma’lumotlarni qayta kiritish
              </Button>

              <Button
                type="button"
                className="w-full"
                variant="secondary"
                disabled={!isTimerExpired}
                onClick={() => {
                  setIsVerifying(false);
                  setTimer(180);
                  setIsTimerExpired(false);
                }}
              >
                {isTimerExpired
                  ? "Qayta kod yuborish"
                  : `Qayta yuborish (${formattedTime})`}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            {t("login")}?{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("login")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
