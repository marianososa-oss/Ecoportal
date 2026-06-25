"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo día" : "Cambiar a modo noche"}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-brand transition hover:border-brand/50 hover:text-brand-light ${className}`}
    >
      <Sun
        size={17}
        className={`absolute transition-all duration-300 ${
          mounted && !dark ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
      <Moon
        size={17}
        className={`absolute transition-all duration-300 ${
          mounted && dark ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
