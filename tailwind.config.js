/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        epilogue: ['var(--font-epilogue)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        void: '#08080D',
        surface: '#0F0F17',
        'surface-2': '#15151F',
        'surface-3': '#1C1C29',
        ivory: '#EDE8DF',
        'ivory-muted': '#9E9A90',
        gold: '#EDBB5F',
        'gold-dim': '#9A7535',
        violet: '#8B7CF7',
        'violet-dim': '#4B3FAD',
        jade: '#5BE49A',
        coral: '#F06C6C',
        azure: '#6DB3F7',
      },
      animation: {
        'scan-line': 'scan 1.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '1' },
          '50%': { transform: 'translateY(100%)', opacity: '0.5' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(139, 124, 247, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(139, 124, 247, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
