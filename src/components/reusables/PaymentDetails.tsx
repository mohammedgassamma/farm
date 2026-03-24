import React, { use, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Check, Copy, CreditCard, DollarSign, Smartphone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const ORANGE_MONEY_DETAILS = {
  MERCHANT_NAME: "STE GAMOU FARMS",
  PHONE_NUMBER: "+223 90 59 20 27",
};

export const BANK_DETAILS = {
  BANK_NAME: "BANQUE NATIONALE DE DEVELOPPEMENT AGRICOLE - MALI",
  ACCOUNT_NAME: "STE GAMOU FARMS",
  SWIFT: "BNADMLBAXXX",
  IBAN: "ML2743043014004000012501081",
  DOMICILIATION: "Agence Centrale Bamako ACI 2000",
};

export const PaymentDetails = ({
  paymentMethod,
  setPaymentMethod,
}: {
  paymentMethod: "orange-money" | "bank-details";
  setPaymentMethod: React.Dispatch<
    React.SetStateAction<"orange-money" | "bank-details">
  >;
}) => {
  const t = useTranslations("cartScreen.checkout");

  return (
    <div className=" space-y-[1rem]">
      {/* Card Details Card */}

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            type="single"
            collapsible
            defaultValue="orange-money"
            className="w-full"
          >
            <AccordionItem value="orange-money" className="border-b">
              <AccordionTrigger
                className="hover:no-underline hover:!bg-transparent"
                onClick={() => setPaymentMethod("orange-money")}
              >
                <div className="flex items-center gap-3 w-full text-left">
                  <RadioGroup
                    value={paymentMethod}
                    className="!border !rounded-full !border-primary"
                    onValueChange={(v) =>
                      setPaymentMethod(v as "orange-money" | "bank-details")
                    }
                  >
                    <RadioGroupItem
                      value="orange-money"
                      id="orange"
                      className="hover:!bg-transparent  "
                    />
                  </RadioGroup>
                  <Image
                    src="/images/partners/orange-money.png"
                    alt="Orange Money Logo"
                    width={30}
                    height={40}
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {t("paymentMethods.orangeMoney")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("orangeMoney.subtitle")}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <OrangePaymentDetails />
              </AccordionContent>
            </AccordionItem>

            {/* US Bank Details */}
            <AccordionItem
              value="bank-details"
              className="border-b hover:!bg-transparent"
            >
              <AccordionTrigger
                className="hover:no-underline hover:!bg-transparent"
                onClick={() => setPaymentMethod("bank-details")}
              >
                <div className="flex items-center gap-3 w-full text-left">
                  <RadioGroup
                    value={paymentMethod}
                    className="!border !rounded-full !border-primary"
                    onValueChange={(v) =>
                      setPaymentMethod(v as "orange-money" | "bank-details")
                    }
                  >
                    <RadioGroupItem
                      value="bank-details"
                      id="bank"
                      className="hover:!bg-transparent "
                    />
                  </RadioGroup>
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-foreground">
                      {t("paymentMethods.bankDetails")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("bankDetails.subtitle")}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <AccountBankDetails />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

const OrangePaymentDetails = () => {
  const t = useTranslations("cartScreen.checkout");
  return (
    <div className="space-y-4 pt-4">
      <OrangePaymentLine
        title={t("orangeMoney.merchantName")}
        value={ORANGE_MONEY_DETAILS.MERCHANT_NAME}
      />
      <OrangePaymentLine
        title={t("orangeMoney.merchantNumber")}
        value={ORANGE_MONEY_DETAILS.PHONE_NUMBER}
      />

      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg">
        <p className="text-sm text-orange-800 dark:text-orange-200">
          {t("orangeMoney.description")}
        </p>
      </div>
    </div>
  );
};

const AccountBankDetails = () => {
  return (
    <div className="space-y-3 pt-4">
      <BankPaymentLine title="Bank Name" value={BANK_DETAILS.BANK_NAME} />
      <BankPaymentLine
        title="Account Holder"
        value={BANK_DETAILS.ACCOUNT_NAME}
      />
      <BankPaymentLine title="SWIFT/BIC" value={BANK_DETAILS.SWIFT} />
      <BankPaymentLine title="IBAN" value={BANK_DETAILS.IBAN} />
      <BankPaymentLine
        title="Domiciliation"
        value={BANK_DETAILS.DOMICILIATION}
      />

      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Use the details above for your bank transfer. Copy them with the copy
          buttons for easy reference.
        </p>
      </div>
    </div>
  );
};

const BankPaymentLine = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
      <Label className="text-xs font-medium text-muted-foreground uppercase">
        {title}
      </Label>
      <div className="flex items-center justify-between gap-2 mt-1 w-full">
        <p className="font-semibold text-foreground flex-1 w-full">{value}</p>
        <CopySystem key={title} value={value} />
      </div>
    </div>
  );
};
const OrangePaymentLine = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
      <Label className="text-xs font-medium text-muted-foreground uppercase">
        {title}
      </Label>
      <div className="flex items-center justify-between gap-2 mt-1 w-full">
        <p className="font-semibold text-foreground flex-1 w-full">{value}</p>
        <CopySystem key={title} value={value} />
      </div>
    </div>
  );
};

const CopySystem = ({
  key,
  value,
  copyClassName,
}: {
  value: string;
  key: string;
  copyClassName?: string;
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = (text: string, field?: string) => {
    navigator.clipboard.writeText(text);
    // setCopiedField(key || "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      role="button"
      onClick={() => handleCopy(value, key)}
      className=" rounded transition-colors hover:!bg-transparent inline cursor-pointer"
    >
      {isCopied ? (
        <Check className={`w-4 h-4 ${"text-green-600"}`} />
      ) : (
        <Copy className={`w-4 h-4 ${copyClassName || "text-blue-600"}`} />
      )}
    </div>
  );
};
