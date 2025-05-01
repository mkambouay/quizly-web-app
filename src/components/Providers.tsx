"use client";

import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Providers = ({ children, ...props }: ThemeProviderProps) => {
  //I added this fix for the Hydration problem, regarding the theme
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // useEffect only runs on the client, after initial render
    setMounted(true);
  }, []);

  if (!mounted) {
    // Until mounted, SessionProvider likely doesn't cause hydration issues itself,
    // but ThemeProvider does. So render SessionProvider but *not* ThemeProvider yet.
    // Or, more safely, return null or a basic fragment until mounted
    // to perfectly match a minimal server render.
    // Let's try rendering SessionProvider directly first.
    // If you still get errors, try returning just `<>{children}</>` or `null` here.
    // return <SessionProvider>{children}</SessionProvider>;

    // Safest approach recommended by next-themes: render children directly or null/fallback
    // Returning children assumes the children themselves don't cause mismatches
    // before theme/session is ready.
    return (
      <QueryClientProvider client={queryClient}>
        <SessionProvider>{children}</SessionProvider> //added session provider,
        was missing also
      </QueryClientProvider>
    );
    // Alternatively, if SessionProvider *needs* to wrap early:
    // return <SessionProvider>{children}</SessionProvider>; - test this if needed
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider {...props} attribute="class" defaultTheme="light">
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
