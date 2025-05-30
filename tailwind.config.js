/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        cyber: {
          black: '#0a0b0f',
          darker: '#12141c',
          dark: '#1a1b23',
          primary: '#00b3ff',
          secondary: '#00f0ff',
          accent: '#ff3e3e',
          text: {
            primary: '#ffffff',
            secondary: '#94a1b2',
          },
          border: '#2a2b33',
          // Light theme
          light: '#f8fafc',
          lightCard: '#ffffffcc',
          lightBorder: '#e2e8f0',
          lightText: '#1a1b23',
        },
        'cyber-primary': 'rgb(0, 179, 255)',
        'cyber-secondary': 'rgb(0, 255, 157)',
        'cyber-dark': 'rgb(26, 27, 35)',
        'cyber-black': 'rgb(15, 16, 21)',
        'cyber-text': 'rgb(255, 255, 255)',
        'cyber-text-secondary': 'rgba(255, 255, 255, 0.7)',
        'cyber-light': 'rgb(255, 255, 255)',
        'cyber-lightCard': 'rgb(248, 249, 250)',
        'cyber-lightText': 'rgb(26, 27, 35)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': {
            'text-shadow': '0 0 10px rgba(0, 179, 255, 0.8), 0 0 20px rgba(0, 179, 255, 0.8), 0 0 30px rgba(0, 179, 255, 0.8)',
          },
          'to': {
            'text-shadow': '0 0 20px rgba(0, 179, 255, 0.8), 0 0 30px rgba(0, 179, 255, 0.8), 0 0 40px rgba(0, 179, 255, 0.8)',
          }
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 179, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.3)',
        'neon-strong': '0 0 40px rgba(0, 179, 255, 0.4), 0 0 80px rgba(0, 240, 255, 0.4)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 179, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 179, 255, 0.1) 1px, transparent 1px)',
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backgroundSize: {
        'cyber-grid': '20px 20px',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  }
} 