"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Copy,
  Share2,
  MessageCircle,
  Phone,
  Facebook,
  Mail,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/components/providers/language-provider";
import { API_CONFIG } from "@/constants/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function ReferralShare() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // referall link generating
  useEffect(() => {
    let userId = "";
    try {
      const userStr = localStorage.getItem("mlm_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id?.toString() || "";
      }
    } catch (e) {
      userId = "";
    }
    // API_CONFIG.baseUrl dan referral link yasash
    if (userId) {
      setReferralLink(
        `${`https://marketing-app-user.vercel.app/ref/${userId}`}`
      );
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: t("copied"),
      description: t("referralLinkCopied"),
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("joinMlmPlatform"),
          text: t("joinMeOnMlm"),
          url: referralLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopy();
    }
  };

  const shareViaTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      referralLink
    )}&text=${encodeURIComponent(t("joinMeOnMlm"))}`;
    window.open(telegramUrl, "_blank");
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      t("joinMeOnMlm") + ": " + referralLink
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      referralLink
    )}`;
    window.open(facebookUrl, "_blank");
  };

  const shareViaVK = () => {
    window.open(
      `https://vk.com/share.php?url=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(
        t("joinMeOnMlm")
      )}&body=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  const shareViaInstagram = () => {
    window.open(
      `https://www.instagram.com/?url=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  const shareViaX = () => {
    window.open(
      `https://x.com/intent/tweet?url=${encodeURIComponent(
        referralLink
      )}&text=${encodeURIComponent(t("joinMeOnMlm"))}`,
      "_blank"
    );
  };

  const shareViaOdnoklassniki = () => {
    window.open(
      `https://connect.ok.ru/offer?url=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  const shareViaReddit = () => {
    window.open(
      `https://www.reddit.com/submit?url=${encodeURIComponent(
        referralLink
      )}&title=${encodeURIComponent(t("joinMeOnMlm"))}`,
      "_blank"
    );
  };

  const shareViaKakaoTalk = () => {
    window.open(
      `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(
        referralLink
      )}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <a
          href={referralLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Input
            value={referralLink}
            readOnly
            className="bg-secondary/10 cursor-pointer"
            style={{ pointerEvents: "none" }}
          />
        </a>
        <Button size="icon" variant="outline" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button className="w-full " onClick={() => setShareModalOpen(true)}>
          <Share2 className="mr-2 h-4 w-4" />
          <span className="hidden md:block"> {t("shareReferralLink")}</span>
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={shareViaTelegram}
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 text-blue-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={shareViaWhatsApp}
            className="flex-1"
          >
            <Phone className="h-4 w-4 text-green-500" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={shareViaFacebook}
            className="flex-1"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        {t("referralBonusInfo")}
      </p>

      {/* Modal dialog for share options */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="max-w-[90vw] rounded-md ">
          <DialogHeader>
            <DialogTitle>
              {t("chooseShareMethod") || "Ulashish usulini tanlang"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <div className="flex gap-3 py-2 min-w-[500px] sm:min-w-0">
              {/* Har bir ulashish tugmasi shu flex ichida */}
              {/* VK */}
              <Button variant="outline" onClick={shareViaVK}>
                <span className="ml-2 flex items-center">
                  {/* VK SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 30 30"
                    fill="white"
                  >
                    <defs>
                      <clipPath id="id1">
                        <path
                          d="M 2.371094 2.394531 L 26 2.394531 L 26 26 L 2.371094 26 Z M 2.371094 2.394531 "
                          clipRule="nonzero"
                          fill="white"
                        ></path>
                      </clipPath>
                    </defs>
                    <g clipPath="url(#id1)">
                      <path
                        fill="white"
                        fillOpacity="1"
                        fillRule="nonzero"
                        d="M 13.496094 2.597656 C 10.730469 2.804688 8.210938 3.941406 6.230469 5.875 C 3.625 8.414062 2.375 12.011719 2.839844 15.625 C 3.414062 20.140625 6.601562 23.902344 10.976562 25.234375 C 14.359375 26.265625 18.125 25.652344 20.992188 23.613281 C 24.515625 21.101562 26.347656 16.9375 25.804688 12.675781 C 25.230469 8.15625 22.042969 4.394531 17.667969 3.0625 C 16.304688 2.660156 14.914062 2.503906 13.496094 2.601562 Z M 14.378906 9.773438 C 14.96875 9.832031 15.265625 9.925781 15.398438 10.097656 C 15.433594 10.144531 15.488281 10.261719 15.523438 10.359375 C 15.589844 10.5625 15.59375 10.792969 15.550781 12.527344 C 15.523438 13.609375 15.539062 13.945312 15.628906 14.183594 C 15.726562 14.460938 15.960938 14.585938 16.164062 14.480469 C 16.347656 14.382812 16.777344 13.914062 17.058594 13.492188 C 17.707031 12.53125 18.101562 11.789062 18.574219 10.640625 C 18.671875 10.414062 18.800781 10.261719 18.933594 10.226562 C 18.984375 10.210938 19.742188 10.199219 20.667969 10.195312 L 22.308594 10.191406 L 22.449219 10.25 C 22.632812 10.304688 22.714844 10.429688 22.695312 10.621094 C 22.695312 10.980469 22.320312 11.722656 21.675781 12.625 C 21.585938 12.75 21.253906 13.195312 20.933594 13.613281 C 20.230469 14.535156 20.078125 14.75 19.972656 14.976562 C 19.835938 15.257812 19.871094 15.492188 20.082031 15.765625 C 20.140625 15.84375 20.453125 16.15625 20.769531 16.460938 C 21.65625 17.3125 22.058594 17.757812 22.386719 18.246094 C 22.621094 18.601562 22.714844 18.859375 22.675781 19.085938 C 22.65625 19.207031 22.535156 19.355469 22.394531 19.425781 C 22.230469 19.511719 21.976562 19.527344 20.582031 19.546875 L 19.261719 19.5625 L 19.046875 19.492188 C 18.503906 19.3125 18.140625 19.007812 17.316406 18.054688 C 16.859375 17.527344 16.519531 17.265625 16.285156 17.265625 C 16.070312 17.265625 15.789062 17.550781 15.679688 17.910156 C 15.597656 18.148438 15.570312 18.335938 15.542969 18.75 C 15.515625 19.246094 15.457031 19.355469 15.15625 19.480469 C 15.046875 19.53125 13.683594 19.546875 13.324219 19.507812 C 12.601562 19.429688 11.933594 19.199219 11.269531 18.8125 C 10.304688 18.25 9.714844 17.742188 9.082031 16.9375 C 7.984375 15.53125 7.234375 14.335938 6.324219 12.535156 C 5.976562 11.832031 5.558594 10.925781 5.492188 10.707031 C 5.425781 10.484375 5.519531 10.300781 5.738281 10.230469 C 5.8125 10.207031 6.234375 10.195312 7.191406 10.179688 L 8.539062 10.167969 L 8.695312 10.226562 C 8.941406 10.320312 9.042969 10.445312 9.214844 10.851562 C 9.359375 11.195312 10.136719 12.753906 10.378906 13.191406 C 10.628906 13.628906 10.890625 14 11.121094 14.214844 C 11.402344 14.492188 11.527344 14.558594 11.726562 14.542969 C 11.894531 14.527344 11.9375 14.488281 12.042969 14.261719 C 12.296875 13.714844 12.335938 11.867188 12.109375 11.140625 C 11.980469 10.726562 11.785156 10.570312 11.246094 10.453125 C 11.152344 10.433594 11.152344 10.398438 11.238281 10.273438 C 11.445312 9.976562 11.816406 9.832031 12.523438 9.773438 C 12.910156 9.742188 14.058594 9.738281 14.375 9.773438 Z M 14.378906 9.773438 "
                      />
                    </g>
                  </svg>
                  <span className="ml-1">VK</span>
                </span>
              </Button>
              {/* Email */}
              <Button variant="outline" onClick={shareViaEmail}>
                <Mail className="h-5 w-5 text-red-500" />
                <span className="ml-2">Email</span>
              </Button>
              {/* Instagram */}
              <Button variant="outline" onClick={shareViaInstagram}>
                <Instagram className="h-5 w-5 text-pink-500" />
                <span className="ml-2">Instagram</span>
              </Button>
              <Button variant="outline" onClick={shareViaX}>
                <Twitter className="h-5 w-5 text-black" />
                <span className="ml-2">X</span>
              </Button>
              <Button variant="outline" onClick={shareViaOdnoklassniki}>
                <Globe className="h-5 w-5 text-orange-500" />
                <span className="ml-2">OK</span>
              </Button>
              <Button variant="outline" onClick={shareViaReddit}>
                {/* Reddit ikonkasi */}
                <span className="ml-2 flex items-center">
                  <svg
                    style={{ color: "red" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M6.167 8a.831.831 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661zm1.843 3.647c.315 0 1.403-.038 1.976-.611a.232.232 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83.458 0 .83-.381.83-.83a.831.831 0 0 0-1.66 0z"
                      fill="red"
                    ></path>
                    <path
                      d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.203.203 0 0 0-.153.028.186.186 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224c-.02.115-.029.23-.029.353 0 1.795 2.091 3.256 4.669 3.256 2.577 0 4.668-1.451 4.668-3.256 0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165z"
                      fill="red"
                    ></path>
                  </svg>
                  <span className="ml-1">Reddit</span>
                </span>
              </Button>
              <Button variant="outline" onClick={shareViaKakaoTalk}>
                <MessageCircle className="h-5 w-5 text-yellow-400" />
                <span className="ml-2">KakaoTalk</span>
              </Button>
              <Button variant="outline" onClick={shareViaTelegram}>
                <MessageCircle className="h-5 w-5 text-blue-500" />
                <span className="ml-2">Telegram</span>
              </Button>
              <Button variant="outline" onClick={shareViaWhatsApp}>
                <Phone className="h-5 w-5 text-green-500" />
                <span className="ml-2">WhatsApp</span>
              </Button>
              <Button variant="outline" onClick={shareViaFacebook}>
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="ml-2">Facebook</span>
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
                <span className="ml-2">{t("copyLink") || "Copy"}</span>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareModalOpen(false)}>
              {t("cancel") || "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
