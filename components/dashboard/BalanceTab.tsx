"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import io from "socket.io-client";
import { API_CONFIG } from "@/constants/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CoinCalculator } from "@/components/dashboard/CoinCalculator";
import { WithdrawHistory } from "@/components/dashboard/WithdrawHistory";

const WS_URL = API_CONFIG.wsUrl;

const COUNTRIES = [
  { code: "UZ", name: "O‘zbekiston" },
  { code: "RU", name: "Rossiya" },
  { code: "KZ", name: "Qozog‘iston" },
];

const CARD_TYPES = [
  { type: "uzcard", label: "Uzcard" },
  { type: "humo", label: "Humo" },
  { type: "visa", label: "Visa" },
  { type: "mastercard", label: "Mastercard" },
  { type: "mir", label: "Mir" },
  { type: "unionpay", label: "UnionPay" },
  { type: "maestro", label: "Maestro" },
];

const CURRENCIES = [
  { code: "UZS", name: "So'm" },
  { code: "USD", name: "Dollar" },
  { code: "RUB", name: "Rubl" },
  { code: "EUR", name: "Yevro" },
  { code: "KZT", name: "Tenge" },
  { code: "TRY", name: "Turk lira" },
  { code: "AED", name: "Dirham" },
  { code: "CNY", name: "Yuan" },
];

// MOCK: Coin kurslari (1 coin = X valyuta)
const MOCK_COIN_RATES: Record<string, number> = {
  UZS: 1200,
  USD: 0.1,
  RUB: 9,
  EUR: 0.09,
  KZT: 45,
  TRY: 3.2,
  AED: 0.36,
  CNY: 0.7,
};

