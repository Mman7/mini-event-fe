import { create } from "zustand";

const themeStorageKey = "Mini Event-theme";

export type Theme = "corporate" | "night";

type ThemeState = {
  theme: Theme;
  initializeTheme: () => void;
  setTheme: (theme: Theme) => void;
};

function isTheme(value: string | null): value is Theme {
  return value === "corporate" || value === "night";
}

function getPreferredTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "corporate";
}

function getInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem(themeStorageKey);
  return isTheme(storedTheme) ? storedTheme : getPreferredTheme();
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "corporate",
  initializeTheme: () => {
    const initialTheme = getInitialTheme();
    set({ theme: initialTheme });
    applyTheme(initialTheme);
  },
  setTheme: (theme) => {
    set({ theme });
    window.localStorage.setItem(themeStorageKey, theme);
    applyTheme(theme);
  },
}));
