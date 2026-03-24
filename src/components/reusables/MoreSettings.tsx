import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClipboard } from "@/hooks/useClipboard";
import { useLanguage } from "@/hooks/useLanguage";
import { APP_URL, isDevelopment, openInNewTab } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { Ellipsis, Share } from "lucide-react";
import { useTranslations } from "next-intl";

const PRIVACY_LINK = {
  fr: "https://drive.google.com/file/d/1jir4TqJ2HN1dlRWCe8FOkx2AL4HITlQe/view",
  en: "https://drive.google.com/file/d/1goomgPv6B45XYog0D3IFfbPb5_rEQ0EO/view",
  es: "https://drive.google.com/file/d/1goomgPv6B45XYog0D3IFfbPb5_rEQ0EO/view",
};

export const SOCIAL_MEDIA_LINKS = [
  {
    title: "Twitter",
    link: "https://youtube.com/@gamoufarms?si=74pgxmtQy8dyA1Pp",
  },
  {
    title: "YouTube",
    link: "https://youtube.com/@gamoufarms?si=74pgxmtQy8dyA1Pp",
  },
  {
    title: "Facebook",
    link: "https://www.facebook.com/share/1EnVSMCjpU/?mibextid=wwXIfr",
  },
  {
    title: "Threads",
    link: "https://www.threads.com/@gamoufarms?igshid=NTc4MTIwNjQ2YQ==",
  },
  {
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/thierno-diallo-2aa94543?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
  },
  {
    title: "TikTok",
    link: "https://www.tiktok.com/@gamoufarms?_r=1&_t=ZP-92CHKndX9Pb",
  },
  {
    title: "Snapchat",
    link: "https://snapchat.com/t/8svwbZSD",
  },
  {
    title: "Telegram",
    link: "https://t.me/gamoufarms", // link not provided
  },
];

export const MoreSettings = () => {
  //   const { saveCurrencyToStorage, currency: userCurrency } = useUserCurrency();
  const t = useTranslations("settings.menu");
  const { copy, isCopied } = useClipboard();
  const { logout } = useAuth();
  const { locale } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="p-2 text-white bg-primary w-[60px] flex justify-center">
          <Ellipsis />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        {/* <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel> */}
        {/* <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Currency</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent forceMount>
                {currencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.value}
                    className={cn(
                      userCurrency === currency.value && "bg-gray-200"
                    )}
                    onClick={() => saveCurrencyToStorage(currency.value)}
                  >
                    {currency.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup> */}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            const privacyUrl =
              (PRIVACY_LINK as any)[locale] || PRIVACY_LINK["en"];

            console.log({ locale });

            openInNewTab({ url: privacyUrl });
          }}
        >
          {t("useAndPrivacy")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            copy(APP_URL);
          }}
        >
          {" "}
          <Share />
          {isCopied(APP_URL) ? t("share.copied") : t("share.title")}
        </DropdownMenuItem>
        {/* <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Share />
              {isCopied(APP_URL) ? t("share.copied") : t("share.title")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent forceMount>
                {SOCIAL_MEDIA_LINKS.map((platform) => (
                  <DropdownMenuItem
                    key={platform.title}
                    onSelect={(e) => {
                      e.preventDefault();
                      copy(platform.link || APP_URL);
                    }}
                  >
                    {isCopied(platform.link || APP_URL)
                      ? t("share.copied")
                      : platform.title}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    copy(APP_URL);
                  }}
                >
                  {isCopied(APP_URL) ? t("share.copied") : t("share.copy")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup> */}

        {isDevelopment ? (
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
