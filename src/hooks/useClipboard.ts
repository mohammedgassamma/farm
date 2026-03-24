import { useState, useCallback } from "react";

interface UseClipboardOptions {
  timeout?: number;
}

export function useClipboard({ timeout = 2000 }: UseClipboardOptions = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState<number | null>(null);
  const [copyValue, setCopyValue] = useState<string | null>(null);

  const copy = useCallback(
    async (valueToCopy: string) => {
      if ("clipboard" in navigator) {
        try {
          await navigator.clipboard.writeText(valueToCopy);
          setCopyValue(valueToCopy);
          setCopied(true);
          setError(null);

          if (copyTimeout) {
            window.clearTimeout(copyTimeout);
          }

          const newTimeout = window.setTimeout(() => {
            setCopied(false);
          }, timeout);

          setCopyTimeout(newTimeout);
        } catch (err) {
          setError(err as Error);
          setCopied(false);
        }
      } else {
        setError(
          new Error("useClipboard: navigator.clipboard is not supported")
        );
      }
    },
    [timeout, copyTimeout]
  );

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
    if (copyTimeout) {
      window.clearTimeout(copyTimeout);
    }
  }, [copyTimeout]);

  const isCopied = (value: string) => {
    return copied && copyValue === value;
  };

  return { copy, reset, error, copied, isCopied };
}
