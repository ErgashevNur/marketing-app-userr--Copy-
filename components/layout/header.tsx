"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { LanguageSwitcher } from "@/components/providers/language-switcher";
import { useLanguage } from "@/components/providers/language-provider";
import { fetchStatistic } from "@/lib/api";
import { toast } from "sonner";

// Statistikani tip bilan aniqlash
type StatEarning = {
  id: string;
  currency: string;
  amount: string;
  widgetId: string;
};
type RecentUser = {
  id: string;
  email: string;
  widgetId: string;
};
type Statistic = {
  id: string;
  onlineUserCount: number;
  totalEarned: string;
  statEarnings: StatEarning[];
  recentUsers: RecentUser[];
};

export default function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Statistika uchun
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [statIndex, setStatIndex] = useState(0);

  // Recent users carousel uchun
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("mlm_user"));
    }
  }, [pathname]);

  // Statistikani olish va har 1 daqiqada yangilash
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let statInterval: NodeJS.Timeout;

    const fetchUserCount = async () => {
      try {
        // API chaqiruv
        const data: Statistic[] = await fetchStatistic();
        setStatistics(data);
        setUserCount(data[statIndex]?.onlineUserCount ?? null);
      } catch (error) {
        toast.error("Error fetching statistics");
        setUserCount(null);
      }
    };

    fetchUserCount();

    // Har 1 daqiqada statistikani yangilash va indexni oshirish
    statInterval = setInterval(() => {
      setStatIndex((prev) => {
        const next = statistics.length > 0 ? (prev + 1) % statistics.length : 0;
        setUserCount(statistics[next]?.onlineUserCount ?? null);
        return next;
      });
    }, 600000);

    interval = setInterval(fetchUserCount, 100000);

    return () => {
      clearInterval(interval);
      clearInterval(statInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statIndex]);

  // Recent users carousel har 2 sekundda aylanadi
  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCarouselIndex((prev) => {
        const users = statistics[statIndex]?.recentUsers ?? [];
        return users.length > 0 ? (prev + 1) % users.length : 0;
      });
    }, 2000);
    return () => clearInterval(carouselTimer);
  }, [statistics, statIndex]);

  const isActive = (path: string) => pathname === path;

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", auth: true },
    { name: t("products"), href: "/products" },
    { name: t("tariffs"), href: "/tariffs" },
    { name: t("about"), href: "/about", guestOnly: true },
  ];

  // Recent users massivini olish
  const recentUsers = statistics[statIndex]?.recentUsers ?? [];

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    if (!domain) return "***";
    if (name.length <= 4) return "***@" + domain;
    const first = name.slice(0, 2);
    const last = name.slice(-2);
    const middle = "*".repeat(name.length - 4);
    return `${first}${middle}${last}@${domain}`;
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mlm_user");
      router.push("/login");
    }
  };

  // Pul birliklari uchun valyuta kurslari (mock yoki API dan)
  const CURRENCY_LIST = [
    {
      code: "UZS",
      name: {
        uz: "So'm",
        ru: "Сум",
        en: "UZS",
        kz: "Сом",
        kg: "Сом",
        tj: "Сомон",
        cn: "UZS",
      },
      symbol: "so'm",
    },
    {
      code: "USD",
      name: {
        uz: "Dollar",
        ru: "Доллар",
        en: "USD",
        kz: "Dollar",
        kg: "Dollar",
        tj: "Dollar",
        cn: "USD",
      },
      symbol: "$",
    },
    {
      code: "RUB",
      name: {
        uz: "Rubl",
        ru: "Рубль",
        en: "RUB",
        kz: "Рубль",
        kg: "Рубль",
        tj: "Рубль",
        cn: "RUB",
      },
      symbol: "₽",
    },
    {
      code: "KZT",
      name: {
        uz: "Tenge",
        ru: "Тенге",
        en: "KZT",
        kz: "Теңге",
        kg: "Теңге",
        tj: "Теңге",
        cn: "KZT",
      },
      symbol: "₸",
    },
    {
      code: "KGS",
      name: {
        uz: "Som",
        ru: "Сом",
        en: "KGS",
        kz: "Сом",
        kg: "Сом",
        tj: "Сом",
        cn: "KGS",
      },
      symbol: "сом",
    },
    {
      code: "TJS",
      name: {
        uz: "Somoni",
        ru: "Сомони",
        en: "TJS",
        kz: "Сомони",
        kg: "Сомони",
        tj: "Сомони",
        cn: "TJS",
      },
      symbol: "смн",
    },
    {
      code: "CNY",
      name: {
        uz: "Yuan",
        ru: "Юань",
        en: "CNY",
        kz: "Юань",
        kg: "Юань",
        tj: "Юань",
        cn: "¥",
      },
      symbol: "¥",
    },
  ];

  // Kurslarni olish (mock yoki API)
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({
    UZS: 1200,
    USD: 1,
    RUB: 90,
    KZT: 450,
    KGS: 89,
    TJS: 11,
    CNY: 7.2,
  });
  const [currencyLoading, setCurrencyLoading] = useState(false);

  // Foydalanuvchi tanlagan tilni aniqlash
  const { language } = useLanguage();

  // 1 coin narxini har bir valyutada hisoblash
  const getCoinComparisons = () => {
    return CURRENCY_LIST.map((c) => {
      const rate = currencyRates[c.code];
      return {
        code: c.code,
        value: rate ? rate.toLocaleString() : "-",
        symbol: c.symbol,
        name: c.name[language] || c.code,
      };
    });
  };

  return (
    <>
      <header className="bg-background border-b border-border z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0">
                <h1 className="md:text-2xl text-xl font-bold text-primary">
                  MLM Platform
                </h1>
              </Link>
              <nav className="hidden lg:ml-6 lg:flex md:space-x-4">
                {navigation
                  .filter(
                    (item) =>
                      // dashboard faqat login bo‘lsa
                      (item.href !== "/dashboard" || isLoggedIn) &&
                      // about faqat guest uchun
                      (!item.guestOnly || !isLoggedIn)
                  )
                  .map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 whitespace-nowrap rounded-md text-sm font-medium ${
                        isActive(item.href)
                          ? "bg-primary text-black"
                          : "text-foreground hover:bg-muted "
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 gap-4">
                {/* Foydalanuvchilar soni */}
                {userCount !== null ? (
                  <div className="flex items-center space-x-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="hidden xl:block">{`${t(
                      "active_users"
                    )}: `}</span>
                    {userCount}
                  </div>
                ) : (
                  <span>{t("loading_users")}</span>
                )}
                <LanguageSwitcher />
                <ThemeToggle />
                {!isLoggedIn ? (
                  pathname === "/login" ? (
                    <Button asChild size="sm">
                      <Link href="/register">{t("register")}</Link>
                    </Button>
                  ) : (
                    <Button asChild size="sm">
                      <Link href="/login">{t("login")}</Link>
                    </Button>
                  )
                ) : (
                  <>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/dashboard">
                        <User className="h-4 w-4 mr-2" />
                        {t("profile")}
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={handleLogout}
                      title={t("logout")}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                    </Button>
                  </>
                )}
              </div>
              <div className="md:hidden flex items-center">
                {userCount !== null ? (
                  <div className="flex items-center space-x-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                    <span>{`${t("active_users")}: `}</span>
                    {userCount}
                  </div>
                ) : (
                  <span>{t("loading_users")}</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* 1 coin narxi scroll (cheksiz aylanish) */}
        <div className="w-full bg-muted border-t border-border py-1 overflow-hidden">
          <div className="flex items-center relative gap-2">
            <span className="text-base absolute backdrop-blur-lg p-3 z-20 text-muted-foreground">
              {t("coin_rates") || "Coin narxlari"}:
            </span>
            <div className="w-full h-6 overflow-hidden relative">
              <div
                className="flex animate-scroll-left whitespace-nowrap min-w-full"
                style={{
                  animation: "scroll-left 20s linear infinite",
                }}
              >
                {[...getCoinComparisons(), ...getCoinComparisons()].map(
                  (item, idx) =>
                    item && (
                      <span
                        key={item.code + "-" + idx}
                        className="text-sm font-medium text-primary mx-4 flex-shrink-0"
                      >
                        1&nbsp;coin&nbsp;=&nbsp;
                        <span className="font-semibold">{item.value}</span>
                        &nbsp;{item.symbol} ({item.name})
                      </span>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Recent users carousel */}
        {/* {recentUsers.length > 0 && (
          <div className="w-full bg-muted border-t border-border py-1 overflow-hidden">
            <div className="flex items-center justify-between relative gap-2">
              <span className="text-base absolute backdrop-blur-lg p-3 z-20  text-muted-foreground">
                {t("recent_users")}:
              </span>
              <div className="w-full h-6 overflow-hidden relative">
                <div className="flex animate-scroll-left whitespace-nowrap min-w-full">
                  {[...recentUsers, ...recentUsers].map((user, idx) => {
                    const maskedEmail = maskEmail(user.email);
                    const randomAmount = (Math.random() * 900 + 100).toFixed(2);
                    const currencies = [
                      "USD",
                      "EUR",
                      "UZS",
                      "KZT",
                      "RUB",
                      "TRY",
                    ];
                    const currency =
                      statistics[statIndex]?.statEarnings?.[
                        idx % recentUsers.length
                      ]?.currency ??
                      currencies[Math.floor(Math.random() * currencies.length)];
                    const amount =
                      statistics[statIndex]?.statEarnings?.[
                        idx % recentUsers.length
                      ]?.amount ?? randomAmount;

                    return (
                      <span
                        key={user.id + "-" + idx}
                        className="text-sm font-medium text-primary mx-4 flex-shrink-0"
                      >
                        {maskedEmail} - {amount} {currency}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )} */}
      </header>
      {/* Mobil menyu qismi */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-3 space-y-2 shadow-lg absolute left-0 right-0 top-16 z-50 animate-fade-in">
          {navigation
            .filter(
              (item) =>
                (item.href !== "/dashboard" || isLoggedIn) &&
                (!item.guestOnly || !isLoggedIn)
            )
            .map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? "bg-primary text-black"
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          <div className="flex items-center gap-2 mt-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          {isLoggedIn ? (
            <div>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full mt-2"
              >
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <User className="h-4 w-4 mr-2" />
                  {t("profile")}
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="ml-2"
                onClick={handleLogout}
                title={t("logout")}
              >
                <LogOut className="h-4 w-4 mr-1" />
              </Button>
            </div>
          ) : pathname === "/" || pathname === "/register" ? (
            <Button asChild size="sm" className="w-full mt-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                {t("login")}
              </Link>
            </Button>
          ) : pathname === "/login" ? (
            <Button asChild size="sm" className="w-full mt-2">
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                {t("register")}
              </Link>
            </Button>
          ) : null}
        </div>
      )}
      <style jsx global>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}
