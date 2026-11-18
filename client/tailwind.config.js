/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quest: {
          dark: '#080c14',
          surface: '#0f172a',
          card: '#131d36',
          border: '#1e293b',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          neon: '#10b981',
          gold: '#f59e0b',
          rose: '#f43f5e',
          text: '#f8fafc',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        gaming: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
        code: ['"Fira Code"', 'Consolas', 'monospace']
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'neon-purple': '0 0 15px rgba(139, 92, 246, 0.4)',
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.4)',
        'neon-emerald': '0 0 15px rgba(16, 185, 129, 0.4)',
        'card-glow': '0 4px 20px -2px rgba(15, 23, 42, 0.8), 0 0 0 1px rgba(139, 92, 246, 0.15)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