export function BalanceTab({ userId, coin }: { userId: string; coin: number }) {
  // Modal holatlari
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  // To‘ldirish uchun
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(CURRENCIES[0].code); // To‘ldirish uchun valyuta
  const [cardType, setCardType] = useState(CARD_TYPES[0].type);
  const [step, setStep] = useState<"form" | "wait_card" | "paying" | "done">(
    "form"
  );
  const [adminCard, setAdminCard] = useState<{
    number: string;
    bank: string;
  } | null>(null);
  const [timer, setTimer] = useState(120);
  const [checkFile, setCheckFile] = useState<File | null>(null);

  // Yechish uchun
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState<
    "idle" | "waiting" | "approved" | "rejected"
  >("idle");
  const [withdrawCardNumber, setWithdrawCardNumber] = useState("");
  const [withdrawCardType, setWithdrawCardType] = useState(CARD_TYPES[0].type);
  const [withdrawCurrency, setWithdrawCurrency] = useState(CURRENCIES[0].code); // Yechishda valyuta

  // Tarix uchun (faqat API orqali to‘ldiriladi)
  const [withdrawHistory, setWithdrawHistory] = useState<
    { id: number; amount: number; status: string; date: string; card: string }[]
  >([]);

  const socketRef = useRef<any>(null);

  // paymentResponse xabari uchun state
  const [paymentResponseMsg, setPaymentResponseMsg] = useState<string | null>(
    null
  );

  // Konvertatsiya natijasi uchun state
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  // WebSocket ulanishi
  useEffect(() => {
    socketRef.current = io(WS_URL, {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("mlm_token") },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    // paymentResponse eventini tinglash
    socketRef.current.on("paymentResponse", (data: { message?: string }) => {
      if (data?.message) {
        setPaymentResponseMsg(data.message);
        setStep("wait_card");
        toast.info(data.message);
      }
    });

    // Admin karta yuboradi
    socketRef.current.on(
      "card_info",
      (data: { cardNumber: string; message: string }) => {
        setAdminCard({ number: data.cardNumber, bank: "Admin bank" });
        setStep("paying");
        setTimer(120);
        toast.info(data.message);
      }
    );

    // To‘lov natijasi
    socketRef.current.on(
      "payment_confirmed",
      (data: { confirmed: boolean; message: string }) => {
        if (data.confirmed) {
          setStep("done");
          toast.success(data.message || "To‘ldirish muvaffaqiyatli!");
        } else {
          toast.error(data.message || "To‘ldirishda xatolik!");
        }
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Timer
  useEffect(() => {
    if (step === "paying" && timer > 0) {
      const t = setTimeout(() => setTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  // Coin miqdorini va valyutani kuzatib, natijani hisoblash
  useEffect(() => {
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setConvertedAmount(null);
      return;
    }
    const rate = MOCK_COIN_RATES[currency] || 1;
    setConvertedAmount(amountNum * rate);
  }, [amount, currency]);

  // To‘ldirish so‘rovi
  const handleDepositRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error("Summani kiriting");
    socketRef.current.emit("paymentRequest", {
      currency,
      how_much: amount,
    });
    setStep("wait_card");
  };

  // Chek yuklash
  const handleCheckUpload = () => {
    if (!checkFile) return toast.error("Chekni yuklang");
    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit("upload_screenshot", {
        screenshotUrl: reader.result, // Faylni base64 ko‘rinishda yuboriladi
      });
      setStep("wait_card");
    };
    reader.readAsDataURL(checkFile);
  };

  // Pul yechish so‘rovi
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0)
      return toast.error("Summani kiriting");
    if (Number(withdrawAmount) > coin)
      return toast.error("Balansda yetarli coin yo‘q");
    if (!withdrawCardNumber || withdrawCardNumber.length < 8)
      return toast.error("Karta raqamini to‘g‘ri kiriting");
    // Bu yerda currency almashtirish uchun serverga yuboriladi
    socketRef.current.emit("withdraw_request", {
      userId,
      amount: withdrawAmount,
      cardNumber: withdrawCardNumber,
      cardType: withdrawCardType,
      currency: withdrawCurrency,
    });
    setWithdrawStatus("waiting");
  };

  // Tarix uchun format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Tarix uchun API orqali olish
  useEffect(() => {
    const API_URL = "https://mlm-backend.pixl.uz/payments/user";
    const token = localStorage.getItem("mlm_token");
    if (!token) return;

    fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Xatolik: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // data massiv bo'lsa yoki data.payments bo'lsa
        const history = Array.isArray(data)
          ? data
          : Array.isArray(data.payments)
          ? data.payments
          : [];
        setWithdrawHistory(
          history.map((item: any, idx: number) => ({
            id: item.id || idx,
            amount: item.amount,
            status: item.status,
            date: item.date || item.created_at,
            card: item.card || item.card_number || "",
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <Card className="bg-white dark:bg-[#111827] shadow-lg mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-10">
              <CardTitle className="text-black dark:text-white">
                Balans: <span className="text-primary">{coin} 🟡 </span>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Coin’ni to‘ldirish yoki yechish uchun quyidagi tugmalardan
                foydalaning
              </CardDescription>
            </div>
            <CoinCalculator />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              className="bg-[#00FF99] text-white hover:bg-[#00FF99]/90 flex-1"
              onClick={() => {
                setOpenDeposit(true);
                setStep("form");
                setAmount("");
                setAdminCard(null);
                setCheckFile(null);
              }}
            >
              Pul to‘ldirish
            </Button>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 flex-1"
              onClick={() => {
                setOpenWithdraw(true);
                setWithdrawAmount("");
                setWithdrawCardNumber("");
                setWithdrawCardType(CARD_TYPES[0].type);
                setWithdrawStatus("idle");
              }}
            >
              Pul yechish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pul to‘ldirish MODAL */}
      <Dialog
        open={openDeposit}
        onOpenChange={(open) => {
          setOpenDeposit(open);
          if (!open) {
            setPaymentResponseMsg(null);
            setStep("form");
            setAmount("");
            setAdminCard(null);
            setCheckFile(null);
            setConvertedAmount(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Coin to‘ldirish</DialogTitle>
            <DialogDescription>
              Coin’ni to‘ldirish uchun so‘rov yuboring
            </DialogDescription>
          </DialogHeader>
          {/* paymentResponse xabari */}
          {paymentResponseMsg && (
            <div className="mb-4 p-3 rounded bg-blue-50 text-blue-800 border border-blue-200 text-center">
              {paymentResponseMsg}
            </div>
          )}
          {step === "form" && (
            <form onSubmit={handleDepositRequest} className="space-y-4">
              <Label>Coin miqdorini kiriting</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
                required
              />
              <Label>Valyuta</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full border rounded px-2 py-1">
                  <SelectValue placeholder="Valyutani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Konvertatsiya natijasi */}
              {convertedAmount !== null && (
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  {amount} coin ≈{" "}
                  <b>
                    {convertedAmount} {currency}
                  </b>
                </div>
              )}
              <Label>Karta turi</Label>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger className="w-full border rounded px-2 py-1">
                  <SelectValue placeholder="Karta turini tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {CARD_TYPES.map((c) => (
                    <SelectItem key={c.type} value={c.type}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#00FF99] text-white hover:bg-[#00FF99]/90"
                >
                  To‘ldirish so‘rovi
                </Button>
              </DialogFooter>
            </form>
          )}
          {step === "wait_card" && (
            <div className="text-center py-8">
              <p>Admin kartani yuborishini kuting...</p>
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mt-4"></div>
            </div>
          )}
          {step === "paying" && adminCard && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-bold">
                  Kartaga {amount} {currency} o‘tkazing:
                </p>
                <p className="text-lg">
                  {adminCard.number} ({adminCard.bank})
                </p>
                <p className="text-sm text-red-500">
                  Chekni yuklash uchun {timer} soniya qoldi
                </p>
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCheckFile(e.target.files?.[0] || null)}
              />
              <Button
                onClick={handleCheckUpload}
                className="w-full flex gap-2 bg-[#00FF99] text-white hover:bg-[#00FF99]/90"
              >
                <Upload className="w-4 h-4" /> Chekni yuborish
              </Button>
            </div>
          )}
          {step === "done" && (
            <div className="text-center py-8">
              <p className="text-green-600 font-bold">
                To‘ldirish muvaffaqiyatli!
              </p>
              <Button
                onClick={() => {
                  setStep("form");
                  setAmount("");
                  setAdminCard(null);
                  setOpenDeposit(false);
                }}
                className="bg-[#00FF99] text-white hover:bg-[#00FF99]/90"
              >
                Yopish
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pul yechish MODAL */}
      <Dialog open={openWithdraw} onOpenChange={setOpenWithdraw}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Coin yechish</DialogTitle>
            <DialogDescription>
              Coin’ni boshqa valyutaga almashtirib yechish uchun so‘rov yuboring
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <Label>Coin miqdorini kiriting</Label>
            <Input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              min={1}
              max={coin}
              required
            />
            <Label>Valyuta</Label>
            <Select
              value={withdrawCurrency}
              onValueChange={setWithdrawCurrency}
            >
              <SelectTrigger className="w-full border rounded px-2 py-1">
                <SelectValue placeholder="Valyutani tanlang" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>Karta raqami</Label>
            <Input
              type="text"
              value={withdrawCardNumber}
              onChange={(e) =>
                setWithdrawCardNumber(e.target.value.replace(/\D/g, ""))
              }
              maxLength={19}
              placeholder="XXXX XXXX XXXX XXXX"
              required
            />
            <Label>Karta turi</Label>
            <Select
              value={withdrawCardType}
              onValueChange={setWithdrawCardType}
            >
              <SelectTrigger className="w-full border rounded px-2 py-1">
                <SelectValue placeholder="Karta turini tanlang" />
              </SelectTrigger>
              <SelectContent>
                {CARD_TYPES.map((c) => (
                  <SelectItem key={c.type} value={c.type}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                disabled={withdrawStatus === "waiting"}
              >
                {withdrawStatus === "waiting"
                  ? "So‘rov yuborildi..."
                  : "Yechish so‘rovi"}
              </Button>
            </DialogFooter>
          </form>
          {withdrawStatus === "approved" && (
            <p className="text-green-600 mt-4">Pul yechish tasdiqlandi!</p>
          )}
          {withdrawStatus === "rejected" && (
            <p className="text-red-600 mt-4">Pul yechish rad etildi!</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Tarix */}
      <WithdrawHistory
        history={withdrawHistory}
        currency={withdrawCurrency}
        // isLoading={withdrawAmount || withdrawHistory.length === 0}
      />
    </div>
  );
}
