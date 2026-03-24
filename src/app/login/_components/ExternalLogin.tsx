"use client";
import { firebaseApp, firebaseProvider } from "@/firebaseConfig";
import nookies from "nookies";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

import "./../../firebase.css";
import { userController } from "@/server/controllers/user.controller";
import { serverTimestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";

const uiRef =
  firebaseui.auth.AuthUI.getInstance() ||
  new firebaseui.auth.AuthUI(firebaseApp.auth());

export const ExternalLogin = () => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const t = useTranslations("loginScreen");

  const uiConfig = {
    signInFlow: "popup",
    callbacks: {
      signInSuccessWithAuthResult: async function (
        authResult: any,
        redirectUrl: any
      ) {
        const user = authResult.user;
        const token = await user?.getIdToken();
        const userDb = await userController.createOrAddUser({
          user: user,
        });

        nookies.set(undefined, "token", token as string, {
          path: "/",
          secure: true,
          httpOnly: false, // set to true if you handle it on the server
        });

        router.push("/homescreen");
        return false;
      },
    },
    //   tosUrl: "https://www.google.com",
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      {
        provider: firebaseProvider.auth.GoogleAuthProvider.PROVIDER_ID,
        fullLabel: t("signInWithGoogle"),
        customParameters: {
          prompt: "select_account",
        },
      },
      // {
      //   provider: firebaseProvider.auth.PhoneAuthProvider.PROVIDER_ID,
      //   fullLabel: t("signInWithPhone"),

      //   recaptchaParameters: {
      //     type: "image", // 'audio'
      //     size: "invisible", // 'invisible' or 'compact'
      //     badge: "bottomleft", //' bottomright' or 'inline' applies to invisible.
      //   },
      // },
    ],
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    uiRef.start(containerRef.current, uiConfig as any);
  }, [mounted]);

  return (
    <div
      id="firebaseui-auth-container"
      ref={containerRef}
      //   style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}
    ></div>
  );
};
