import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0A0B0F',
        'cyber-dark': '#1A1B23',
        'cyber-light': '#F8F9FA',
        'cyber-lightCard': '#FFFFFF',
        'cyber-primary': '#00B3FF',
        'cyber-secondary': '#00FFB3',
        'cyber-text': '#000000',
        'cyber-text-secondary': '#4A4A4A',
        'cyber-lightText': '#FFFFFF',
        'cyber-lightText-secondary': '#A0A0A0',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0,179,255,0.3)',
        'neon-strong': '0 0 25px rgba(0,179,255,0.5)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};

export default config; 