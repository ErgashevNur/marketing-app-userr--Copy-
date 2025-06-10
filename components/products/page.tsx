import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowRight, Star } from "lucide-react";

type ProductCardProps = {
  product: any;
};

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.photo_url?.[0]?.photo_url || "/placeholder.svg";
  const router = useRouter();
  const { language, currency, t } = useLanguage();

  const translation = product.translations?.find(
    (tr: any) => tr.language === language
  ) ||
    product.translations?.[0] || { name: "", description: "" };

  const priceObj = product.prices?.find((p: any) => p.currency === currency) ||
    product.prices?.[0] || { value: 0, currency: "" };

  return (
    <div
      className="relative flex flex-col gap-3 justify-around rounded-md shadow-sm hover:shadow-md transition-all duration-300   border-gray-200 dark:border-gray-700 w-full max-w-sm overflow-hidden group cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      {/* Like button */}
      <button
        aria-label="Like"
        className="absolute top-3 right-3 z-10 w-6 px-1 sm:w-10 aspect-square rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/90 flex items-center justify-center hover:border-pink-500 hover:scale-110 transition-all duration-200 active:scale-95"
        onClick={(e) => e.stopPropagation()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-gray-400 hover:text-pink-500 transition-colors duration-200"
        >
          <path
            fillRule="evenodd"
            d="M12.001 4.529c2.349-2.437 6.193-2.436 8.537-.092 2.343 2.343 2.343 6.142 0 8.485L12 21.46 3.462 12.922c-2.343-2.343-2.343-6.142 0-8.485 2.344-2.344 6.188-2.345 8.539.092z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Rasm */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <Image
          src={imageUrl}
          alt={translation.name || "Product Image"}
          fill
          sizes="(max-width: 768px) 100vw, 190px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Ma'lumotlar */}
      <div className="flex flex-col p-4 flex-1 gap-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
          {translation.name}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
          {translation.description}
        </p>
        <div className="text-base font-bold text-gray-900 dark:text-white mb-2">
          {/* {priceObj.value?.toLocaleString()} {priceObj.currency} */}
          {product.coin || " - "} 🟡
        </div>

        {/* Yulduzlar */}
        <div className="flex items-center gap-1 text-yellow-400 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.round(product.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }
              fill={i < Math.round(product.rating) ? "#facc15" : "none"}
            />
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({product.rewiev || 0})
          </span>
        </div>

        {/* Tugma */}

        <Button
          className="w-full flex items-center justify-center gap-2 rounded-lg py-2 px-4
             bg-primary text-black/80 dark:text-white 
             hover:bg-primary/90 transition-colors duration-200
             text-xs sm:text-sm md:text-base font-medium"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/products/${product.id}`);
          }}
        >
          {t("productDetails") || "Batafsil"}
          <ArrowRight size={16} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
