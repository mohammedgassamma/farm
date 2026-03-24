"use client";

import { queryClient } from "@/app/apiClient/apiClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./AuthProvider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      {/* TODO: Add official loading state */}
    </QueryClientProvider>
  );
};
