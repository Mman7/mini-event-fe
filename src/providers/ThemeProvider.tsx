"use client";

import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const themeStorageKey = "Mini Event-theme";
type Theme = "corporate" | "night";

function isTheme(value: string | null): value is Theme {
  return value === "corporate" || value === "night";
}

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [theme, setThemeState] = useState<Theme>("corporate");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    const nextTheme = isTheme(storedTheme)
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "night"
        : "corporate";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function setTheme(nextTheme: Theme) {
    setThemeState(nextTheme);
    window.localStorage.setItem(themeStorageKey, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "corporate",
  setTheme: () => undefined,
});
