"use client";
import * as React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
