"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
// import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { loginUser } from "@/lib/api";
import { toast, Toaster } from "sonner";

export default function EmailLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  // const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const handleSendCode = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   // Simulate API call to send verification code to email
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setIsVerifying(true);
  //     toast({
  //       title: "Verification code sent",
  //       description: "Please check your email for the verification code.",
  //     });
  //   }, 1500);
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      toast.info("Login successful");
      localStorage.setItem("token", data.token);
      setIsLoading(false);
      router.push("/dashboard");
    } catch (error: any) {
      setIsLoading(false);
      if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
        toast.error("Tarmoqda xatolik. Iltimos, internetingizni tekshiring.");
      } else {
        toast.error("Invalid email or password.");
      }
      console.error("Login error:", error);
    }

    // Simulate API call to verify code and log in user
    // setTimeout(() => {
    //   setIsLoading(false)
    //   router.push("/dashboard")
    //   toast({
    //     title: "Login successful",
    //     description: "You have been logged in successfully.",
    //   })
    // }, 1500)
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <Toaster />
      <Card className="w-full max-w-md mx-auto" data-aos="fade-up">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("login")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("welcome")} {isVerifying ? t("verify") : t("login")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/10"
                data-aos="fade-up"
                data-aos-delay="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary/10"
                data-aos="fade-up"
                data-aos-delay="200"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              {isLoading ? "Sending code..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {t("register")}?{" "}
            <Link href="/register" className="text-primary hover:underline">
              {t("register")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
