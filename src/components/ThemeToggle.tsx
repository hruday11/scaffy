"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      className="cyber-button px-3 py-2 text-xl ml-2 shadow-neon backdrop-blur-md bg-cyber-dark/80 dark:bg-cyber-lightCard/80 border-cyber-primary/40 hover:bg-cyber-primary/20 dark:hover:bg-cyber-secondary/20 transition"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
} 