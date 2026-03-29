// src/firebaseConfig.js
"use client";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/app-check";

import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";


// Remplacer par :
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = firebase.initializeApp(firebaseConfig);

// App Check désactivé en développement
if (process.env.NODE_ENV !== "development") {
    firebase.appCheck().activate(
        "6LekOXwsAAAAABwMaVYgWptIYEiBiCOdewpS1OCJ",
        true
    );
}

const firebaseApp = app;
const firebaseProvider = firebase;

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Connexion aux émulateurs en développement
if (process.env.NODE_ENV === "development") {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export { db, storage, auth, firebaseApp, firebaseProvider };
