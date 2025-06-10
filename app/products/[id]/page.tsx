"use client";

import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  ChevronRight,
  Heart,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { fetchProductById, fetchProducts } from "@/lib/api";
import { CoinPrice } from "@/components/products/CoinPrice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type ProductTranslation = {
  id: number;
  product_id: number;
  language: string;
  name: string;
  description: string;
  longDescription: string;
  features: string;
  usage: string;
};

type ProductPrice = {
  id: number;
  product_id: number;
  currency: string;
  value: number;
};

type Product = {
  id: number;
  rating: number;
  coin: number | null;
  rewiev: number;
  photo_url: { photo_url: string }[];
  translations: ProductTranslation[];
  prices: ProductPrice[];
};

export default function ProductDetailPage() {
  const { t, currency, language } = useLanguage();
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);

  // Zoom uchun state
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  // TODO:fix response in this page

  // Helper: get translation by language, fallback to 'en' or first
  const getTranslation = (translations: ProductTranslation[]) => {
    return (
      translations.find((t) => t.language === language) ||
      translations.find((t) => t.language === "en") ||
      translations[0] || {
        name: "",
        description: "",
        longDescription: "",
        features: "",
        usage: "",
      }
    );
  };

  useEffect(() => {
    setLoading(true);
    fetchProductById(productId)
      .then((data) => {
        setProduct(data);
        setLoading(false);
        // Fetch related products (for demo, fetch all and filter by id != current)
        fetchProducts().then((all) => {
          const related = (all.products || all)
            .filter((p: Product) => p.id !== Number(productId))
            .slice(0, 4);
          setRelatedProducts(related);
        });
      })
      .catch(() => {
        setLoading(false);
        setProduct(null);
      });
  }, [productId]);

  const translation = product ? getTranslation(product.translations) : null;

  const handleAddToCart = () => {
    toast({
      title: t ? t("addedToCart") : "Added to cart",
      description: `${translation?.name} (${quantity})`,
    });
    router.push("/cart");
  };

  const handleAddToWishlist = () => {
    toast({
      title: t ? t("addedToWishlist") : "Added to wishlist",
      description: `${translation?.name}`,
    });
  };

  // Modal ochish
  const openModal = (idx: number) => {
    setModalImageIndex(idx);
    setModalOpen(true);
    setZoomed(false);
  };

  // Modal yopish (modal foniga yoki tepa qismini bosganda)
  const closeModal = () => {
    setModalOpen(false);
    setZoomed(false);
  };

  // Zoom uchun rasmga bosganda
  const handleImageClick = () => {
    setZoomed((z) => {
      if (z) setPan({ x: 0, y: 0 }); // Zoomdan chiqishda pan reset
      return !z;
    });
  };

  // Mouse/touch pan funksiyalari
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!zoomed) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!zoomed || !dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy,
    });
  };
  const handleMouseUp = () => setDragging(false);

  // Touch uchun
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!zoomed) return;
    setDragging(true);
    dragStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    panStart.current = { ...pan };
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!zoomed || !dragging) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;
    setPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy,
    });
  };
  const handleTouchEnd = () => setDragging(false);

  // Modalda chap/o'ng rasmga o'tish
  const prevImage = () => {
    setModalImageIndex((prev) =>
      product && product.photo_url.length > 0
        ? (prev - 1 + product.photo_url.length) % product.photo_url.length
        : 0
    );
  };

  const nextImage = () => {
    setModalImageIndex((prev) =>
      product && product.photo_url.length > 0
        ? (prev + 1) % product.photo_url.length
        : 0
    );
  };

  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("mlm_token");

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product || !translation) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">
          {t ? t("productNotFound") : "Product not found"}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {t
            ? t("productNotFoundDesc")
            : "The product you are looking for does not exist."}
        </p>
        <Button asChild>
          <Link href="/products">
            {t ? t("backToProducts") : "Back to products"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            {t ? t("home") : "Home"}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/products" className="hover:text-foreground">
            {t ? t("products") : "Products"}
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>{translation.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div data-aos="fade-right">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
            {/* Asosiy rasm */}
            <Image
              src={
                Array.isArray(product.photo_url) &&
                product.photo_url[activeImageIndex]?.photo_url
                  ? product.photo_url[activeImageIndex].photo_url
                  : "/placeholder.svg"
              }
              alt={translation.name || "img"}
              fill
              className="object-cover cursor-zoom-in"
              onClick={() => openModal(activeImageIndex)}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {/* Thumbnaillar */}
            {(product.photo_url.length > 0
              ? product.photo_url
              : [{ photo_url: "/placeholder.svg" }]
            ).map((imageObj, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                  activeImageIndex === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={() => {
                  setActiveImageIndex(index);
                  openModal(index);
                }}
              >
                <Image
                  src={
                    imageObj.photo_url ? imageObj.photo_url : "/placeholder.svg"
                  }
                  alt={`${translation.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div data-aos="fade-left">
          <h1 className="text-3xl font-bold mb-2">{translation.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{product.rating}</span>
              <span className="ml-1 text-muted-foreground">
                ({product.rewiev} {t ? t("reviews") : "reviews"})
              </span>
            </div>
            {/* Category field yo‘q, kerak bo‘lsa qo‘shing */}
          </div>

          {/* Narxni ko‘rsatish (asosiy mahsulot uchun) */}
          <p className="text-3xl font-bold mb-6">
            {product?.coin !== null && product?.coin !== undefined
              ? `${product?.coin} coin`
              : ""}
          </p>

          <p className="mb-6 text-muted-foreground">
            {translation.description}
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {t ? t("quantity") : "Quantity"}
            </label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="mx-4 font-medium w-8 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {isLoggedIn ? (
              <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t ? t("addToCart") : "Add to cart"}
              </Button>
            ) : (
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => router.push("/login")}
              >
                {t ? t("loginForBuy") : "Login for buy"}
              </Button>
            )}
            {isLoggedIn ? (
              <Button variant="outline" onClick={handleAddToWishlist}>
                <Heart className="mr-2 h-4 w-4" />
                {t ? t("addToWishlist") : "Add to wishlist"}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setWishlistModalOpen(true)}
              >
                <Heart className="mr-2 h-4 w-4" />
                {t ? t("addToWishlist") : "Add to wishlist"}
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="p-4">
              <Tabs defaultValue="description">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="description">
                    {t ? t("description") : "Description"}
                  </TabsTrigger>
                  <TabsTrigger value="features">
                    {t ? t("features") : "Features"}
                  </TabsTrigger>
                  <TabsTrigger value="usage">
                    {t ? t("usage") : "Usage"}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-0">
                  <p>{translation.longDescription}</p>
                </TabsContent>
                <TabsContent value="features" className="mt-0">
                  <ul className="list-disc pl-5 space-y-1">
                    {translation.features
                      ? translation.features
                          .split("\n")
                          .map((feature, idx) => <li key={idx}>{feature}</li>)
                      : null}
                  </ul>
                </TabsContent>
                <TabsContent value="usage" className="mt-0">
                  <p>{translation.usage}</p>
                  {/* Ingredients field yo‘q, kerak bo‘lsa qo‘shing */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative max-w-2xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal tepa qismi (yopish uchun) */}
            <div
              className="w-full h-12 flex items-center justify-end px-2 bg-gradient-to-b from-black/30 to-transparent absolute top-0 left-0 z-20 cursor-pointer"
              onClick={closeModal}
            >
              <X className="h-6 w-6 text-white" />
            </div>
            {/* Chap/O'ng tugmalar */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white z-10"
              onClick={prevImage}
              tabIndex={-1}
            >
              <ChevronLeft className="h-6 w-6 text-black" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white z-10"
              onClick={nextImage}
              tabIndex={-1}
            >
              <ChevronRight className="h-6 w-6 text-black" />
            </button>
            {/* Rasm */}
            <div className="relative w-[90vw] h-[90vw] max-w-3xl max-h-[90vh] bg-transparent rounded-xl overflow-hidden flex items-center justify-center">
              <Image
                fill
                src={
                  product.photo_url[modalImageIndex]?.photo_url
                    ? product.photo_url[modalImageIndex].photo_url
                    : "/placeholder.svg"
                }
                alt={translation.name || "img"}
                className={`object-contain w-full h-full transition-transform duration-300 cursor-zoom-in ${
                  zoomed ? "scale-150 cursor-zoom-out" : ""
                }`}
                style={{
                  touchAction: "none",
                  userSelect: "none",
                }}
                onClick={handleImageClick}
                draggable={false}
              />
            </div>
            {/* Zoom uchun ko‘rsatma */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/80 bg-black/40 px-3 py-1 rounded-full pointer-events-none select-none">
              {zoomed
                ? t
                  ? t("tapToExitZoom")
                  : "Drag to move, tap again to exit zoom"
                : t
                ? t("tapToZoom")
                : "Tap to zoom"}
            </div>
          </div>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {t ? t("relatedProducts") : "Related products"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => {
              const relTranslation = getTranslation(
                relatedProduct.translations
              );
              return (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden"
                  data-aos="fade-up"
                >
                  <div className="relative h-64">
                    {/* Related products uchun: */}
                    <Image
                      src={
                        relatedProduct.photo_url[0]?.photo_url
                          ? relatedProduct.photo_url[0].photo_url
                          : "/placeholder.svg"
                      }
                      alt={relTranslation.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {relTranslation.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-primary">
                        {relatedProduct?.coin !== null &&
                        relatedProduct?.coin !== undefined
                          ? `${relatedProduct?.coin} coin`
                          : ""}
                      </p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm">
                          {relatedProduct.rating}
                        </span>
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4">
                      <Link href={`/products/${relatedProduct.id}`}>
                        {t ? t("viewDetails") : "View details"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={wishlistModalOpen} onOpenChange={setWishlistModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t ? t("loginRequired") : "Login required"}
            </DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            {t
              ? t("loginForWishlistDesc")
              : "Sevimlilar ro‘yxatiga qo‘shish uchun avval tizimga kiring."}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWishlistModalOpen(false)}
            >
              {t ? t("cancel") : "Cancel"}
            </Button>
            <Button
              className="bg-primary text-white"
              onClick={() => {
                setWishlistModalOpen(false);
                router.push("/login");
              }}
            >
              {t ? t("login") : "Login"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
