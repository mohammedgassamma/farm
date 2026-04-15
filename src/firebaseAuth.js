// src/firebaseAuth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import nookies from "nookies";

import { auth as authFirebase } from "./firebaseConfig";

export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved
        },
      }
    );
  }
};

// **Register User**
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      authFirebase,
      email,
      password
    );
    // console.log("User registered:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw new Error(error.message);
  }
};

// **Login User**
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      authFirebase,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw new Error(error.message);
  }
};

// **Send Forgot Password Email**
export const sendForgotPasswordEmail = async (email) => {
  try {
    await sendPasswordResetEmail(authFirebase, email);
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(authFirebase);

    nookies.destroy(null, "token");
  } catch (error) {
    console.error(error);
  }
};

export { authFirebase };
