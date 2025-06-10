import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import AOS from "@/components/providers/aos-provider";
import { SaveUserToLocalStorage } from "../components/providers/SaveUserToLocalStorage";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import Providers from "@/hooks/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MLM Platform",
  description: "Modern MLM Platform for cosmetics and health products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <SessionProviderWrapper>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <LanguageProvider>
                <AOS>
                  <Toaster />
                  <SaveUserToLocalStorage />
                  <div className="flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                </AOS>
              </LanguageProvider>
            </ThemeProvider>
          </Providers>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
