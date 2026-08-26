"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);
const THEME_EVENT = "theme-change";

function readStored(): Theme {
  if (typeof document === "undefined") return "system";
  const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/);
  const value = match?.[1];
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

function systemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function subscribeTheme(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(THEME_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(THEME_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function applyTheme(theme: Theme, isSystemDark: boolean) {
  const isDark = theme === "dark" || (theme === "system" && isSystemDark);
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const theme = React.useSyncExternalStore(
    subscribeTheme,
    readStored,
    () => defaultTheme,
  );
  const isSystemDark = React.useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    systemDark,
    () => false,
  );

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (isSystemDark ? "dark" : "light") : theme;

  React.useEffect(() => {
    applyTheme(theme, isSystemDark);
  }, [theme, isSystemDark]);

  const setTheme = React.useCallback((t: Theme) => {
    try {
      document.cookie = `theme=${t}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // ignore cookie failures
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
