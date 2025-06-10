"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/api";

// Types
type ProductPhoto = { id: number; productId: number; photo_url: string };
type ProductTranslation = {
  id: number;
  product_id: number;
  language: string;
  name: string;
  description: string;
  longDescription?: string;
  features?: string;
  usage?: string;
};
type ProductPrice = {
  id: number;
  product_id: number;
  currency: string;
  value: number;
};
type Product = {
  coin: number | string | null;
  id: number;
  rating: number;
  rewiev: number;
  photo_url: ProductPhoto[];
  translations: ProductTranslation[];
  prices?: ProductPrice[];
  category?: string;
};

type Stat = { label: string; value: string };

// Stats data
const stats: Stat[] = [
  { label: "activePartners", value: "12,500+" },
  { label: "productsSold", value: "320,000+" },
  { label: "countries", value: "18" },
];

const features = [
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: "unlimitedEarnings",
    desc: "earnCommissions",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "communitySupport",
    desc: "joinNetwork",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "qualityProducts",
    desc: "offerCertified",
  },
];

// Translation helper
function getTranslation(
  translations: ProductTranslation[],
  language: string
): ProductTranslation {
  return (
    translations.find((t) => t.language === language) ||
    translations.find((t) => t.language === "en") ||
    translations[0]
  );
}

// Narx helper: avval hozirgi til valyutasi, yo‘q bo‘lsa USD, yo‘q bo‘lsa birinchi narx
function getPrice(prices: ProductPrice[], currency: string) {
  // Avval to'g'ri valyutani topamiz
  let price = prices.find(
    (p) => p.currency.toLowerCase() === currency.toLowerCase()
  ) ||
    prices.find((p) => p.currency.toUpperCase() === "USD") ||
    prices.find((p) => p.currency.toUpperCase() === "UZS") ||
    prices[0] || { value: 0, currency: "USD" };

  // formatCurrency faqat to'g'ri valyutani qabul qiladi
  let supportedCurrency = ["USD", "UZS", "EUR", "RUB"];
  let currencyToUse = supportedCurrency.includes(price.currency.toUpperCase())
    ? price.currency
    : "USD";

  return { value: price.value, currency: currencyToUse };
}

export default function Home() {
  const { t, language, currency } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((data) => setProducts(data.slice(0, 6)))
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-[#181f2a] dark:to-[#232946]" />
    );
  }

  const filteredProducts = products;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-[#181f2a] dark:to-[#232946]">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#181f2a] dark:via-[#232946] dark:to-[#232946]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2 space-y-8" data-aos="fade-right">
                <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-[#232946]/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-[#232946] shadow-sm">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {t("activePartners")} 12,500+
                  </span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400">
                    {t("heroTitle")}
                  </span>
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  {t("heroSubtitle")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/register">
                      {t("getStarted")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 border-2 border-blue-200 dark:border-[#232946] hover:border-blue-300 bg-white/80 dark:bg-[#232946]/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-[#232946]/90"
                  >
                    <Link href="/login">{t("signIn")}</Link>
                  </Button>
                </div>
              </div>

              <div
                className="lg:w-1/2 flex justify-center"
                data-aos="fade-left"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                    alt="MLM Team"
                    width={500}
                    height={500}
                    className="relative rounded-3xl shadow-2xl border-4 border-white dark:border-[#232946] object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/60 dark:bg-[#232946]/60 backdrop-blur-md border-y border-white/20 dark:border-[#232946]/40">
          <div className="container mx-auto max-w-6xl">
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              data-aos="fade-up"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="text-center p-8 rounded-2xl bg-white/80 dark:bg-[#181f2a]/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {t(stat.label)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                {t("whyJoinUs")}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group p-8 rounded-2xl bg-white/80 dark:bg-[#181f2a]/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-white/20 dark:border-[#232946]/40"
                  data-aos="fade-up"
                  data-aos-delay={i * 150}
                >
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 w-fit group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    {t(feature.title)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t(feature.desc)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 px-4 bg-white/40 dark:bg-[#232946]/40 backdrop-blur-md">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12" data-aos="fade-up">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                {t("featuredProducts")}
              </h2>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/products">
                  {t("allProducts")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => {
                  const translation = getTranslation(
                    product.translations,
                    language
                  );
                  // const priceObj = getPrice(product.prices, currency);
                  const imageUrl =
                    product.photo_url?.[0]?.photo_url || "/placeholder.svg";

                  return (
                    <Card
                      key={product.id}
                      className="flex flex-col justify-around group overflow-hidden bg-white/90 dark:bg-[#181f2a]/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border-none transition-all duration-500 hover:scale-105"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={translation.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#232946]/90 backdrop-blur-sm text-blue-600 dark:text-blue-200 text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                          {product.category
                            ? product.category.charAt(0).toUpperCase() +
                              product.category.slice(1)
                            : ""}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-2">
                            {translation.name}
                          </h3>
                          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900 px-2 py-1 rounded-full">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="ml-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">
                              {product.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {translation.description}
                        </p>
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                          {/* {formatCurrency(priceObj.value, priceObj.currency || currency)} */}
                          {product.coin || "-"}
                        </div>
                      </CardContent>

                      <CardFooter className="p-6 pt-0">
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Link href={`/products/${product.id}`}>
                            {t("details")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          </div>

          <div className="container mx-auto max-w-4xl relative z-10 text-center px-4">
            <h2
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              data-aos="fade-up"
            >
              {t("readyToStart")}
            </h2>
            <p
              className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {t("readyToStartDesc")}
            </p>
            <Button
              asChild
              size="lg"
              className="text-lg px-12 py-6 bg-white text-blue-600 font-bold shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300 rounded-full"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <Link href="/register">
                {t("joinNow")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
