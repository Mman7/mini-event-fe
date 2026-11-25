"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useThemeStore } from "@/src/stores/theme.store";

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return children;
}
