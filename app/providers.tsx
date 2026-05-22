"use client"

import * as React from "react"
import { ThemeProvider } from "next-themes"
import { UserProvider } from "@/lib/user-context"
import { FederatedProvider } from "@/lib/federated-context"

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return;
    orig.apply(console, args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <UserProvider>
        <FederatedProvider>
          {children}
        </FederatedProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
