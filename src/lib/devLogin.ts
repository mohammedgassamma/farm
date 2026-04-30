// src/lib/devLogin.ts
// FICHIER DE DEV UNIQUEMENT — ne jamais commit sur main

import nookies from "nookies";

export const fakeAdminLogin = () => {
  // Crée un faux JWT qui expire dans 24h
  // Structure : header.payload.signature (tout en base64)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    uid: "dev-admin-local",
    email: "admin@dev.local",
    role: "admin",
    // exp dans 24h en secondes Unix
    exp: Math.floor(Date.now() / 1000) + 86400,
    iat: Math.floor(Date.now() / 1000),
  }));
  const fakeToken = `${header}.${payload}.fake-signature-dev`;

  nookies.set(null, "token", fakeToken, {
    maxAge: 86400,
    path: "/",
  });

  window.location.href = "/";
};