/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#ff6b35',
          dark: '#e05a2d',
          light: '#ff8659',
        },
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
        },
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          border: '#e2e8f0',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
