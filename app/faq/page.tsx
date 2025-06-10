"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: Record<string, FAQItem[]> = {
  en: [
    {
      question: "What is this platform about?",
      answer:
        "This platform is designed to provide premium skincare and wellness products with a focus on natural ingredients and clinically tested solutions.",
    },
    {
      question: "How can I purchase a product?",
      answer:
        "You can browse the products on the Products page, add them to your cart, and proceed to checkout to complete your purchase.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods, including credit/debit cards, PayPal, and local payment options depending on your region.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach out to our customer support team via the Contact Us page or email us at support@example.com.",
    },
    {
      question: "Can I return a product?",
      answer:
        "Yes, we have a 30-day return policy. Please refer to our Return Policy page for more details.",
    },
  ],
  ru: [
    {
      question: "О чем эта платформа?",
      answer:
        "Эта платформа предназначена для предоставления премиальных продуктов по уходу за кожей и здоровья с акцентом на натуральные ингредиенты и клинически проверенные решения.",
    },
    {
      question: "Как я могу купить продукт?",
      answer:
        "Вы можете просмотреть продукты на странице Продукты, добавить их в корзину и перейти к оформлению заказа, чтобы завершить покупку.",
    },
    {
      question: "Какие способы оплаты принимаются?",
      answer:
        "Мы принимаем различные способы оплаты, включая кредитные/дебетовые карты, PayPal и локальные варианты оплаты в зависимости от вашего региона.",
    },
    {
      question: "Как я могу связаться с поддержкой клиентов?",
      answer:
        "Вы можете связаться с нашей службой поддержки через страницу Свяжитесь с нами или написать нам на support@example.com.",
    },
    {
      question: "Могу ли я вернуть продукт?",
      answer:
        "Да, у нас есть 30-дневная политика возврата. Пожалуйста, ознакомьтесь с нашей страницей Политики возврата для получения дополнительной информации.",
    },
  ],
  uz: [
    {
      question: "Bu platforma nima haqida?",
      answer:
        "Bu platforma tabiiy ingredientlar va klinik sinovdan o'tgan yechimlarga asoslangan premium teri parvarishi va sog'liqni saqlash mahsulotlarini taqdim etish uchun mo'ljallangan.",
    },
    {
      question: "Mahsulotni qanday sotib olsam bo'ladi?",
      answer:
        "Mahsulotlar sahifasida mahsulotlarni ko'rib chiqing, ularni savatga qo'shing va xaridni yakunlash uchun to'lovni amalga oshiring.",
    },
    {
      question: "Qanday to'lov usullari qabul qilinadi?",
      answer:
        "Biz turli to'lov usullarini, jumladan kredit/debet kartalari, PayPal va mintaqangizga mos mahalliy to'lov usullarini qabul qilamiz.",
    },
    {
      question:
        "Mijozlarni qo'llab-quvvatlash bilan qanday bog'lanishim mumkin?",
      answer:
        "Bizning mijozlarni qo'llab-quvvatlash jamoamizga Biz bilan bog'lanish sahifasi orqali yoki support@example.com elektron pochta manziliga yozib murojaat qilishingiz mumkin.",
    },
    {
      question: "Mahsulotni qaytarishim mumkinmi?",
      answer:
        "Ha, bizda 30 kunlik qaytarish siyosati mavjud. Qo'shimcha ma'lumot olish uchun Qaytarish siyosati sahifamizga murojaat qiling.",
    },
  ],
  kz: [
    {
      question: "Бұл платформа туралы не білуге болады?",
      answer:
        "Бұл платформа табиғи ингредиенттер мен клиникалық сынақтан өткен шешімдерге негізделген премиум тері күтімі мен денсаулық сақтау өнімдерін ұсынады.",
    },
    {
      question: "Өнімді қалай сатып алуға болады?",
      answer:
        "Өнімдер бетінде өнімдерді қарап шығып, оларды себетке қосып, сатып алуды аяқтау үшін төлем жасаңыз.",
    },
    {
      question: "Қандай төлем әдістері қабылданады?",
      answer:
        "Біз әртүрлі төлем әдістерін, соның ішінде несие/дебеттік карталарды, PayPal және аймағыңызға сәйкес жергілікті төлем әдістерін қабылдаймыз.",
    },
    {
      question: "Клиенттерді қолдау қызметімен қалай байланысуға болады?",
      answer:
        "Біздің клиенттерді қолдау тобына Байланыс беті арқылы немесе support@example.com электрондық поштасына жазу арқылы хабарласыңыз.",
    },
    {
      question: "Өнімді қайтаруға бола ма?",
      answer:
        "Иә, бізде 30 күндік қайтару саясаты бар. Қосымша ақпарат алу үшін Қайтару саясаты бетіне кіріңіз.",
    },
  ],
  kg: [
    {
      question: "Бул платформа эмне жөнүндө?",
      answer:
        "Бул платформа табигый ингредиенттерге жана клиникалык сыноодон өткөн чечимдерге негизделген премиум терини кароо жана ден соолукту чыңдоо продуктыларын сунуштайт.",
    },
    {
      question: "Продуктту кантип сатып алсам болот?",
      answer:
        "Продукттар барагында продукттарды карап чыгып, аларды себетке кошуп, сатып алууну аяктоо үчүн төлөм жасаңыз.",
    },
    {
      question: "Кандай төлөм ыкмалары кабыл алынат?",
      answer:
        "Биз ар кандай төлөм ыкмаларын, анын ичинде кредиттик/дебеттик карталарды, PayPal жана аймагыңызга ылайыктуу жергиликтүү төлөм ыкмаларын кабыл алабыз.",
    },
    {
      question: "Кардарларды колдоо кызматы менен кантип байланышсам болот?",
      answer:
        "Биздин кардарларды колдоо тобуна Байланыш бетинен же support@example.com электрондук почтасына жазуу аркылуу кайрылсаңыз болот.",
    },
    {
      question: "Продуктту кайтарсам болобу?",
      answer:
        "Ооба, бизде 30 күндүк кайтаруу саясаты бар. Кошумча маалымат алуу үчүн Кайтаруу саясаты бетине кайрылыңыз.",
    },
  ],
  tj: [
    {
      question: "Ин платформа дар бораи чӣ аст?",
      answer:
        "Ин платформа барои пешниҳоди маҳсулоти нигоҳубини пӯст ва саломатии премиум бо тамаркуз ба компонентҳои табиӣ ва ҳалли клиникӣ тарҳрезӣ шудааст.",
    },
    {
      question: "Чӣ тавр ман метавонам маҳсулот харам?",
      answer:
        "Шумо метавонед маҳсулотҳоро дар саҳифаи Маҳсулотҳо бубинед, онҳоро ба сабад илова кунед ва барои анҷом додани харид пардохт кунед.",
    },
    {
      question: "Кадом усулҳои пардохт қабул карда мешаванд?",
      answer:
        "Мо усулҳои гуногуни пардохтро, аз ҷумла кортҳои кредитӣ/дебетӣ, PayPal ва усулҳои маҳаллии пардохт вобаста ба минтақаи шумо қабул мекунем.",
    },
    {
      question: "Чӣ тавр ман метавонам бо дастгирии муштариён тамос гирам?",
      answer:
        "Шумо метавонед бо дастаи дастгирии муштариёни мо тавассути саҳифаи Тамос бо мо ё ба support@example.com муроҷиат кунед.",
    },
    {
      question: "Оё ман метавонам маҳсулотро баргардонам?",
      answer:
        "Бале, мо сиёсати баргардонидани 30-рӯза дорем. Лутфан барои маълумоти бештар ба саҳифаи Сиёсати баргардонидани мо муроҷиат кунед.",
    },
  ],
  cn: [
    {
      question: "这个平台是关于什么的？",
      answer:
        "该平台旨在提供以天然成分和临床测试解决方案为重点的优质护肤和健康产品。",
    },
    {
      question: "我如何购买产品？",
      answer:
        "您可以在产品页面浏览产品，将其添加到购物车，然后继续结账以完成购买。",
    },
    {
      question: "接受哪些付款方式？",
      answer:
        "我们接受各种付款方式，包括信用卡/借记卡、PayPal 和根据您所在地区的本地付款选项。",
    },
    {
      question: "我如何联系客户支持？",
      answer:
        "您可以通过联系我们页面或发送电子邮件至 support@example.com 联系我们的客户支持团队。",
    },
    {
      question: "我可以退货吗？",
      answer:
        "是的，我们有 30 天退货政策。有关更多详细信息，请参阅我们的退货政策页面。",
    },
  ],
};

export default function FAQPage() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const currentFAQ = faqData[language] || faqData.en;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">
          {language === "uz"
            ? "Tez-tez so'raladigan savollar"
            : "Frequently Asked Questions"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === "uz"
            ? "Platformamiz va xizmatlarimiz haqida eng ko'p beriladigan savollarga javoblarni toping."
            : "Find answers to the most common questions about our platform and services."}
        </p>
      </div>

      <div className="space-y-4">
        {currentFAQ.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-medium text-lg">{faq.question}</h2>
              <span className="text-muted-foreground">
                {activeIndex === index ? "-" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <p className="mt-2 text-muted-foreground">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
