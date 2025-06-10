"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Eye, EyeOff, CreditCard, Edit2, Trash2 } from "lucide-react";
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

interface CardManagementProps {
  initialCardNumber?: string;
}

// Card type detection
const getCardType = (cardNumber: string): { type: string; icon: string } => {
  const cleanNumber = cardNumber.replace(/\s+/g, "");

  // Visa
  if (/^4/.test(cleanNumber)) {
    return { type: "Visa", icon: "💳" };
  }

  // Mastercard
  if (/^5[1-5]/.test(cleanNumber)) {
    return { type: "Mastercard", icon: "💳" };
  }

  // American Express
  if (/^3[47]/.test(cleanNumber)) {
    return { type: "American Express", icon: "💳" };
  }

  // Discover
  if (/^6(?:011|5)/.test(cleanNumber)) {
    return { type: "Discover", icon: "💳" };
  }

  // JCB
  if (/^35(?:2[89]|[3-8])/.test(cleanNumber)) {
    return { type: "JCB", icon: "💳" };
  }

  // Diners Club
  if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) {
    return { type: "Diners Club", icon: "💳" };
  }

  // Unknown
  return { type: "Unknown", icon: "💳" };
};

export function CardManagement({
  initialCardNumber = "",
}: CardManagementProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [cardNumber, setCardNumber] = useState(initialCardNumber || "");
  const [isEditing, setIsEditing] = useState(false);
  const [showFullCard, setShowFullCard] = useState(false);
  const [cardType, setCardType] = useState<{ type: string; icon: string }>({
    type: "Unknown",
    icon: "💳",
  });
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (cardNumber) {
      setCardType(getCardType(cardNumber));
    }
  }, [cardNumber]);

  const handleSaveCard = () => {
    // Validate card number (simple validation for demo)
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast({
        title: "Invalid Card",
        description: "Please enter a valid 16-digit card number",
        variant: "destructive",
      });
      return;
    }

    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter a valid expiry date (MM/YY)",
        variant: "destructive",
      });
      return;
    }

    if (!cvv.match(/^\d{3,4}$/)) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid CVV code (3-4 digits)",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to the backend
    toast({
      title: "Card Saved",
      description: "Your card information has been updated",
    });
    setIsEditing(false);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Format with spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");

    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }

    setExpiryDate(value);
  };

  const getMaskedCardNumber = () => {
    if (!cardNumber) return "No card added";
    if (showFullCard) return cardNumber;

    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 8) return cardNumber; // Don't mask if too short

    const firstFour = digits.substring(0, 4);
    const lastFour = digits.substring(digits.length - 4);
    const middleLength = digits.length - 8;
    const maskedMiddle = "*".repeat(middleLength);

    // Format with spaces
    return `${firstFour} ${maskedMiddle
      .replace(/(.{4})/g, "$1 ")
      .trim()} ${lastFour}`.trim();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {t("cardNumber")}
        </CardTitle>
        <CardDescription>
          {isEditing ? t("editCardInfo") : t("manageCardInfo")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">{t("cardNumber")}</Label>
              <Input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19} // 16 digits + 3 spaces
                className="font-mono"
              />
              {cardNumber && (
                <p className="text-sm text-muted-foreground mt-1">
                  {cardType.icon} {cardType.type}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date">{t("expiryDate")}</Label>
                <Input
                  id="expiry-date"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  maxLength={4}
                  className="font-mono"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-lg">{getMaskedCardNumber()}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFullCard(!showFullCard)}
                aria-label={
                  showFullCard ? "Hide card number" : "Show card number"
                }
              >
                {showFullCard ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {cardNumber && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {cardType.icon} {cardType.type}
                </p>
                {expiryDate && (
                  <p className="text-sm text-muted-foreground">
                    {t("expires")}: {expiryDate}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveCard} className="flex-1">
              {t("saveCard")}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex-1"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              {cardNumber ? t("editCard") : t("addCard")}
            </Button>
            {cardNumber && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setCardNumber("")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
