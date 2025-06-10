"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Star, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/providers/language-provider";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/query-hooks/use-products";
import { SkeletonCard } from "@/components/products/SkeletonCard";
import { ProductCard } from "@/components/products/page";

type ProductTranslation = {
  id: number;
  product_id: number;
  language: string;
  name: string;
  description: string;
};

type ProductPrice = {
  id: number;
  product_id: number;
  currency: string;
  value: number;
};

type ProductPhoto = {
  id: number;
  productId: number;
  photo_url: string;
};

type Product = {
  id: number;
  rating: number;
  rewiev: number;
  photo_url: ProductPhoto[];
  translations: ProductTranslation[];
  prices: ProductPrice[];
  category?: string;
};

const categories = [
  { id: "skincare", name: "Skincare" },
  { id: "supplements", name: "Supplements" },
  { id: "wellness", name: "Wellness" },
  { id: "all", name: "All Products" },
];

export default function ProductsPage() {
  const { currency, language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mounted, setMounted] = useState(false);
  const { push } = useRouter();
  const { products, isLoading, error } = useProducts();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950" />
    );
  }

  // Helper functions
  const getTranslation = (translations: ProductTranslation[]) => {
    return (
      translations.find((t) => t.language === language) ||
      translations.find((t) => t.language === "en") ||
      translations[0] || { name: "", description: "" }
    );
  };

  const getPrice = (prices: ProductPrice[]) => {
    return (
      prices.find((p) => p.currency === currency) ||
      prices[0] || { value: 0, currency: "" }
    );
  };

  const filteredProducts = products.filter((product: any) => {
    const translation = getTranslation(product.translations || []);
    const matchesSearch =
      translation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 md:sticky top-0 z-40">
        <div className="container mx-auto p-4 md:p-5">
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 "
            data-aos="fade-up"
          >
            <p className="text-gray-600 dark:text-gray-300 md:text-lg text-base mb-0">
              {t(
                "Discover our premium range of cosmetics and health-enhancing products"
              )}
            </p>
            <div className="relative w-full max-w-xs md:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 shadow h-10 text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          {/* Mobilda filterlar searchbar ostida */}
          <div className="flex gap-2 mt-2 mb-4 sm:hidden flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-1 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                    : "bg-white border border-gray-200 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                } transition-all duration-300`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-4 md:p-8 flex gap-8">
        {/* Sidebar: Categories */}
        <aside className="hidden sm:block min-w-[150px]">
          <div className="flex flex-col gap-2 sticky top-32">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full justify-start ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
                    : "bg-white border border-gray-200 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                } transition-all duration-300`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </aside>

        {/* Main products grid */}
        <main className="flex-1 relative">
          {/* Loader va skeleton */}
          {isLoading ? (
            <div className="relative min-h-[500px]">
              {/* Skeleton grid */}
              <div
                className={`grid gap-8 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {Array.from({ length: 6 }).map((_, i: number) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
              {/* Loader absolute markazda */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20" data-aos="fade-up">
              <h3 className="text-lg text-red-500">{error.message}</h3>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-2   md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 "
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20" data-aos="fade-up">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t("noResults")}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
