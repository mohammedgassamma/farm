import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTokenExpired(token: string) {
  if (!token) return true;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    const exp = decoded.exp;

    // Compare current time with token expiry
    return Date.now() >= exp * 1000;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
}

export const formatNumberToCurrency = ({
  number,
  currencyCode = "NGN",
  precision = 2,
  language = "en-US",
  removeCurrency = true,
  minimumFractionDigits,
  notation,
}: {
  number: string | number;
  currencyCode?: string;
  precision?: number;
  language?: string;
  removeCurrency?: boolean;
  minimumFractionDigits?: number;
  notation?: "standard" | "scientific" | "engineering" | "compact" | undefined;
}): string => {
  const formatter = new Intl.NumberFormat(language, {
    style: "currency",
    currency: currencyCode,
    notation,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: precision ?? 20,
  });

  let value = Number(number);

  if (isNaN(value)) {
    value = 0;
  }

  let result = formatter.format(value);

  if (removeCurrency) {
    result = result.replace(/[^0-9.,-]+/g, "");
  }

  return result;
};

export const iOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
};

export const uploadImage = async ({ imageUrl }: { imageUrl: string }) => {
  try {
    const formData = new FormData();

    formData.append("image", imageUrl);

    const response = await fetch(
      process.env.NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET_URL || "",
      {
        method: "POST",
        body: formData,
      },
    );

    const imageData = await response.json();

    if (imageData.success) {
      return imageData.data.url;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Image upload failed:", (error as any)?.message);
    return null;
  }
};

export const generateCode = ({ length }: { length: number }) => {
  let out = "";
  const aLen = ALPHABET.length;
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * aLen)];
  }
  return out;
};

export const convertDateFromTimestampFormat = (timestamp: any) => {
  const date = new Date(timestamp?.seconds * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export const convertDateFromTimestamp = (timestamp: any) => {
  const date = new Date(timestamp?.seconds * 1000);
  return date?.toDateString() ?? "";
};

export const getDocument = typeof window !== "undefined" ? document : undefined;
export const getWindow = typeof window !== "undefined" ? window : undefined;

export const handleShareToTwitter = ({
  text,
  url,
}: {
  text: string;
  url: string;
}) => {
  const tweetText = encodeURIComponent(text);
  const tweetUrl = encodeURIComponent(url);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;

  getWindow && window.open(twitterUrl, "_blank");
};

export const openInNewTab = ({ url }: { url: string }) => {
  getWindow && window.open(url, "_blank");
};

export const getPageUrl = (url?: string) => {
  return getWindow ? `${window?.location?.origin}${url || ""}` : "";
};

export const APP_URL = getPageUrl();

export const isDevelopment = process.env.NEXT_PUBLIC_APP_ENV === "development";

export const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production";

export const parseNumericString = (input: string): number | null => {
  // Trim whitespace
  const trimmed = input.toString()?.trim?.();

  if (!trimmed) return null;

  // Extract sign
  const isNegative = trimmed.startsWith("-");
  const withoutSign = isNegative ? trimmed.slice(1) : trimmed;

  // Remove all characters except digits, dots, and commas
  const cleaned = withoutSign.replace(/[^\d.,]/g, "");

  if (!cleaned) return null;

  // Find last occurrence of . and ,
  const lastDotIndex = cleaned.lastIndexOf(".");
  const lastCommaIndex = cleaned.lastIndexOf(",");

  let normalized: string;

  if (lastDotIndex !== -1 && lastCommaIndex !== -1) {
    // Both are present → last one is decimal separator
    if (lastDotIndex > lastCommaIndex) {
      // Dot is the decimal separator
      normalized = cleaned
        .replace(/,/g, "")
        .replace(/\./g, (match, offset) =>
          offset === lastDotIndex ? "." : "",
        );
    } else {
      // Comma is the decimal separator
      normalized = cleaned
        .replace(/\./g, "")
        .replace(/,/g, (match, offset) =>
          offset === lastCommaIndex ? "." : "",
        );
    }
  } else if (lastDotIndex !== -1) {
    // Only dot is present
    const digitsAfterDot = cleaned.length - lastDotIndex - 1;
    if (digitsAfterDot === 3) {
      // Treat as thousands separator
      normalized = cleaned.replace(/\./g, "");
    } else {
      // Treat as decimal separator
      normalized = cleaned.replace(/\./g, (match, offset) =>
        offset === lastDotIndex ? "." : "",
      );
    }
  } else if (lastCommaIndex !== -1) {
    // Only comma is present
    const digitsAfterComma = cleaned.length - lastCommaIndex - 1;
    if (digitsAfterComma === 3) {
      // Treat as thousands separator
      normalized = cleaned.replace(/,/g, "");
    } else {
      // Treat as decimal separator
      normalized = cleaned.replace(/,/g, ".");
    }
  } else {
    // No separators
    normalized = cleaned;
  }

  const result = parseFloat(normalized);

  if (isNaN(result)) return null;

  return isNegative ? -result : result;
};
