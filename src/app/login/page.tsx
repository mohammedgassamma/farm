"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  registerUser,
  loginUser,
  sendForgotPasswordEmail,
  authFirebase,
} from "@/firebaseAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import nookies from "nookies";

import { useTranslations } from "next-intl";

import { getUserLocale } from "@/services/locale";
import { LanguageSwitcher } from "@/components/reusables/LanguageSwitcher";
import { InstallPrompt } from "@/components/reusables/InstallApp";
import { userController } from "@/server/controllers/user.controller";
import { showToast } from "@/lib/toast";

export default function LoginPage() {
  // const [email, setEmail] = useState("yomionisade@gmail.com");
  // const [password, setPassword] = useState("Password-1234");

  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false); // Toggle between register and login
  const router = useRouter();
  const [locale, setLocale] = useState<string>("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const fetchLocale = async () => {
      const userLocale = await getUserLocale();
      setLocale(userLocale);
    };

    fetchLocale();
  }, []);

  // This will ensure the router is used only on the client-side

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    try {
      if (isRegister) {
        // Register user
        await registerUser(email, password);
        await loginUser(email, password);
      } else {
        await loginUser(email, password);
      }
      const token = await authFirebase.currentUser?.getIdToken();
     
      //await userController.createOrAddUser({ user: authFirebase.currentUser });
      await userController.createOrAddUser({
        user: authFirebase.currentUser,
        extraData: {
          country,
          department,
        },
      });
      nookies.set(undefined, "token", token as string, {
        path: "/",
        secure: true,
        httpOnly: false, // set to true if you handle it on the server
      });
      router.push("/homescreen");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      showToast({
        message:
          error instanceof Error
            ? "Invalid credentials"
            : "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      await sendForgotPasswordEmail(email);
      showToast({ message: "Password reset email sent!", type: "success" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      showToast({
        message: "Error sending password reset email",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="min-h-screen w-full max-w-md bg-white rounded-md shadow-md bggreen">
        <div>
          <LanguageSwitcher />
        </div>
        <div>
          {/* Gamou Logo */}
          <img
            src="/images/gamou-logo.png"
            alt="Gamou Logo"

            // fill
          />
          <img
            src="/images/Logox.jpg"
            alt="Gamou Logo"
            //  fill
          />
        </div>

        <div className="p-6">
          <header className="text-4xl font-bold my-4 text-center">
            <h1 translate="no">{t("login.appTitle")}</h1>
          </header>

          <div className="w-full border-b border-black mb-5"></div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full">
            {/* Email Input */}
            <div className="mb-4">
              <Input
                type="email"
                placeholder={t("loginScreen.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <Input
                type="password"
                placeholder={t("loginScreen.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
            {isRegister && (
              <>
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  />
                </div>

                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Department / Region"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              className="w-full p-3  text-white rounded-md "
              loading={isLoading}
            >
              {isRegister
                ? t("loginScreen.registerButton")
                : t("loginScreen.loginButton")}
            </Button>
          </form>

          {/* Register / Login Toggle */}
          <div className="mt-4 text-center">
            {isRegister ? (
              <p>
                {t("loginScreen.alreadyHaveAccount")}{" "}
                <span
                  onClick={() => setIsRegister(false)}
                  className="textcolor cursor-pointer"
                >
                  {t("loginScreen.loginButton")}
                </span>
              </p>
            ) : (
              <p>
                {t("loginScreen.dontHaveAccount")}{" "}
                <span
                  onClick={() => setIsRegister(true)}
                  className="textcolor cursor-pointer"
                >
                  {t("loginScreen.registerDontHaveAccount")}
                </span>
              </p>
            )}

            <p
              onClick={handleForgotPassword}
              className="textcolor cursor-pointer mt-2"
            >
              {t("loginScreen.forgotPassword")}
            </p>
          </div>
          <div className="mt-[2rem]">
            <InstallPrompt />
          </div>
        </div>
      </div>
    </div>
  );
}
