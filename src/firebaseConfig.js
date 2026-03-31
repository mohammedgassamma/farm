"use client";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/app-check";

import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = firebase.initializeApp(firebaseConfig);

// 🔒 App Check seulement en production
if (process.env.NEXT_PUBLIC_APP_ENV !== "development") {
  firebase.appCheck().activate(
    "6LekOXwsAAAAABwMaVYgWptIYEiBiCOdewpS1OCJ",
    true
  );
}

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// 🔥 Connexion aux emulators
if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
  connectFirestoreEmulator(
    db,
    process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST,
    Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT)
  );

  connectAuthEmulator(
    auth,
    `http://${process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST}:${process.env.NEXT_PUBLIC_AUTH_EMULATOR_PORT}`
  );
}

export { db, storage, auth, app };