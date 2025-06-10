"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  TextIcon as Telegram,
  Twitter,
  PhoneIcon as WhatsApp,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-background border-t border-border z-40">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MLM Platform</h3>
            <p className="text-sm text-muted-foreground">
              Modern MLM platform for cosmetics and health-enhancing products.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("support")}</h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/faq"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                FAQ
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t("support")}
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms & Conditions
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("support")}</h3>
            <div className="flex space-x-4">
              <Link
                href="https://t.me/support"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Telegram className="h-5 w-5  hover:text-primary transition-colors" />
              </Link>
              <Link
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsApp className="h-5 w-5  hover:text-primary transition-colors" />
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5  hover:text-primary transition-colors" />
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5  hover:text-primary transition-colors" />
              </Link>
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5  hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} MLM Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
