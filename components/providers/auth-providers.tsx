"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
interface AuthProvidersProps {
  onEmailClick: () => void;
}

export function AuthProviders({ onEmailClick }: AuthProvidersProps) {
  const handleGoogleLogin = () => {
    // In a real app, this would redirect to Google OAuth
    console.log("Google login clicked");
  };

  const handleFacebookLogin = () => {
    // In a real app, this would redirect to Facebook OAuth
    console.log("Facebook login clicked");
  };

  return (
    <div className="flex flex-col space-y-3">
      <Button
        variant="outline"
        onClick={() => signIn("google")}
        className="flex items-center gap-2"
      >
        <FcGoogle className="h-5 w-5" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        onClick={() => signIn("facebook")}
        className="flex items-center gap-2"
      >
        <Facebook className="h-5 w-5 text-blue-600" />
        Continue with Facebook
      </Button>
      <Button
        variant="outline"
        onClick={onEmailClick}
        className="flex items-center gap-2"
      >
        <Mail className="h-5 w-5" />
        Continue with Email
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
    </div>
  );
}
