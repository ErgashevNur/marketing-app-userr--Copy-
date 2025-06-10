"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      window.location.href = "/dashboard";
    }
  }, [countdown]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* baground animation details*/}
      <div className="absolute w-64 h-64 bg-primary/5 rounded-full -top-12 -right-12"></div>
      <div className="absolute w-96 h-96 bg-secondary/5 rounded-full -bottom-24 -left-24"></div>

      {/* animation circle */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-secondary/30 rounded-full animate-pulse delay-700"></div>
      <div className="absolute top-2/3 right-1/4 w-5 h-5 bg-accent/30 rounded-full animate-pulse delay-300"></div>

      <div className="max-w-md px-8 py-12 text-center z-10">
        {/* 404 text */}
        <div className="relative text-9xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary transition-all duration-500">
          <span
            className={`inline-block transition-all duration-300 ${
              isAnimating ? "transform -translate-y-2" : ""
            }`}
          >
            4
          </span>
          <span
            className={`inline-block transition-all duration-300 delay-150 ${
              isAnimating ? "transform translate-y-2" : ""
            }`}
          >
            0
          </span>
          <span
            className={`inline-block transition-all duration-300 delay-300 ${
              isAnimating ? "transform -translate-y-2" : ""
            }`}
          >
            4
          </span>

          {/* decoration element */}
          <div className="absolute -top-6 -right-6 w-12 h-12 border-t-4 border-r-4 border-primary/20"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-4 border-l-4 border-secondary/20"></div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Sahifa topilmadi</h1>
        <p className="text-muted-foreground mb-8">
          Siz qidirayotgan sahifa mavjud emas yoki boshqa joyga ko'chirilgan.
        </p>

        {/* auto redirect */}
        <div className="mb-8 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Bosh sahifaga avtomatik o'tish: {countdown} soniya</span>
          </div>
          <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${(countdown / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="default"
            className="gap-2"
            onClick={() => setCountdown(-1)} 
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              <span>Bosh sahifaga</span>
            </Link>
          </Button>


          <Button
            asChild
            variant="outline"
            className="gap-2"
            onClick={() => setCountdown(-1)}
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              <span>Orqaga qaytish</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
