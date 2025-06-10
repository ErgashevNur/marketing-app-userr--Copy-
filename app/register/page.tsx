"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { AuthProviders } from "@/components/providers/auth-providers";

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleEmailClick = () => {
    router.push("/register/email");
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <Card className="w-full max-w-md mx-auto" data-aos="fade-up">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("register")}
          </CardTitle>
          <CardDescription className="text-center">
            Choose how you want to register
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthProviders onEmailClick={handleEmailClick} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {t("login")}?{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("login")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
