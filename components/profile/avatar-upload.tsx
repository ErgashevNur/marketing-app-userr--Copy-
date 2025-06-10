"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";

interface AvatarUploadProps {
  initialAvatar?: string;
}

export function AvatarUpload({ initialAvatar }: AvatarUploadProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [avatar, setAvatar] = useState<string>(
    initialAvatar || "/placeholder.svg?height=100&width=100"
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Create a URL for the file
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate upload delay
      setTimeout(() => {
        setAvatar(reader.result as string);
        setIsUploading(false);
        toast({
          title: "Success",
          description: "Avatar uploaded successfully",
        });
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar("/placeholder.svg?height=100&width=100");
    toast({
      title: "Success",
      description: "Avatar removed",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="aspect-square w-full max-w-[300px] mx-auto relative overflow-hidden">
            {isUploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : null}
            <Image
              src={avatar || "/placeholder.svg"}
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
            {avatar !== "/placeholder.svg?height=100&width=100" && (
              <Button
                size="icon"
                variant="destructive"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={handleRemoveAvatar}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
