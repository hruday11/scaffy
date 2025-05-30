/** @type {import('tailwindcss').Config} */
module.exports = {
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
          border: '#2a2b33'
        }
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
        'neon': '0 0 5px theme(colors.cyber.primary), 0 0 20px theme(colors.cyber.primary)',
        'neon-strong': '0 0 10px theme(colors.cyber.primary), 0 0 30px theme(colors.cyber.primary), 0 0 50px theme(colors.cyber.primary)',
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(theme(colors.cyber.primary / 0.1) 1px, transparent 1px), linear-gradient(90deg, theme(colors.cyber.primary / 0.1) 1px, transparent 1px)',
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
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 