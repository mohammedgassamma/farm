// src/app/page.tsx
"use client";
import { redirect } from "next/navigation";
import { HomeScreenClientPage } from "./homescreen/_components/HomeScreen";

export default function RedirectPage() {
  return <HomeScreenClientPage />;
}
