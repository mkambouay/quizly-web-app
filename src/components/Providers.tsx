"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { ThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";

const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <ThemeProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
};

export default Providers;
