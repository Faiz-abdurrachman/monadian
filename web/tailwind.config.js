/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comfortaa: ['Comfortaa', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        orbitron: ['Orbitron', 'monospace'],
      },
      colors: {
        cherry: {
          DEFAULT: '#FF4D6D',
          light: '#FF758F',
          dark: '#C92A47',
          deep: '#A8334E',
        },
        sakura: {
          DEFAULT: '#FCE7F3',
          border: '#FBCFE8',
          bg: '#FFF8F7',
          card: '#FFF5F7',
          glow: 'rgba(255, 182, 193, 0.35)',
        },
        mocha: {
          DEFAULT: '#2F121A',
          muted: '#574144',
        },
        honey: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FDE68A',
        },
        mint: {
          DEFAULT: '#2DD4BF',
          dark: '#0F766E',
          light: '#99F6E4',
        },
        candy: {
          blue: '#38BDF8',
          'blue-dark': '#0284C7',
          'blue-light': '#BAE6FD',
        },
        monad: {
          dark: '#0c0b1e',
          card: '#161432',
          purple: '#836ef9',
          light: '#a088ff',
          cyan: '#06b6d4',
          pink: '#f43f5e',
          amber: '#fbbf24',
          emerald: '#10b981',
          orange: '#f97316',
        }
      },
      boxShadow: {
        'juicy-pink': '0 12px 24px rgba(255, 77, 109, 0.35), 0 6px 0 0 #C92A47',
        'juicy-pink-pressed': '0 4px 12px rgba(255, 77, 109, 0.3), 0 2px 0 0 #C92A47',
        'juicy-white': '0 8px 20px rgba(255, 117, 143, 0.12), 0 4px 0 0 #FDB2C5',
        'juicy-white-pressed': '0 3px 8px rgba(255, 117, 143, 0.12), 0 1px 0 0 #FDB2C5',
        'blossom-card': '0 10px 35px 0 rgba(255, 175, 190, 0.35)',
        'blossom-pill': '0 8px 24px 0 rgba(255, 182, 193, 0.3)',
        'blossom-dock': '0 8px 24px 0 rgba(255, 182, 193, 0.3)',
        'blossom-glow': '0 0 24px rgba(255, 179, 198, 0.45)',
        'clay-button': '0 6px 0 rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2)',
        'clay-card': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.15)',
        'glow-purple': '0 0 20px rgba(131, 110, 249, 0.45)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.45)',
        'glow-amber': '0 0 20px rgba(251, 191, 36, 0.45)',
      },
      animation: {
        'bounce-short': 'bounceShort 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
