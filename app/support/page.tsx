"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Mail, Phone } from "lucide-react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const SUPPORT_EMAIL = "support@example.com";

interface HelpItem {
  title: string;
  content: string;
}

const helpData: Record<string, HelpItem[]> = {
  en: [
    {
      title: "How to create an account?",
      content:
        "To create an account, click on the 'Sign Up' button at the top right corner of the page. Fill in your details and follow the instructions to complete the registration process.",
    },
    {
      title: "How to reset my password?",
      content:
        "If you forgot your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we will send you instructions to reset your password.",
    },
    {
      title: "How to contact support?",
      content:
        "You can contact our support team via the 'Contact Us' page or email us at support@example.com. We are here to help you 24/7.",
    },
  ],
  uz: [
    {
      title: "Qanday qilib hisob yaratishim mumkin?",
      content:
        "Hisob yaratish uchun sahifaning yuqori o'ng burchagidagi 'Ro'yxatdan o'tish' tugmasini bosing. Ma'lumotlaringizni kiriting va ro'yxatdan o'tishni yakunlash uchun ko'rsatmalarga amal qiling.",
    },
    {
      title: "Parolimni qanday tiklashim mumkin?",
      content:
        "Agar parolingizni unutgan bo'lsangiz, kirish sahifasidagi 'Parolni unutdingizmi?' havolasini bosing. Elektron pochta manzilingizni kiriting, va biz sizga parolni tiklash bo'yicha ko'rsatmalarni yuboramiz.",
    },
    {
      title: "Qo'llab-quvvatlash bilan qanday bog'lanishim mumkin?",
      content:
        "Bizning qo'llab-quvvatlash jamoamizga 'Biz bilan bog'lanish' sahifasi orqali yoki support@example.com elektron pochta manziliga yozib murojaat qilishingiz mumkin. Biz 24/7 yordam berishga tayyormiz.",
    },
  ],
};

export default function HelpPage() {
  const { language } = useLanguage();
  const currentHelp = helpData[language] || helpData.en;

  const [userEmail, setUserEmail] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendEmail = async () => {
    if (!userEmail.trim() || !emailContent.trim()) {
      alert(
        language === "uz"
          ? "Iltimos, email manzilingizni va xabaringizni kiriting."
          : "Please enter your email and message before sending."
      );
      return;
    }

    setIsSending(true);
    try {
      // Simulate email sending (replace this with actual backend API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage(
        language === "uz"
          ? "Xabaringiz muvaffaqiyatli yuborildi!"
          : "Your message has been sent successfully!"
      );
      setUserEmail("");
      setEmailContent("");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert(
        language === "uz"
          ? "Xabaringizni yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
          : "Failed to send your message. Please try again later."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          {language === "uz" ? "Yordam sahifasi" : "Help Page"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === "uz"
            ? "Platformadan foydalanish bo'yicha eng ko'p beriladigan savollarga javoblarni toping."
            : "Find answers to common questions about using the platform."}
        </p>
      </div>

      <div className="space-y-6">
        {currentHelp.map((help, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h2 className="font-medium text-lg mb-2">{help.title}</h2>
            <p className="text-muted-foreground">{help.content}</p>
          </div>
        ))}
      </div>

      {/* Email Form */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">
          {language === "uz" ? "Email yuboring" : "Send an Email"}
        </h2>
        <input
          type="email"
          className="w-full border rounded-lg p-4 mb-4 text-muted-foreground"
          placeholder={
            language === "uz"
              ? "Email manzilingizni kiriting..."
              : "Enter your email address..."
          }
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <textarea
          className="w-full border rounded-lg p-4 text-muted-foreground"
          rows={5}
          placeholder={
            language === "uz"
              ? "Xabaringizni shu yerga yozing..."
              : "Write your message here..."
          }
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
        <button
          onClick={handleSendEmail}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          disabled={isSending}
        >
          {isSending
            ? language === "uz"
              ? "Yuborilmoqda..."
              : "Sending..."
            : language === "uz"
            ? "Yuborish"
            : "Send"}
        </button>
        {successMessage && (
          <p className="mt-4 text-green-600">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
