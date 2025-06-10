"use client";

import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/providers/language-provider";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  { code: "kz", name: "Қазақша", flag: "🇰🇿" },
  { code: "kg", name: "Кыргызча", flag: "🇰🇬" },
  { code: "tj", name: "Тоҷикӣ", flag: "🇹🇯" },
  { code: "cn", name: "中文", flag: "🇨🇳" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">
            {currentLanguage?.flag}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code as any);
              setOpen(false);
            }}
            className="flex items-center justify-between"
          >
            <span>
              {lang.flag} {lang.name}
            </span>
            {language === lang.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
