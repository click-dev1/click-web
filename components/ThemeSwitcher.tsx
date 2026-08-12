"use client";

import { useEffect, useState } from "react";

const THEMES = [
  { id: "signal", label: "01" },
  { id: "paper", label: "02" },
  { id: "noir", label: "03" },
  { id: "blue", label: "04" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>("signal");

  useEffect(() => {
    const current = document.documentElement.dataset.theme as ThemeId;
    if (current) setTheme(current);
  }, []);

  function apply(id: ThemeId) {
    setTheme(id);
    document.documentElement.dataset.theme = id;
    try {
      localStorage.setItem("click-theme", id);
    } catch {
      /* private mode: theme just won't persist */
    }
    window.dispatchEvent(new CustomEvent("click-theme-change"));
  }

  return (
    <div
      role="group"
      aria-label="Design direction"
      className="flex items-center gap-1 rounded-full border px-1.5 py-1"
      style={{ borderColor: "var(--hairline)" }}
    >
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          className="theme-btn"
          aria-pressed={theme === t.id}
          onClick={() => apply(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
