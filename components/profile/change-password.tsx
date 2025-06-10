"use client";

import type React from "react";

import { useState } from "react";
import { Shield } from "lucide-react";
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

export function ChangePassword() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t("changePassword")}
        </CardTitle>
        <CardDescription>{t("changePasswordDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t("currentPassword")}</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t("newPassword")}</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleChangePassword}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? t("changing") : t("changePassword")}
        </Button>
      </CardFooter>
    </Card>
  );
}
