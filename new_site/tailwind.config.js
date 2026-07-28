/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        mono: {
          bg: '#050505',
          panel: '#0a0a0a',
          line: '#1c1c1c',
          lineHover: '#333333',
          muted: '#888888',
          subtle: '#555555',
        }
      }
    },
  },
  plugins: [],
}
