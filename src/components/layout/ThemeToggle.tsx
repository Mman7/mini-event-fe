"use client";

import { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "@/src/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "night";

  return (
    <button
      className="btn btn-ghost btn-sm gap-2"
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={() => setTheme(isDark ? "corporate" : "night")}
    >
      {isDark ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
