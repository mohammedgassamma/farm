// src/firebaseConfig.js
"use client";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/app-check";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
const app = firebase.initializeApp(firebaseConfig);

// App Check MUST be activated before Firestore/Storage
firebase.appCheck().activate(
  "6LekOXwsAAAAABwMaVYgWptIYEiBiCOdewpS1OCJ",
  true
);

const firebaseApp = app;
const firebaseProvider = firebase;

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, firebaseApp, firebaseProvider };
